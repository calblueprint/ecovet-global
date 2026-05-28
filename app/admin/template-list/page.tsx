"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AccessError from "@/components/AccessError/AccessError";
import NavBar from "@/components/NavBar/NavBar";
import TemplateListPage from "@/components/TemplateList/TemplateList";
import { useProfile } from "@/utils/ProfileProvider";

export default function AdminTemplateListPage() {
  const { profile } = useProfile();
  const router = useRouter();

  const facAccess = profile?.user_type === "Facilitator";
  const adminAccess = profile?.user_type === "Admin";

  useEffect(() => {
    if (facAccess) {
      router.push(`/facilitator/template-list`);
    }
  }, [facAccess, router]);

  // Wait for profile to load before deciding access
  if (!profile) return null;

  // Admins are being redirected — render nothing in the meantime
  if (facAccess) return null;

  if (!adminAccess) {
    return <AccessError />;
  }
  return <TemplateListPage navBar={<NavBar />} showSidebar={false} />;
}
