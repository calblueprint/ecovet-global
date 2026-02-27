import type {
  Tables,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";

// ENUM for Emails.user_email
export type EmailType = "PLACEHOLDER";

// ENUM for user_type / user_group
export type UserType = "Admin" | "Facilitator" | "Participant";

// ENUM for status
export type StatusType = "Pending" | "Accepted" | "Cancelled";

export type UUID = string;

/* ============================
   Database Row Types
   (Single Source of Truth)
============================ */

export type UserGroup = Tables<"user_group">;
export type Profile = Tables<"profile">;
export type ParticipantSession = Tables<"participant_session">;
export type Role = Tables<"role">;
export type Template = Tables<"template">;
export type Session = Tables<"session">;
export type Phase = Tables<"phase">;
export type RolePhase = Tables<"role_phase">;
export type Prompt = Tables<"prompt">;
export type Tag = Tables<"tag">;
export type TemplateTag = Tables<"template_tag">;
export type Invite = Tables<"invite">;

/* ============================
   Insert / Update Helpers
============================ */

export type RoleUpdatable = TablesUpdate<"role">;
export type TemplateUpdatable = TablesUpdate<"template">;
export type PhaseUpdatable = TablesUpdate<"phase">;
export type RolePhaseUpdatable = TablesUpdate<"role_phase">;
export type PromptUpdatable = TablesUpdate<"prompt">;
export type EditablePhase = Omit<Tables<"phase">, "session_id">;

/* ============================
   App-Only Types
   (NOT direct DB rows)
============================ */

export interface PromptAnswer {
  prompt_response_id: UUID;
  session_id: UUID;
  user_id: UUID;
  prompt_id: UUID;
  prompt_answer: string;
}

export type LocalStore = {
  templateID: UUID;
  rolesById: Record<number | UUID, Role | Template>;
  roleIds: (number | UUID)[];
  phasesById: Record<UUID, EditablePhase>;
  phaseIds: UUID[];
  rolePhasesById: Record<UUID, RolePhase>;
  rolePhaseIndex: Record<UUID, Record<UUID, UUID>>;
  promptById: Record<UUID, Prompt>;
  promptIndex: Record<UUID, UUID[]>;
};

export type RoleFormInput = {
  role: Role;
  rolePhases: Record<UUID, RolePhase>;
  rolePhaseIndex: Record<UUID, UUID>;
  promptById: Record<UUID, Prompt>;
  promptIndex: Record<UUID, UUID[]>;
  phasesById: Record<UUID, EditablePhase>;
};
