"use client";

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

  if (adminAccess) {
    console.log("Pushing");
    router.push(`/admin/template-list`);
  }
  if (!facAccess) {
    <AccessError />;
  }
  return <TemplateListPage navBar={<TopNavBar />} showSidebar />;
}
