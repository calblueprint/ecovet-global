"use client";

import React, { useEffect, useState } from "react";
import { handleProfileSubmit } from "@/api/supabase/queries/profile";
import { useProfile } from "@/utils/ProfileProvider";
import {
  Button,
  Container,
  Heading2,
  Heading3,
  Input,
  InputDiv,
  InputFields,
  IntroText,
  Label,
  Main,
  WelcomeTag,
} from "./styles";

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
      id: userId,
      first_name: formData.first_name,
      last_name: formData.last_name,
      country: formData.country,
      org_role: formData.org_role,
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
    <Main>
      <form onSubmit={handleSubmit}>
        <Container>
          <IntroText>
            <WelcomeTag>
              {" "}
              <Heading2> Edit Profile </Heading2>
              <Heading3>Update your profile information below.</Heading3>
            </WelcomeTag>
          </IntroText>
          <InputFields>
            <div>
              <InputDiv>
                <Label>First Name </Label>
                <Input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </InputDiv>
            </div>
            <div>
              <InputDiv>
                <Label>Last Name </Label>
                <Input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </InputDiv>
            </div>
            <div>
              <InputDiv>
                <Label>Country </Label>
                <Input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </InputDiv>
            </div>
            <div>
              <InputDiv>
                <Label>Organization Role </Label>
                <Input
                  type="text"
                  name="org_role"
                  value={formData.org_role}
                  onChange={handleChange}
                />
              </InputDiv>
            </div>
          </InputFields>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>

          {message && <p>{message}</p>}
        </Container>
      </form>
    </Main>
  );
}
