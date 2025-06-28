import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { InputField } from "../components/InputField";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { BarChart3, User, Mail, Lock, Upload, Loader2, CheckCircle } from "lucide-react";
import { ModeToggle } from "../components/ui/mode-toggle";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
      "Password must contain uppercase, lowercase, number, and special character"
    ),
  confirmPassword: z.string(),
  resume: z.any().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({ 
    resolver: zodResolver(schema),
    mode: "onBlur"
  });

  const watchedPassword = watch("password");

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");
    
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    
    if (data.resume && data.resume[0]) {
      formData.append("resume", data.resume[0]);
    }

    try {
      const res = await axios.post("http://localhost:3000/api/register", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.error || 
        "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "" };
    
    let strength = 0;
    const checks = [
      password.length >= 6,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    
    strength = checks.filter(Boolean).length;
    
    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
    
    return {
      strength,
      label: labels[strength - 1] || "",
      color: colors[strength - 1] || "bg-gray-300",
      percentage: (strength / 5) * 100,
    };
  };

  const passwordStrength = getPasswordStrength(watchedPassword || "");

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/20 via-background to-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-0 bg-card/50 backdrop-blur">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Account Created!</h2>
              <p className="text-muted-foreground">
                Welcome to Joblytics Pro. Redirecting you to login...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/20 via-background to-muted/30 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 h-72 w-72 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 h-72 w-72 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Joblytics Pro</span>
          </div>
          <div className="absolute top-4 right-4">
            <ModeToggle />
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Create your free account</CardTitle>
            <CardDescription className="text-base">
              Start managing your job search like a pro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}

              <InputField
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                error={errors.name?.message}
                required
                {...register("name")}
              />

              <InputField
                label="Email"
                type="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                required
                {...register("email")}
              />

              <div className="space-y-2">
                <InputField
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  error={errors.password?.message}
                  required
                  {...register("password")}
                />
                
                {watchedPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Password strength</span>
                      <span className={`font-medium ${
                        passwordStrength.strength >= 4 ? 'text-green-600' : 
                        passwordStrength.strength >= 3 ? 'text-blue-600' :
                        passwordStrength.strength >= 2 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <InputField
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                error={errors.confirmPassword?.message}
                required
                {...register("confirmPassword")}
              />

              <div className="space-y-2">
                <Label htmlFor="resume" className="text-sm font-medium">
                  Resume (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    {...register("resume")}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload your resume for ATS analysis (PDF, DOC, DOCX)
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-11" disabled>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link 
                to="/login" 
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}