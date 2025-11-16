"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthResponse, Session } from "@supabase/supabase-js";
import supabase from "../actions/supabase/client";

export interface AuthState {
  session: Session | null;
  signUp: (
    email: string,
    password: string,
    options: {
      emailRedirectTo: string;
    },
  ) => Promise<AuthResponse>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => void;
}

const AuthContext = createContext({} as AuthState);

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error(
        "useSession must be wrapped in a <AuthContextProvider />",
      );
    }
  }

  return value;
}

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: newSession } }) => {
      setSession(newSession);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    options: { emailRedirectTo: string },
  ) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: options.emailRedirectTo,
      },
    });
  };

  const signInWithEmail = async (email: string, password: string) =>
    supabase.auth.signInWithPassword({
      email,
      password,
    });

  const signOut = async () => {
    supabase.auth.signOut();
    setSession(null);
  };

  const authContextValue = useMemo(
    () => ({
      session,
      signUp,
      signInWithEmail,
      signOut,
    }),
    [session],
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
