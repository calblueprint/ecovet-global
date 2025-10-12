"use client";

import React, { useState } from "react";
import supabase from "../../actions/supabase/client";

function OnboardingPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setFormMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      setLoading(false);
      setFormMessage(`Auth error: ${userError.message}`);
      return;
    }

    if (user == null) {
      setLoading(false);
      setFormMessage("Sign in.");
      return;
    }

    await supabase.auth.getSession();

    const { error } = await supabase
      .from("profile")
      .upsert({
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        country: country,
        org_role: role,
      })
      .select();

    setLoading(false);

    if (error) {
      setFormMessage(`Error: ${error.message}`);
    } else {
      setFormMessage("Profile saved");
    }
  };

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
        <button type="submit" disabled={loading}>
          {loading ? "Saving" : "Submit Profile"}
        </button>
      </form>

      {formMessage && <p>{formMessage}</p>}
    </div>
  );
}

export default OnboardingPage;
