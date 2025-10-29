import { useState } from "react";
import { UUID } from "crypto";
import TemplateOverviewForm from "./TemplateOverviewForm";
import RoleForm from "./RoleForm";
import { localStore, Role } from "@/types/schema";

export default function TemplateBuilder({localStore} : {localStore: localStore|null} ) {
  const [activeId, setActiveId] = useState<UUID|number>(1);
  const [phaseCount, setPhaseCount] = useState<number>(0);

  function addTab(): void {
    if (!localStore?.templateID) {
      return;
    }
    const newRoleID = crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`;;
    localStore.rolesById[newRoleID] = { role_id: newRoleID, role_name: "New Role", role_description: "New Role Description", template_id: localStore.templateID };
    localStore.roleIds.push(newRoleID);
    
    setActiveId(newRoleID);
  }

  function removeTab(role_id: UUID | number): void {
    if (localStore == null) return;

    delete localStore.rolesById[role_id];
    localStore.roleIds = localStore.roleIds.filter((x) => x !== role_id);
    setActiveId(localStore.roleIds.at(-1)!);
  }

  function renameTab(role_id: UUID | number, newLabel: string) {
    if (localStore == null) return;

    (localStore.rolesById[role_id] as Role).role_name = newLabel;
  }

  return (
    <div>
        <div style={{ display: "flex", justifyContent: "space-between"}}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                {localStore?.roleIds.map((t) => (
                <button
                    key={String(t)}
                    onClick={() => setActiveId(t)}
                    style={{
                    padding: "6px 10px",
                    border: "1px solid #ccc",
                    borderBottom: activeId === t ? "2px solid transparent" : "1px solid #ccc",
                    background: activeId === t ? "#fff" : "#f8f8f8",
                    fontWeight: activeId === t ? 600 : 400,
                    }}
                >
                    { localStore.rolesById[t] && 'role_name' in localStore.rolesById[t]
                        ? localStore.rolesById[t].role_name
                        : "Scenario Overview"
                    }
                </button>
                ))}
                <button onClick={addTab}>+ New</button>
            </div>
            <div style={{ display: "flex", alignItems: 'center' }}>
                <p>Phases: {phaseCount}</p>
                <button onClick={() => setPhaseCount(prev => prev + 1)}>UP</button>
                <button onClick={() => setPhaseCount(prev => Math.max(prev - 1, 0))}>DOWN</button>
            </div>
        </div>

        {localStore?.roleIds.map((t) =>
            t === activeId ? (
            <div key={`panel-${String(t)}`} style={{ border: "1px solid #ccc", padding: 12 }}>
                {activeId !== 1 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <input
                            value={(localStore.rolesById[t] as Role).role_name}
                            onChange={(e) => renameTab(t, e.target.value)}
                            style={{ padding: 6, border: "1px solid #ccc" }}
                        />
                        <button onClick={() => removeTab(t)} style={{ border: "1px solid #ccc", padding: 6 }}>
                            Remove
                        </button>
                    </div>
                )}
                {activeId === 1 ? (
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