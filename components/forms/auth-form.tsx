"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name is required"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AuthType = "login" | "register" | "forgot" | "reset";

type AuthFormData = {
  login: z.infer<typeof loginSchema>;
  register: z.infer<typeof registerSchema>;
  forgot: z.infer<typeof forgotSchema>;
  reset: z.infer<typeof resetSchema>;
};

export type { AuthFormData };

const schemas = {
  login: loginSchema,
  register: registerSchema,
  forgot: forgotSchema,
  reset: resetSchema,
};

type AuthFormProps<T extends AuthType = AuthType> = {
  type: T;
  onSubmit?: (data: AuthFormData[T]) => void | Promise<void>;
};

export function AuthForm<T extends AuthType>({ type, onSubmit: onSubmitProp }: AuthFormProps<T>) {
  const router = useRouter();
  const schema = schemas[type];

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: type === "register"
      ? { name: "", email: "", password: "", confirmPassword: "" }
      : type === "reset"
        ? { password: "", confirmPassword: "" }
        : type === "forgot"
          ? { email: "" }
          : { email: "", password: "" },
  });

  const errors = form.formState.errors as Record<
    string,
    { message?: string } | undefined
  >;

  const onSubmit = form.handleSubmit(async (data) => {
    if (onSubmitProp) {
      await onSubmitProp(data as AuthFormData[T]);
      return;
    }
    if (type === "forgot") {
      toast.success("Reset link sent to your email");
      return;
    }
    if (type === "reset") {
      toast.success("Password reset successfully");
      router.push("/auth/login");
      return;
    }
    toast.success(type === "login" ? "Welcome back!" : "Account created successfully!");
    router.push("/dashboard");
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {type === "register" && (
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="John Doe" className="border-white/10 bg-background/50" {...form.register("name")} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
      )}
      {type !== "reset" && (
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@restaurant.com" className="border-white/10 bg-background/50" {...form.register("email")} />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      )}
      {(type === "login" || type === "register" || type === "reset") && (
        <div className="space-y-2">
          <Label htmlFor="password">{type === "reset" ? "New Password" : "Password"}</Label>
          <Input id="password" type="password" placeholder="••••••••" className="border-white/10 bg-background/50" {...form.register("password")} />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>
      )}
      {(type === "register" || type === "reset") && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" placeholder="••••••••" className="border-white/10 bg-background/50" {...form.register("confirmPassword")} />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
      )}
      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 cursor-pointer" disabled={form.formState.isSubmitting}>
        {type === "login" && "Sign In"}
        {type === "register" && "Create Account"}
        {type === "forgot" && "Send Reset Link"}
        {type === "reset" && "Reset Password"}
      </Button>
    </form>
  );
}
