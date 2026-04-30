"use client";

import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import TemplateListPage from "@/components/TemplateList/TemplateList";

export default function FacilitatorTemplateListPage() {
  return <TemplateListPage navBar={<TopNavBar />} showSidebar />;
}
