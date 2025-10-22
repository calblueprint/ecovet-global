export const defaultTemplates = [
    {
        template_name: 'My Template',
        accessible_to_all: false,
        user_group_id: null,
        objective: 'The object is to do as Cody says :)',
        summary: 'What is this?',
        setting: 'The Forest',
        current_activity: 'Jumping Jacks',
    }
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