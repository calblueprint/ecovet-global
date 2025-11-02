export const defaultTemplates = [
  {
    template_name: "My Template",
    accessible_to_all: false,
    user_group_id: null,
    objective: "The object is to do as Cody says :)",
    summary: "What is this?",
    setting: "The Forest",
    current_activity: "Jumping Jacks",
  },
] as const;

export const defaultPhases = [
  {
    session_id: null,
    phase_name: "My First Phase",
    phase_description: "The phase that is my first.",
    is_finished: true,
  },
  {
    session_id: null,
    phase_name: "My Second Phase",
    phase_description: "This is the phase that came second.",
    is_finished: false,
  },
] as const;

export const defaultRoles = [
  {
    role_name: "Teacher",
    role_description: "Teaches students.",
  },
  {
    role_name: "Student",
    role_description: "Learns from teacher.",
  },
] as const;

export const defaultRolePhases = [
  {
    description: "I lowk have no idea what this is for",
  },
  {
    description: "For a second time, I have no clue",
  },
  {
    description: "Hm maybe this third one will come to me",
  },
  {
    description: "Nvm I don't get this fourth",
  },
] as const;

export const defaultPrompts = [
  {
    prompt_text: "prompt text 1",
  },
  {
    prompt_text: "prompt text 2",
  },
  {
    prompt_text: "prompt text 3",
  },
  {
    prompt_text: "prompt text 4",
  },
] as const;
