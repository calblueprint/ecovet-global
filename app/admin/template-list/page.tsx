"use client";

import NavBar from "@/components/NavBar/NavBar";
import TemplateListPage from "@/components/TemplateList/TemplateList";

export default function AdminTemplateListPage() {
  return <TemplateListPage navBar={<NavBar />} showSidebar={false} />;
}
