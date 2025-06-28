import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const schema = z.object({
  name: z.string().min(2).regex(/^[A-Za-z\s]+$/, "Only letters and spaces allowed"),
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/, "Weak password"),
  resume: z.any(),
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("resume", data.resume[0]);

    try {
      const res = await axios.post("http://localhost:3000/api/register", formData);
      console.log(res.data);
      alert("Registration successful");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-xl space-y-4">
      <h2 className="text-2xl font-bold text-center">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("name")} placeholder="Name" className="w-full p-2 border rounded" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        <input {...register("email")} placeholder="Email" className="w-full p-2 border rounded" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="w-full p-2 border rounded"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <input type="file" {...register("resume")}  className="w-full p-2 border rounded" />
        {errors.resume && <p className="text-red-500 text-sm">Resume is required</p>}

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
      <h3>Already have an account? <a className="text-red-500 hover:text-red-700 hover:underline" href="/login">Login</a></h3>
    </div>
  );
}
