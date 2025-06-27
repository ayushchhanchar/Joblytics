import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post("http://localhost:3000/api/signin", data);
      console.log(res.data);
      alert("Login successful");
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-xl space-y-4">
      <h2 className="text-2xl font-bold text-center">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("email")} placeholder="Email" className="w-full p-2 border rounded" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="w-full p-2 border rounded"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Login
        </button>
      </form>
    </div>
  );
}
