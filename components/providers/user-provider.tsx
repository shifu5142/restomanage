"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { getUserDisplay, type UserDisplay } from "@/lib/auth/get-user-display";

type UserContextValue = {
  user: User | null;
  display: UserDisplay | null;
  loading: boolean;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [display, setDisplay] = useState<UserDisplay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUser = (sessionUser: User | null) => {
      setUser(sessionUser);
      setDisplay(sessionUser ? getUserDisplay(sessionUser) : null);
      setLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () => ({ user, display, loading }),
    [user, display, loading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
