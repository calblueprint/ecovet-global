"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/actions/supabase/client";
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

function OnboardingPage() {
  const { userId, profile, loading: profileLoading } = useProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");
  const [save, setSave] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("");
    setSave(true);

    if (!userId) {
      setFormMessage("User not logged in yet. Please wait…");
      setSave(false);
      return;
    }
    const { success, error } = await handleProfileSubmit({
      id: userId,
      first_name: firstName,
      last_name: lastName,
      country: country,
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
        router.push("/test-page");
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
      <Main>
        <form onSubmit={handleSubmit}>
          <Container>
            <IntroText>
              <WelcomeTag>
                {" "}
                <Heading2> Your Information </Heading2>
                <Heading3>
                  Fill out these questions to tell us more about you.
                </Heading3>
              </WelcomeTag>
            </IntroText>
            <InputFields>
              <div>
                <InputDiv>
                  <Label>First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                  />
                </InputDiv>
              </div>
              <div>
                <InputDiv>
                  <Label>Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                  />
                </InputDiv>
              </div>
              <div>
                <InputDiv>
                  <Label>Country</Label>
                  <Input
                    id="country"
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    required
                  />
                </InputDiv>
              </div>
              <div>
                <InputDiv>
                  <Label>Role</Label>
                  <Input
                    id="orgRole"
                    type="text"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    required
                  />
                </InputDiv>
              </div>
            </InputFields>
            <Button type="submit" disabled={save}>
              {save ? "Saving" : "Submit Profile"}
            </Button>
          </Container>
        </form>
      </Main>

      {formMessage && <p>{formMessage}</p>}
    </div>
  );
}

export default OnboardingPage;
