import { useState } from "react";
import { UUID } from "crypto";
import { createPhases, createRoles, deleteRoles } from "@/api/supabase/queries/templates";
import TemplateOverviewForm from "./TemplateOverviewForm";
import RoleForm from "./RoleForm";

type Tab = { label: string; id: UUID | null };

const defaults = {
  tempName: "New Template",
  tempSummary: "New Template Summary",
  tempSetting: "New Template Setting",
  tempCurrActivity: "New Template Current Activity",
  roleName: "New Role",
  roleDescription: "Role Description",
};

export default function TemplateBuilder({template_id} : {template_id: UUID|null} ) {
  const [tabs, setTabs] = useState<Tab[]>([{ label: "Scenario Overview", id: null }]);
  const [activeId, setActiveId] = useState<UUID | null>(null);

  async function addTab() {
    if (!template_id) {
      return;
    }

    const newRoleID = await createRoles(template_id, defaults.roleName);
    setTabs((prev) => [...prev, { label: defaults.roleName, id: newRoleID }]);
    setActiveId(newRoleID);
  }

  async function removeTab(role_id: UUID | null): Promise<void> {
    if (role_id == null) return;

    const idx = tabs.findIndex((t) => t.id === role_id);
    await deleteRoles(role_id);

    setTabs((prev) => {
      const nextTabs = prev.filter((t) => t.id !== role_id);
      if (activeId === role_id) {
        if (nextTabs.length > 0) {
          const fallback = Math.min(idx, nextTabs.length - 1);
          setActiveId(nextTabs[fallback].id);
        } else {
          setActiveId(null);
        }
      }
      return nextTabs;
    });
  }

  function renameTab(id: UUID | null, newLabel: string) {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, label: newLabel } : t)));
  }

  return (
    <div>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            {tabs.map((t) => (
            <button
                key={String(t.id ?? t.label)}
                onClick={() => setActiveId(t.id)}
                style={{
                padding: "6px 10px",
                border: "1px solid #ccc",
                borderBottom: activeId === t.id ? "2px solid transparent" : "1px solid #ccc",
                background: activeId === t.id ? "#fff" : "#f8f8f8",
                fontWeight: activeId === t.id ? 600 : 400,
                }}
            >
                {t.label}
            </button>
            ))}
            <button onClick={addTab}>+ New</button>
        </div>

        {tabs.map((t) =>
            t.id === activeId ? (
            <div key={`panel-${String(t.id ?? t.label)}`} style={{ border: "1px solid #ccc", padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                {/* <input
                    value={t.label}
                    onChange={(e) => renameTab(t.id, e.target.value)}
                    style={{ padding: 6, border: "1px solid #ccc" }}
                /> */}
                {activeId && (
                    <button onClick={() => removeTab(t.id)} style={{ border: "1px solid #ccc", padding: 6 }}>
                    Remove
                    </button>
                )}
                </div>
                {!activeId ? (
                <TemplateOverviewForm/>
                ) : (
                <RoleForm/>
                )}
            </div>
            ) : null
        )}
        <button>Submit Template</button>
    </div>
  );
}