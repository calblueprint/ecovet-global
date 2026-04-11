import type {
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

// ENUM for prompt_type
export type PromptType = "text" | "multiple_choice" | "checkbox";

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
export type PromptAnswer = Tables<"prompt_response">;
export type Tag = Tables<"tag">;
export type TemplateTag = Tables<"template_tag">;
export type Invite = Tables<"invite">;
export type ChatRoom = Tables<"chat_room">;
export type ChatMessage = Tables<"chat_message">;
export type PromptOption = Tables<"prompt_option">;

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
  prompt_response_id: UUID; // prompt_answer_id
  session_id: UUID;
  user_id: UUID;
  prompt_id: UUID;
  prompt_option_id: UUID;
  prompt_answer: string;
}

export type ParticipantSessionWithProfile = ParticipantSession & {
  profile: {
    first_name: string;
    last_name: string;
  };
  role: {
    role_name: string;
  } | null;
};

export type StagedOption = {
  option_number: number;
  option_text: string;
};

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
  optionsByPromptId: Record<UUID, StagedOption[]>; // NEW
};

export type RoleFormInput = {
  role: Role;
  rolePhases: Record<UUID, RolePhase>;
  rolePhaseIndex: Record<UUID, UUID>;
  promptById: Record<UUID, Prompt>;
  promptIndex: Record<UUID, UUID[]>;
  phasesById: Record<UUID, EditablePhase>;
  optionsByPromptId: Record<UUID, StagedOption[]>;
};

export type Participant = {
  id: UUID;
  name?: string | null; // optional because database doesn't have it
  email: string | null;
  role: string | null;
  last_active?: string | null; // optional because database doesn't have it
  invite_accepted: boolean | null; // consider making boolean? leaving as string for now since that's how it's coming from the database
};
