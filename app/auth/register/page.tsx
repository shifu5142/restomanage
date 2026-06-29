import Link from "next/link";
import { Utensils } from "lucide-react";
import { AuthForm } from "@/components/forms/auth-form";
import { APP_NAME } from "@/lib/constants";

export default function RegisterPage() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/40 p-8 shadow-xl backdrop-blur-xl dark:bg-white/5">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25">
          <Utensils className="size-6" />
        </div>
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Start your 14-day free trial of {APP_NAME}
        </p>
      </div>

      <AuthForm type="register" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-orange-500 hover:text-orange-600"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
