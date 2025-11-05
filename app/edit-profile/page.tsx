"use client";

import React, { useEffect, useState } from "react";
import { handleProfileSubmit } from "@/api/supabase/queries/profile";
import { useProfile } from "@/utils/ProfileProvider";

export default function EditProfilePage() {
  const { userId, profile, loading: profileLoading } = useProfile();
  const [formData, setFormData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    country: "",
    org_role: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        id: profile.id,
        first_name: profile.first_name ?? "",
        last_name: profile.last_name ?? "",
        country: profile.country ?? "",
        org_role: profile.org_role ?? "",
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    setMessage("");

    const result = await handleProfileSubmit({
      ...formData,
      id: userId,
    });

    if (result.success) {
      setMessage("Profile Updated!");
    } else {
      setMessage(`Error: ${result.error}`);
    }

    setSaving(false);
  };

  if (profileLoading) return <p>Loading profile...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Profile</h2>

      <label>
        First Name:
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
        />
      </label>
      <br />

      <label>
        Last Name:
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
        />
      </label>
      <br />

      <label>
        Country:
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
        />
      </label>
      <br />

      <label>
        Organization Role:
        <input
          type="text"
          name="org_role"
          value={formData.org_role}
          onChange={handleChange}
        />
      </label>
      <br />

      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}
