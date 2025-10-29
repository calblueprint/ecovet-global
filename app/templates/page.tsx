"use client";

import { useState } from "react";
import { UUID } from "crypto";
import { createTemplates } from "@/api/supabase/queries/templates";
import TemplateBuilder from "./components/TemplateBuilder";

export default function NewTemplatePage() {
  const [loading, setLoading] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [templateID, setTemplateID] = useState<UUID|null>(null);

  async function newTemplate() {
    setLoading(true);
    try {
      const newTemplateID = await createTemplates();
      setTemplateID(newTemplateID);
    } finally {
      setLoading(false);
      setIsNew(true);
    }
  }

  return (
    <>
      <h1>New Template Page</h1>
      {isNew ? 
        <TemplateBuilder template_id={templateID}/>
      :
        <button onClick={newTemplate} disabled={loading}>
          {loading ? "Creating..." : "New Template"}
        </button> 
      }
    </>
  );
}