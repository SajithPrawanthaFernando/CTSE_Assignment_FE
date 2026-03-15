import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string; // Adding the error prop
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        <label className="text-sm font-bold text-gray-700 ml-1 italic">
          {label}
        </label>
        <input
          ref={ref} // Forwarding the ref for react-hook-form
          className={cn(
            "w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 transition-all outline-none",
            error
              ? "border-red-500 focus:border-red-500"
              : "border-transparent focus:border-orange-500 focus:bg-white",
            className,
          )}
          {...props}
        />
        {error && (
          <p className="text-xs font-bold text-red-500 ml-1">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
