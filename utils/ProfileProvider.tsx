"use client";

import type { Profile } from "@/types/schema";
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchProfileByUserId } from "@/actions/supabase/queries/profile";
import supabase from "../actions/supabase/client";

type Context = {
  userId: string | null;
  profile: Profile | null;
  loading: boolean;
};

const ProfileContext = createContext<Context | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data?.user?.id ?? null;
      setUserId(uid);
      if (uid) setProfile(await fetchProfileByUserId(uid));
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "INITIAL_SESSION") return;

      setLoading(true);
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) setProfile(await fetchProfileByUserId(uid));
      else setProfile(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ProfileContext.Provider value={{ userId, profile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("profile not found");
  return context;
}
