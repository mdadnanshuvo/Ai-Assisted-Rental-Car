"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { AlertCircle, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setServerError(null);
    setErrors({});

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      if (json.issues) {
        const fieldErrors: Record<string, string> = {};
        for (const [k, v] of Object.entries(json.issues)) {
          fieldErrors[k] = Array.isArray(v) ? (v[0] as string) : String(v);
        }
        setErrors(fieldErrors);
      } else {
        setServerError(json.error ?? "Something went wrong");
      }
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <AuthShell
      title="Create an account"
      subtitle="Register to save your bookings and get faster checkout."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-navy underline underline-offset-2">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-brand-navy">Full name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass(errors.name)}
            placeholder="Jordan Smith"
          />
          {errors.name && <span className="text-xs text-brand-danger">{errors.name}</span>}
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-brand-navy">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass(errors.email)}
            placeholder="you@example.com"
          />
          {errors.email && <span className="text-xs text-brand-danger">{errors.email}</span>}
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-brand-navy">Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass(errors.password)}
            placeholder="At least 8 characters"
          />
          {errors.password && <span className="text-xs text-brand-danger">{errors.password}</span>}
        </label>

        {serverError && (
          <div className="flex items-center gap-2 rounded-lg bg-brand-danger-bg px-3 py-2 text-sm text-brand-danger">
            <AlertCircle size={16} /> {serverError}
          </div>
        )}

        <Button type="submit" size="lg" disabled={loading} className="mt-2">
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}

function inputClass(error?: string) {
  return `rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-navy ${
    error ? "border-brand-danger" : "border-surface-border"
  }`;
}
