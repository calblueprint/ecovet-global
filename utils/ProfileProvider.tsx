"use client";

import type { Profile } from "@/types/schema";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchProfileByUserId } from "@/actions/supabase/queries/profile";
import supabase from "../actions/supabase/client";

type Context = {
  userId: string | null;
  profile: Profile | null;
  loading: boolean;
  refetch: () => Promise<void>;
};

const ProfileContext = createContext<Context | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.auth.getUser();
    const uid = data?.user?.id ?? null;
    setUserId(uid);
    if (uid) setProfile(await fetchProfileByUserId(uid));
    else setProfile(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    let initialLoad = true;

    refetch();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (initialLoad) {
        initialLoad = false;
        return;
      }
      setLoading(true);
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) setProfile(await fetchProfileByUserId(uid));
      else setProfile(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [refetch]);

  return (
    <ProfileContext.Provider value={{ userId, profile, loading, refetch }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("profile not found");
  return context;
}
