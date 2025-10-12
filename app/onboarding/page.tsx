"use client";

import React, { useEffect, useState } from "react";
import { useProfile } from "@/utils/ProfileProvider";
import supabase from "../../actions/supabase/client";

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

    await supabase.auth.getSession();

    const { error } = await supabase
      .from("profile")
      .upsert({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        country: country,
        org_role: role,
      })
      .select();

    if (error) {
      setSave(false);
      setFormMessage(`Error: ${error.message}`);
      return;
    }

    setSave(false);
    setFormMessage("Profile saved");
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
