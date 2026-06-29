"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Utensils } from "lucide-react";
import { AuthForm, type AuthFormData } from "@/components/forms/auth-form";
import {
  AuthDivider,
  GitHubSignInButton,
  GoogleSignInButton,
} from "@/components/forms/google-sign-in-button";
import { APP_NAME } from "@/lib/constants";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

type OAuthProvider = "google" | "github";

function LoginPage() {
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error", message: string } | null>(null);
  useEffect(() => {
    const checkSessionExists = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (user) {
        setStatus({ type: "success", message: "You are already logged in" });
        setTimeout(() => {
          router.replace("/dashboard")
        }, 1500)
      }
      if (error) {
        setStatus({ type: "error", message: error.message });
        return;
      }
    }
    checkSessionExists().catch(console.error)
  }, [])
  const handleLogin = async (data: AuthFormData["login"]): Promise<void> => {
    if (data.email.length < 2) {
      toast.error("Email must be at least 2 characters");
      return;
    }
    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Welcome back!");
    router.push("/dashboard");
  };

  const handleOAuthLogin = async (
    provider: OAuthProvider,
    setLoading: (loading: boolean) => void
  ): Promise<void> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/40 p-8 shadow-xl backdrop-blur-xl dark:bg-white/5">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25">
          <Utensils className="size-6" />
        </div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to your {APP_NAME} account
        </p>
      </div>

      <AuthForm type="login" onSubmit={handleLogin} />

      <AuthDivider />

      <div className="space-y-3">
        <GoogleSignInButton
          onClick={() => handleOAuthLogin("google", setGoogleLoading)}
          loading={googleLoading}
          disabled={githubLoading}
          label="Sign in with Google"
        />
        <GitHubSignInButton
          onClick={() => handleOAuthLogin("github", setGithubLoading)}
          loading={githubLoading}
          disabled={googleLoading}
          label="Sign in with GitHub"
        />
      </div>

      <div className="mt-6 space-y-2 text-center text-sm">
        <p>
          <Link
            href="/auth/forgot-password"
            className="text-orange-500 hover:text-orange-600"
          >
            Forgot your password?
          </Link>
        </p>
        <p className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-orange-500 hover:text-orange-600"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
export default LoginPage;
