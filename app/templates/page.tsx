"use client";

import { useState } from "react";
import { NewPhase, NewRole } from "./components/components";

function ScenarioStep({ next }: { next: () => void }) {
  return (
    <>
      <form>
        <label>
          Scenario Title:
          <input type="text" name="scenario_title" placeholder="" />
        </label>
        <label>
          Scenario Description:
          <input type="text" name="scenario_description" placeholder="" />
        </label>
      </form>
      <button onClick={next}>Add Roles</button>
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
