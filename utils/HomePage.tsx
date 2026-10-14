import type { Profile } from "@/types/schema";

export function getHomePath(profile: Profile | null): string {
  if (!profile) return "/";

  switch (profile.user_type) {
    case "Admin":
      return "/admin/home-screen";
    case "Participant":
      return "/participants/session-start";
    case "Facilitator":
      return "/facilitator/template-list";
    default:
      return "/";
  }
}

// Onboarding requires a first name, so a profile without one never finished it
export function hasCompletedOnboarding(profile: Profile | null): boolean {
  return !!profile?.first_name?.trim();
}
