"use client";

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

  if (facAccess) {
    router.push(`/facilitator/template-list`);
  }
  if (!adminAccess) {
    <AccessError />;
  }
  return <TemplateListPage navBar={<NavBar />} showSidebar={false} />;
}
