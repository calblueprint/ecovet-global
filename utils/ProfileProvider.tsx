"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from "../actions/supabase/client";

type Profile = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  country: string | null;
  org_role: string | null;
};

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
    (async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      const uid = data?.user?.id ?? null;
      setUserId(uid);

      if (uid) {
        const { data: row } = await supabase
          .from("profile")
          .select("*")
          .eq("id", uid)
          .single();

        setProfile(
          row ?? {
            id: uid,
            first_name: null,
            last_name: null,
            country: null,
            org_role: null,
          },
        );
      } else {
        setProfile(null);
      }

      setLoading(false);
    })();
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
