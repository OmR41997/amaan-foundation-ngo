"use client";

import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";
import { useToast } from "@/contexts/toast-context";
import { ApiError } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function AdminLoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("alimansari.sa@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = "light";
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/admin/member-requests");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      showToast("Welcome back!", "success");
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Invalid credentials",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f2235]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#0f2235_0%,#1f6fa8_100%)] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-2xl border border-[#d7e4ef] bg-white p-1.5 shadow-sm">
            <Image
              src="/images/logo/logo.png"
              alt="Amaan Ansari Welfare Foundation logo"
              width={88}
              height={88}
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold text-[#143046]">Admin Login</h1>
          <p className="mt-2 text-sm text-[#6b7c8f]">
            Amaan Ansari Welfare Foundation — Management Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#334155]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-4 py-3 text-sm text-[#0f172a] placeholder-[#94a3b8] shadow-2xs outline-none transition focus:border-[#1f6fa8] focus:ring-2 focus:ring-[#1f6fa8]/15"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#334155]">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-[#cbd5e1] bg-white py-3 pl-4 pr-11 text-sm text-[#0f172a] placeholder-[#94a3b8] shadow-2xs outline-none transition focus:border-[#1f6fa8] focus:ring-2 focus:ring-[#1f6fa8]/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0f172a] transition p-1"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#1f6fa8] py-3 text-sm font-semibold text-white transition hover:bg-[#185887] hover:opacity-95 disabled:opacity-60 shadow-md"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#6b7c8f]">
          Secure JWT authentication · Authorized personnel only
        </p>
      </div>
    </div>
  );
}
