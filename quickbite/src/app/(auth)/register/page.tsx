"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { UserPlus, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { authService } from "@/services/auth.service";
import { useNotificationStore } from "@/store/useNotificationStore";

// Validation Schema matching Postman "Users - Create User"
const registerSchema = yup.object().shape({
  fullname: yup
    .string()
    .required("Full name is required")
    .min(3, "Name is too short"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  phone: yup.string().required("Phone number is required"),
  address: yup.string().required("Delivery address is required"),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    // Split name for API requirements (first/last name fields)
    const nameParts = data.fullname.trim().split(" ");
    const firstname = nameParts[0] || "";
    const lastname =
      nameParts.length > 1 ? nameParts.slice(1).join(" ") : "User";

    const payload = {
      email: data.email,
      password: data.password,
      roles: ["user"], // Default role as specified in Postman collection
      phone: data.phone,
      fullname: data.fullname,
      firstname,
      lastname,
      address: data.address,
    };

    try {
      // Connects to POST http://localhost:3000/users
      await authService.register(payload);
      addNotification("Account created! Welcome to GustoBistro.", "success");
      router.push("/login");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      addNotification(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">
          Create Account
        </h2>
        <p className="mt-3 text-sm text-gray-500 font-medium">
          Join GustoBistro and start earning rewards.
        </p>
      </div>

      <form className="mt-10 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("fullname")}
          label="Full Name"
          type="text"
          placeholder="Sajith Fernando"
          error={errors.fullname?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register("email")}
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            error={errors.email?.message}
          />
          <Input
            {...register("phone")}
            label="Phone Number"
            type="text"
            placeholder="+94 77 123 4567"
            error={errors.phone?.message}
          />
        </div>

        <Input
          {...register("password")}
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
        />

        <Input
          {...register("address")}
          label="Delivery Address"
          type="text"
          placeholder="123 Colombo St, Colombo"
          error={errors.address?.message}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-black rounded-2xl text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-orange-600/20"
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-4">
            {isLoading ? (
              <Loader2 size={20} className="animate-spin text-orange-200" />
            ) : (
              <UserPlus
                size={20}
                className="text-orange-200 group-hover:text-white transition-colors"
              />
            )}
          </span>
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500 font-medium">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-orange-600 hover:text-orange-500 transition-colors"
        >
          Sign in instead
        </Link>
      </p>
    </motion.div>
  );
}
