
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const statusOptions = ["Applied", "Interview", "Offer", "Rejected", "Hired"];

const schema = z.object({
  company: z.string().min(2, "Company is required"),
  role: z.string().min(2, "Role is required"),
  jobUrl: z.string().url("Enter a valid URL"),
  status: z.enum(["Applied", "Interview", "Offer", "Rejected", "Hired"]),
  appliedAt: z.string().min(1, "Date is required"),
});

type FormData = z.infer<typeof schema>;

export default function Dashboard() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post("/api/applications", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Saved:", res.data);
      reset();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold text-center">Track a Job Application</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <input
            {...register("company")}
            placeholder="Company"
            className="w-full p-2 border rounded"
          />
          {errors.company && <p className="text-red-500 text-sm">{errors.company.message}</p>}
        </div>

        <div>
          <input
            {...register("role")}
            placeholder="Role"
            className="w-full p-2 border rounded"
          />
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        </div>

        <div>
          <input
            {...register("jobUrl")}
            placeholder="Job URL"
            className="w-full p-2 border rounded"
            type="url"
          />
          {errors.jobUrl && <p className="text-red-500 text-sm">{errors.jobUrl.message}</p>}
        </div>

        <div>
          <select {...register("status")} className="w-full p-2 border rounded">
            <option value="">Select Status</option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
        </div>

        <div>
          <input
            type="date"
            {...register("appliedAt")}
            className="w-full p-2 border rounded"
          />
          {errors.appliedAt && <p className="text-red-500 text-sm">{errors.appliedAt.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Application
        </button>
      </form>
    </div>
  );
}
