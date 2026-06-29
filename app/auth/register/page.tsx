"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Utensils } from "lucide-react";
import { AuthForm, type AuthFormData } from "@/components/forms/auth-form";
import { APP_NAME } from "@/lib/constants";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function RegisterPage() {
  const router = useRouter();
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleRegister = async (data: AuthFormData["register"]) => {
    if(data.name.length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    if(data.email.length < 2) {
      toast.error("Email must be at least 2 characters");
      return;
    }
    if(data.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if(data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setRegisteredEmail(data.email);
    setVerifyOpen(true);
  };

  const handleGoToLogin = () => {
    setVerifyOpen(false);
    router.push("/auth/login");
  };

  const handleCancelVerify = () => {
    setVerifyOpen(false);
  };

  return (
    <>
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

        <AuthForm type="register" onSubmit={handleRegister} />

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

      <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
        <DialogContent className="border-white/10 bg-card/95 backdrop-blur-xl sm:max-w-md">
          <DialogHeader className="items-center text-center">
            <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
              <Mail className="size-7" />
            </div>
            <DialogTitle>Verify your email</DialogTitle>
            <DialogDescription className="text-center">
              A verification link has been sent to{" "}
              <span className="font-medium text-foreground">{registeredEmail}</span>.
              Please check your inbox and verify your email before signing in.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 sm:justify-center">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer sm:w-auto"
              onClick={handleCancelVerify}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="cursor-pointer bg-orange-500 hover:bg-orange-600 sm:w-auto"
              onClick={handleGoToLogin}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default RegisterPage;
