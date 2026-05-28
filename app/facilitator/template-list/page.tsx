"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AccessError from "@/components/AccessError/AccessError";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import TemplateListPage from "@/components/TemplateList/TemplateList";
import { useProfile } from "@/utils/ProfileProvider";

export default function FacilitatorTemplateListPage() {
  const { profile } = useProfile();
  const router = useRouter();

  const facAccess = profile?.user_type === "Facilitator";
  const adminAccess = profile?.user_type === "Admin";

  useEffect(() => {
    if (adminAccess) {
      router.push(`/admin/template-list`);
    }
  }, [adminAccess, router]);

  // Wait for profile to load before deciding access
  if (!profile) return null;

  // Admins are being redirected — render nothing in the meantime
  if (adminAccess) return null;

  if (!facAccess) {
    return <AccessError />;
  }

  return <TemplateListPage navBar={<TopNavBar />} showSidebar />;
}
