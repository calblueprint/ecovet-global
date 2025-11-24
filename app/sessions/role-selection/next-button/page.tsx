"use client";

import NextButton from "./next-button";

export default function NextButtonTest() {
  const user_id = "08904483-7c1b-4721-9cab-17f59ebcee70";
  const role_id = "5809389f-2556-4eca-8f9a-532c5aa03fba";
  const session_id = "0c50c7cf-8e27-41de-9252-e17201ea6f70";

  return (
    <NextButton
      user_id={user_id}
      role_id={role_id}
      session_id={session_id}
    ></NextButton>
  );
}
