import Link from "next/link";
import { Utensils } from "lucide-react";
import { AuthForm } from "@/components/forms/auth-form";

export default function ForgotPasswordPage() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/40 p-8 shadow-xl backdrop-blur-xl dark:bg-white/5">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25">
          <Utensils className="size-6" />
        </div>
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <AuthForm type="forgot" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-orange-500 hover:text-orange-600"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
