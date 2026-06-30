import type { User } from "@supabase/supabase-js";

export type UserDisplay = {
  name: string;
  email: string;
  avatar: string;
  initials: string;
  provider: string;
  username?: string;
};

export function getUserDisplay(user: User): UserDisplay {
  const meta = user.user_metadata ?? {};
  const provider = (user.app_metadata?.provider as string) ?? "email";

  const name =
    meta.full_name ||
    meta.name ||
    meta.user_name ||
    user.email?.split("@")[0] ||
    "User";

  const avatar = meta.avatar_url || meta.picture || "";
  const username = meta.user_name as string | undefined;

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  return {
    name,
    email: user.email ?? "",
    avatar,
    initials,
    provider,
    username,
  };
}

export function getProviderLabel(provider: string): string {
  if (provider === "google") return "Google";
  if (provider === "github") return "GitHub";
  return "Email";
}
