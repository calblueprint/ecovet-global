"use client";

import React, { useEffect, useState } from "react";
import { UUID } from "crypto";
// NOTE: These must be browser-safe (use NEXT_PUBLIC keys). If they aren't,
// see "Server Actions" section below.
import { createTemplates, createPhases, createRoles, deleteRoles } from "@/api/supabase/queries/templates";
import { NewPhase, NewRole } from "./components/components";

type Tab = { label: string; id: UUID | null };

const defaults = {
  tempName: "New Template",
  tempSummary: "New Template Summary",
  tempSetting: "New Template Setting",
  tempCurrActivity: "New Template Current Activity",
  roleName: "New Role",
  roleDescription: "Role Description",
};

function ScenarioStep({ next }: { next: () => void }) {
  // ✅ use object shape, not tuple
  const [tabs, setTabs] = useState<Tab[]>([{ label: "Scenario Overview", id: null }]);
  const [templateID, setTemplateID] = useState<UUID | null>(null);
  const [activeId, setActiveId] = useState<UUID | null>(null);
  const [loading, setLoading] = useState(false);

  async function newTemplate() {
    setLoading(true);
    try {
      const newTemplateID = await createTemplates(); // must be client-safe
      setTemplateID(newTemplateID);
      // optionally set first tab active
      if (activeId === null) setActiveId(tabs[0]?.id ?? null);
    } finally {
      setLoading(false);
    }
  }

  async function addTab() {
    if (!templateID) {
      // ensure template exists before creating roles tied to it
      await newTemplate();
    }
    if (!templateID) return;

    const newRoleID = await createRoles(defaults.roleName, templateID, defaults.roleDescription);
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
      <button onClick={newTemplate} disabled={loading}>
        {loading ? "Creating..." : "New Template"}
      </button>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        {tabs.map((t) => (
          <button
            key={String(t.id ?? t.label)} // ✅ add key
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
              <input
                value={t.label}
                onChange={(e) => renameTab(t.id, e.target.value)}
                style={{ padding: 6, border: "1px solid #ccc" }}
              />
              {tabs.length > 1 && (
                <button onClick={() => removeTab(t.id)} style={{ border: "1px solid #ccc", padding: 6 }}>
                  Remove
                </button>
              )}
            </div>
            {"Empty tab"}
          </div>
        ) : null
      )}

      <button onClick={next} style={{ marginTop: 12 }}>Add Roles</button>
    </div>
  );
}

function RolesStep({ next }: { next: () => void }) {
  const [roles, setRoles] = useState([<NewRole key={0} />]);
  const newRole = () => setRoles((r) => [...r, <NewRole key={r.length} />]);
  return (
    <>
      {roles}
      <button onClick={newRole}>New Role</button>
      <button onClick={next}>Add Phases</button>
    </>
  );
}

function PhasesStep() {
  const roles = ["role1", "role2", "role3"]; // temp roles
  const [phases, setPhases] = useState([<NewPhase roles={roles} key={0} />]);
  const newPhase = () => setPhases((p) => [...p, <NewPhase roles={roles} key={p.length} />]);
  return (
    <>
      {phases}
      <button onClick={newPhase}>New Phase</button>
      <button>Finish Template</button>
    </>
  );
}

export default function NewTemplatePage() {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => i + 1);

  const components = [
    <ScenarioStep next={next} key="scenario" />,
    <RolesStep next={next} key="role" />,
    <PhasesStep key="phase" />,
  ];

  return (
    <>
      <h1>New Template Page</h1>
      {components[index]}
    </>
  );
}


// "use client";

// import { useState } from "react";
// import React from "react";
// import { UUID } from "crypto";
// import { createTemplates, createPhases, createRoles, deleteRoles } from "@/api/supabase/queries/templates";
// import { NewPhase, NewRole } from "./components/components";
// import insertTemplateFlow from "@/api/supabase/queries/testing/templates";

// type Tabs = [string, UUID|null];

// const defaults = {
//   tempName: "New Template",
//   tempSummary: "New Template Summary",
//   tempSetting: "New Template Setting",
//   tempCurrActivity: "New Template Current Activity",
//   roleName: "New Role",
//   roleDescription: "Role Description",
// }

// async function ScenarioStep({ next }: { next: () => void }) {

//   const [tabs, setTabs] = useState<Tabs[]>([["Scenario Overview", null]]); // uuid from DB or name, idk yet
//   const [templateID, setTemplateID] = useState<UUID|null>(null);
//   const [activeId, setActiveId] = useState<UUID|null>(null);
//   const [loading, setLoading] = useState(false);
 
//   async function newTemplate() {
//     const newTemplateID = await createTemplates();
//     setTemplateID(newTemplateID);
//   }

//   async function addTab() {
//     const newRoleID = await createRoles(defaults.roleName, templateID, defaults.roleDescription);
    
//     setTabs(prev => [...prev, [defaults.roleName, newRoleID]]);
//     setActiveId(newRoleID)
//   }

//   async function removeTab(role_id: UUID | null): Promise<void> {
//     if (role_id == null) {
//       return;
//     }

//     const idx = tabs.findIndex(t => t[1] === role_id);
//     await deleteRoles(role_id);

//     setTabs(prev => {
//       const next = prev.filter(t => t[1] !== role_id);
//       if (activeId === role_id && next.length > 0) {
//         const fallback = Math.min(idx, next.length - 1);
//         setActiveId(next[fallback][1]);
//       } else if (next.length === 0) {
//         setActiveId(null);
//       }
//       return next;
//     });
//   }

//   async function renameTab(id: UUID, newLabel: string) {
//     // setTabs(prev => prev.map(t => (t.id === id ? { ...t, label: newLabel } : t)));
//   }
//   return (
//     // <>
//     //   <button onClick={newTemplate}>New Template</button>
//     //   <form>
//     //     <input type="text" name="scenario_title" placeholder="New Scenario Title" />
//     //   </form>
//     //   <br></br>
//     //   {/* Tabs on the bottom */}
//     //   <button onClick={next}>Add Roles</button>
//     //   {/* <button onClick={await insertTemplateFlow}>Test insertTemplateFlow</button> */}
//     // </>
//     <div>
//       <button onClick={newTemplate}>New Template</button>
//       <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
//         {tabs.map((t) => (
//           <button
//             onClick={() => setActiveId(t[1])}
//             style={{
//               padding: "6px 10px",
//               border: "1px solid #ccc",
//               borderBottom: activeId === t[1] ? "2px solid transparent" : "1px solid #ccc",
//               background: activeId === t[1] ? "#fff" : "#f8f8f8",
//               fontWeight: activeId === t[1] ? 600 : 400,
//             }}
//           >
//             {t[0]}
//           </button>
//         ))}
//         <button onClick={addTab}>+ New</button>
//       </div>

//       {/* Panels */}
//       {tabs.map((t) =>
//         t[1] === activeId ? (
//           <div style={{ border: "1px solid #ccc", padding: 12 }}>
//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
//               <input
//                 value={t[0]}
//                 onChange={(e) =>
//                   setTabs((prev) => prev.map((x) => (x[1] === t[1] ? { ...x, label: e.target.value } : x)))
//                 }
//                 style={{ padding: 6, border: "1px solid #ccc" }}
//               />
//               {tabs.length > 1 && (
//                 <button onClick={() => removeTab(t[1])} style={{ border: "1px solid #ccc", padding: 6 }}>
//                   Remove
//                 </button>
//               )}
//             </div>
//             {"Empty tab"}
//           </div>
//         ) : null
//       )}
//     </div>
//   );
// }














// function RolesStep({ next }: { next: () => void }) {
//   const [roles, setRoles] = useState([<NewRole key={0} />]);

//   const newRole = () => {
//     setRoles([...roles, <NewRole key={roles.length} />]);
//   };
//   return (
//     <>
//       {roles.map(role => role)}
//       <button onClick={newRole}>New Role</button>
//       <button onClick={next}>Add Phases</button>
//     </>
//   );
// }

// function PhasesStep() {
//   const roles = ["role1", "role2", "role3"]; // temp roles

//   const [phases, setPhases] = useState([<NewPhase roles={roles} key={0} />]);

//   const newPhase = () => {
//     setPhases([...phases, <NewPhase roles={roles} key={phases.length} />]);
//   };
//   return (
//     <>
//       {phases.map(phase => phase)}
//       <button onClick={newPhase}>New Phase</button>
//       <button>Finish Template</button>
//     </>
//   );
// }

// export default function NewTemplatePage() {
//   const next = () => {
//     setIndex(prev => prev + 1);
//   };

//   const components = [
//     <ScenarioStep next={next} key={"scenario"} />,
//     <RolesStep next={next} key={"role"} />,
//     <PhasesStep key={"phase"} />,
//   ];
//   const [index, setIndex] = useState(0);

//   return (
//     <>
//       <h1>New Template Page</h1>
//       {components[index]}
//     </>
//   );
// }
