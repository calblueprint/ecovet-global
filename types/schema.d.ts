import type { UUID } from "crypto";

// ENUM for Emails.user_email
export type EmailType = "PLACEHOLDER";

// ENUM for user_type / user_group
export type UserType = "Admin" | "Facilitator" | "Participant";

// ENUM for status
export type StatusType = "Pending" | "Accepted" | "Cancelled";

/* SCHEMA */
//org_id --> user_group_id
export interface UserGroup {
  user_group_id: UUID; // user_group_id
  user_group_name: string;
  num_users: number;
}

export interface User {
  id: UUID; // user_id
  user_email: string;
}

export interface Email {
  id: UUID; // email_id
  email_type: EmailType;
  profile_id: UUID;
}

export interface Profile {
  id: UUID; // user_id
  user_type: UserType;
  user_group_id: UUID;
  role_id: UUID;
  phase_id: UUID;
  is_finished: boolean;
  first_name: string;
  last_name: string;
  country: string;
  org_role: string;
  email: string;
}
export interface Role {
  role_id: UUID; // role_id
  role_name: string;
  role_description: string | null;
  template_id: UUID;
}

export interface Template {
  template_id: UUID; // template_id
  template_name: string;
  accessible_to_all: boolean;
  user_group_id: UUID | null;
  objective: string;
  summary: string;
  setting: string;
  current_activity: string;
  timestamp: string;
}

export interface Session {
  session_id: UUID; // session_id
  template_id: UUID;
  user_group_id: UUID;
  session_name: string;
  is_async: boolean;
  after_action_report_id?: UUID;
}

export interface Phase {
  phase_id: UUID; // phase_id
  session_id: UUID;
  phase_name: string;
  phase_description: string | null;
  is_finished: boolean;
}

export interface RolePhase {
  role_phase_id: UUID;
  phase_id: UUID;
  role_id: UUID;
  description: string;
}

export interface Prompt {
  prompt_id: UUID; // prompt_id
  phase_id: UUID;
  role_phase_id: UUID;
  prompt_text: string;
}

export interface PromptAnswer {
  prompt_response_id: UUID; // prompt_answer_id
  user_id: UUID;
  prompt_id: UUID;
  prompt_answer: string;
}
export interface Tag {
  tag_id: UUID;
  name: string;
  user_group_id: UUID;
  number: number; // (number of templates with this tag)
  color: string; // might want to change to check COLOR type
}
export interface TemplateTag {
  template_id: UUID;
  tag_id: UUID;
}
export interface Invite {
  invite_id: UUID;
  user_group_id: UUID;
  invited_by_user_id: UUID;
  email: string;
  user_type: string;
  status: string;
}
