import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  ApplicationStatusList,
  ApplicationStatusLabels,
} from "../constants/application-status";


const schema = z.object({
  company: z.string().min(2, "Company is required"),
  role: z.string().min(2, "Role is required"),
  jobUrl: z.string().url("Enter a valid URL"),
  location: z.string().min(2, "Location is required"),
  status: z.enum(ApplicationStatusList),
  appliedAt: z
    .preprocess((val) => (typeof val === "string" && val !== "" ? new Date(val) : undefined), z.date().optional()),
});

type FormData = z.infer<typeof schema>;

export default function AddApplicationForm({
  onAdd,
  onClose,
}: {
  onAdd: () => void;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
  });

  const onSubmit = async (data: FormData) => {
    try {
      const finalData = {
        ...data,
        appliedAt: data.appliedAt ? new Date(data.appliedAt) : undefined,
      };
      await axios.post("http://joblytics.notdeveloper.in/api/add-applications", finalData, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      reset();
      onAdd();
      onClose();
      alert("Application added successfully");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border-t pt-6 mt-6">
      <h3 className="text-xl font-semibold text-center">Track a Job Application</h3>

      <div>
        <input {...register("company")} placeholder="Company" className="w-full p-2 border rounded" />
        {errors.company && <p className="text-red-500 text-sm">{errors.company.message}</p>}
      </div>

      <div>
        <input {...register("role")} placeholder="Role" className="w-full p-2 border rounded" />
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
      </div>

      <div>
        <input {...register("location")} placeholder="Location" className="w-full p-2 border rounded" />
        {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
      </div>

      <div>
        <input {...register("jobUrl")} placeholder="Job URL" type="url" className="w-full p-2 border rounded" />
        {errors.jobUrl && <p className="text-red-500 text-sm">{errors.jobUrl.message}</p>}
      </div>

      <div>
        <select {...register("status")} className="w-full p-2 border rounded">
          <option value="">Select Status</option>
          {ApplicationStatusList.map((status) => (
            <option key={status} value={status}>
              {ApplicationStatusLabels[status]}
            </option>
          ))}
        </select>
        {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
      </div>

      <div>
        <input type="date" {...register("appliedAt")} className="w-full p-2 border rounded" />
        {errors.appliedAt && <p className="text-red-500 text-sm">{errors.appliedAt.message}</p>}
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Save Application
      </button>
    </form>
  );
}
