import type { Profile } from "@/types/schema";

export function getHomePath(profile: Profile | null): string {
  if (!profile) return "auth/sign-up";

  switch (profile.user_type) {
    case "Admin":
      return "/admin/dashboard";
    case "Participant":
      return "/participants/session-start";
    case "Facilitator":
      return "/facilitator/template-list";
    default:
      return "/test-page";
  }
}
