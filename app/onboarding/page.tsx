"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/actions/supabase/client";
import { handleProfileSubmit } from "@/api/supabase/queries/profile";
import { useProfile } from "@/utils/ProfileProvider";

function OnboardingPage() {
  const { userId, profile, loading: profileLoading } = useProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");
  const [save, setSave] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  //to be able to change fields on onboarding screen? for testing?
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name ?? "");
      setLastName(profile.last_name ?? "");
      setCountry(profile.country ?? "");
      setRole(profile.org_role ?? "");
    }
  }, [profile]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("");
    setSave(true);

    if (!userId) {
      setFormMessage("Missing user ID.");
      return;
    }

    const { success, error } = await handleProfileSubmit({
      id: userId,
      first_name: firstName,
      last_name: lastName,
      country,
      org_role: role,
    });

    if (!success) {
      setFormMessage(`Error: ${error}`);
    } else {
      setFormMessage("Profile saved");
      try {
        const { data } = await supabase
          .from("user_group")
          .select("num_users")
          .eq("user_group_id", profile?.user_group_id)
          .single();

        if (data) {
          await supabase
            .from("user_group")
            .update({ num_users: (data.num_users ?? 0) + 1 })
            .eq("user_group_id", profile?.user_group_id);
        }
      } catch (err) {
        console.error("Error incrementing num_users:", err);
      }
    }
    setSave(false);
  };

  if (profileLoading) {
    return <p>Loading your profile…</p>;
  }

  return (
    <div>
      <h2>Your information</h2>
      <p>Fill out these questions to tell us more about you</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name: </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="lastName">Last Name: </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="country">Country: </label>
          <input
            id="country"
            type="text"
            value={country}
            onChange={e => setCountry(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="orgRole">Role: </label>
          <input
            id="orgRole"
            type="text"
            value={role}
            onChange={e => setRole(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit" disabled={save}>
          {save ? "Saving" : "Submit Profile"}
        </button>
      </form>

      {formMessage && <p>{formMessage}</p>}
    </div>
  );
}

export default OnboardingPage;
