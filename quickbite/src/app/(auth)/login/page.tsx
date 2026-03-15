"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LogIn, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useAuth } from "@/store/useAuth";

// Validation Schema matching Postman requirements
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const { login } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Capture the response data from the login API
      const response = await login({
        email: data.email,
        password: data.password,
      });

      addNotification("Welcome back to GustoBistro!", "success");

      // Extract roles from the response safely
      const userRoles = response?.user?.roles || response?.roles || [];

      // Check if the user has an admin role (handling potential case differences)
      const isAdmin = userRoles.some(
        (role: string) => role.toLowerCase() === "admin",
      );

      // Route based on role
      if (isAdmin) {
        router.push("/admin");
      } else {
        router.push("/menu");
      }
    } catch (error: any) {
      addNotification("Invalid email or password", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-3 text-sm text-gray-500 font-medium">
          Sign in to access your delicious orders.
        </p>
      </div>

      <form className="mt-10 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5">
          <div>
            <Input
              {...register("email")}
              label="Email Address"
              type="email"
              placeholder="admin@test.com"
              error={errors.email?.message}
            />
          </div>

          <div>
            <Input
              {...register("password")}
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 transition-all"
            />
            <span className="text-gray-500 font-medium group-hover:text-gray-700">
              Remember me
            </span>
          </label>
          <Link
            href="#"
            className="font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-black rounded-2xl text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-orange-600/20"
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-4">
            {isLoading ? (
              <Loader2 size={20} className="animate-spin text-orange-200" />
            ) : (
              <LogIn
                size={20}
                className="text-orange-200 group-hover:text-white transition-colors"
              />
            )}
          </span>
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500 font-medium">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-bold text-orange-600 hover:text-orange-700 transition-colors"
        >
          Sign up for free
        </Link>
      </p>
    </motion.div>
  );
}
