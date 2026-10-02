"use client";

import { RegisterInput, registerSchema } from "@/schemas/auth.schema";
import { authService } from "@/services/auth.services";
import { useAuthStore } from "@/stores/use-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const inputClassName =
  "w-full rounded-sm border border-[#1c2928]/20 bg-white/80 px-3.5 py-3 text-sm text-[#1c2928] outline-none transition focus:border-[#a14e3d] focus:ring-4 focus:ring-[#a14e3d]/10";

export function RegisterForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setServerError(null);

      const response = await authService.register(data);

      setUser(response.data);

      router.push("/workspaces");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setServerError(
          err.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      } else {
        setServerError("An unexpected error occurred.");
      }
    }
  };

  return (
    <form
      className="flex flex-col gap-[18px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      {serverError && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-xs text-red-600">
          {serverError}
        </div>
      )}

      <label className="flex flex-col gap-2 text-xs font-bold text-[#40504e]">
        Full name
        <input
          {...register("name")}
          className={inputClassName}
          type="text"
          placeholder="Hanako Yamada"
          autoComplete="name"
        />
        {errors.name && (
          <span className="text-xs text-red-500 font-normal">
            {errors.name.message}
          </span>
        )}
      </label>
      <label className="flex flex-col gap-2 text-xs font-bold text-[#40504e]">
        Email address
        <input
          {...register("email")}
          className={inputClassName}
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />
        {errors.email && (
          <span className="text-xs text-red-500 font-normal">
            {errors.email.message}
          </span>
        )}
      </label>
      <label className="flex flex-col gap-2 text-xs font-bold text-[#40504e]">
        Password
        <input
          {...register("password")}
          className={inputClassName}
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
        />
        {errors.password && (
          <span className="text-xs text-red-500 font-normal">
            {errors.password.message}
          </span>
        )}
      </label>
      <label className="flex flex-col gap-2 text-xs font-bold text-[#40504e]">
        Confirm Password
        <input
          {...register("confirmPassword")}
          className={inputClassName}
          type="2password"
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <span className="text-xs text-red-500 font-normal">
            {errors.confirmPassword.message}
          </span>
        )}
      </label>
      <label className="flex items-start gap-2 text-xs leading-normal text-[#40504e]">
        <input className="mt-1 accent-[#a14e3d]" type="checkbox" required />
        <span>I agree to the Terms and Privacy Policy</span>
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-between rounded-sm bg-[#1c2928] px-4 py-3.5 text-[13px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#a14e3d]"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
        <span aria-hidden="true">→</span>
      </button>

      <div className="flex flex-wrap justify-between gap-2 pt-1 text-xs text-[#647170]">
        <span>Already have an account?</span>
        <Link className="font-bold text-[#a14e3d] no-underline" href="/login">
          Sign in
        </Link>
      </div>
    </form>
  );
}
