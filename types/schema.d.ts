import type { UUID } from "crypto";

// ENUM for Emails.user_email
export type EmailType = "PLACEHOLDER";

// ENUM for Profiles.user_group
export type UserType = "Admin" | "Facilitator" | "Participant";

/* SCHEMA */
//org_id --> user_group_id
export interface UserGroup {
  user_group_id: UUID; // user_group_id
  user_group_name: string;
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
}

export interface Role {
  role_id: UUID; // role_id
  role_name: string;
  role_description: string | null;
  template_id: UUID;
}
type RoleUpdatable = Omit<Role, "template_id", "role_id">;

export interface Template {
  template_id: UUID; // template_id
  template_name: string | null;
  accessible_to_all: boolean | null;
  user_group_id: UUID | null;
  objective: string | null;
  summary: string | null;
  setting: string | null;
  current_activity: string | null;
}
type TemplateUpdatable = Omit<Template, "template_id">;

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
  session_id: UUID | null;
  phase_name: string | null;
  phase_description: string | null;
  is_finished: boolean | null;
}
type PhaseUpdatable = Omit<Phase, "phase_id">;

export interface RolePhase {
  role_phase_id: UUID;
  phase_id: UUID;
  role_id: UUID;
  description: string | null;
}
type RolePhaseUpdatable = Omit<RolePhase, "role_phase_id", "phase_id", "role_id">;

export interface Prompt {
  prompt_id: UUID; // prompt_id
  user_id: UUID | null;
  role_phase_id: UUID;
  prompt_text: string | null;
}
type PromptUpdatable = Omit<Prompt, "prompt_id", "role_phase_id">;

export interface PromptAnswer {
  prompt_response_id: UUID; // prompt_answer_id
  user_id: UUID;
  prompt_id: UUID;
  prompt_answer: string;
}

export type localStore = {
  templateID: UUID;
  rolesById: Record<(number|UUID), (Role|Template)>;
  roleIds: (number|UUID)[];
  phasesById: Record<UUID, Phase>;
  phaseIds: UUID[];
  rolePhasesById: Record<UUID, RolePhase>;
  rolePhaseIndex: Record<UUID, Record<UUID, UUID>>; // first UUID is role id, second is phase id, and third is rolephase id
  promptById: Record<UUID, Prompt>,
  promptIndex: Record<UUID, UUID[]>,
};

export type roleFormInput = {
  role: Role,
  rolePhases: Record<UUID, RolePhase>,
  rolePhaseIndex: Record<UUID, UUID>,
  promptById: Record<UUID, Prompt>,
  promptIndex: Record<UUID, UUID[]>,  // rolephase uuid mapping to a list of prompt uuids
}