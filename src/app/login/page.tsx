"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Something went wrong");
      return;
    }

    const role = json.data.role as "ADMIN" | "CUSTOMER";
    if (redirectTo && (role === "ADMIN" || !redirectTo.startsWith("/admin"))) {
      router.push(redirectTo);
    } else {
      router.push(role === "ADMIN" ? "/admin" : "/");
    }
    router.refresh();
  }

  return (
    <AuthShell
      title="Log in"
      subtitle="Welcome back — sign in to manage your bookings."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-brand-navy underline underline-offset-2">
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-brand-navy">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
            placeholder="you@example.com"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-brand-navy">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
            placeholder="••••••••"
          />
        </label>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-brand-danger-bg px-3 py-2 text-sm text-brand-danger">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <Button type="submit" size="lg" disabled={loading} className="mt-2">
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Signing in…" : "Log in"}
        </Button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
