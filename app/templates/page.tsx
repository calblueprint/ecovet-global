"use client";

import { useState } from "react";
import React from "react";
import supabase from "@/api/supabase/createClient";
import { UUID } from "crypto";
import { createTemplates, createPhases, createRoles } from "@/api/supabase/queries/templates";
import { NewPhase, NewRole } from "./components/components";
import insertTemplateFlow from "@/api/supabase/queries/testing/templates";

type Tabs = [string, UUID|null];

const defaults = {
  tempName: "New Template",
  tempSummary: "New Template Summary",
  tempSetting: "New Template Setting",
  tempCurrActivity: "New Template Current Activity",
  roleName: "New Role",
  roleDescription: "Role Description",
}

async function ScenarioStep({ next }: { next: () => void }) {

  const [tabs, setTabs] = useState<Tabs[]>([]); // uuid from DB or name, idk yet
  const [templateID, setTemplateID] = useState<UUID|null>(null);
  const [activeId, setActiveId] = useState<UUID|null>(null);
  const [loading, setLoading] = useState(false);
 
  async function newTemplate() {
    const newTemplateID = await createTemplates(defaults.tempName, true, "Template Objective", defaults.tempSummary, defaults.tempSetting, defaults.tempCurrActivity, null);
    setTemplateID(newTemplateID);
  }

  async function addTab() {
    const newRoleID = await createRoles(defaults.roleName, templateID, defaults.roleDescription);
    
    setTabs(prev => [...prev, [defaults.roleName, newRoleID]]);
    setActiveId(newRoleID)
  }

  // async function removeTab(id: string) {
  //   const idx = tabs.findIndex(t => t.id === id);

  //   const { error } = await supabase.from("tabs").delete().eq("id", id);
  //   if (error) {
  //     setErr(error.message);
  //     return;
  //   }

  //   setTabs(prev => {
  //     const next = prev.filter(t => t.id !== id);
  //     if (activeId === id && next.length > 0) {
  //       const fallback = Math.min(idx, next.length - 1);
  //       setActiveId(next[fallback].id);
  //     } else if (next.length === 0) {
  //       setActiveId(null);
  //     }
  //     return next;
  //   });
  // }

  async function renameTab(id: string, newLabel: string) {
    setErr(null);
    const { error } = await supabase.from("tabs").update({ label: newLabel }).eq("id", id);
    if (error) {
      setErr(error.message);
      return;
    }
    setTabs(prev => prev.map(t => (t.id === id ? { ...t, label: newLabel } : t)));
  }
  return (
    <>
      <button onClick={next}>New Template</button>
      <form>
        <input type="text" name="scenario_title" placeholder="New Scenario Title" />
      </form>
      <br></br>
      {/* Tabs on the bottom */}
      <button onClick={next}>Add Roles</button>
      {/* <button onClick={await insertTemplateFlow}>Test insertTemplateFlow</button> */}
    </>
  );
}














function RolesStep({ next }: { next: () => void }) {
  const [roles, setRoles] = useState([<NewRole key={0} />]);

  const newRole = () => {
    setRoles([...roles, <NewRole key={roles.length} />]);
  };
  return (
    <>
      {roles.map(role => role)}
      <button onClick={newRole}>New Role</button>
      <button onClick={next}>Add Phases</button>
    </>
  );
}

function PhasesStep() {
  const roles = ["role1", "role2", "role3"]; // temp roles

  const [phases, setPhases] = useState([<NewPhase roles={roles} key={0} />]);

  const newPhase = () => {
    setPhases([...phases, <NewPhase roles={roles} key={phases.length} />]);
  };
  return (
    <>
      {phases.map(phase => phase)}
      <button onClick={newPhase}>New Phase</button>
      <button>Finish Template</button>
    </>
  );
}

export default function NewTemplatePage() {
  const next = () => {
    setIndex(prev => prev + 1);
  };

  const components = [
    <ScenarioStep next={next} key={"scenario"} />,
    <RolesStep next={next} key={"role"} />,
    <PhasesStep key={"phase"} />,
  ];
  const [index, setIndex] = useState(0);

  return (
    <>
      <h1>New Template Page</h1>
      {components[index]}
    </>
  );
}
