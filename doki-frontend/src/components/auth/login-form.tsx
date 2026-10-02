"use client";

import { LoginInput, loginSchema } from "@/schemas/auth.schema";
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

export function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    try {
      setServerError(null);

      const response = await authService.login(data);

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
          autoComplete="current-password"
        />
        {errors.password && (
          <span className="text-xs text-red-500 font-normal">
            {errors.password.message}
          </span>
        )}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-between rounded-sm bg-[#1c2928] px-4 py-3.5 text-[13px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#a14e3d]"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
        <span aria-hidden="true">→</span>
      </button>

      <div className="flex flex-wrap justify-between gap-2 pt-1 text-xs text-[#647170]">
        <span> New to Dōki?</span>
        <Link
          className="font-bold text-[#a14e3d] no-underline"
          href="/register"
        >
          Create account
        </Link>
      </div>
    </form>
  );
}
