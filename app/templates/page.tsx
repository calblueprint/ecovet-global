"use client";

import { NewRole, NewPhase } from "./components/components";
import { useState } from "react";

function ScenarioStep({next} : {next: () => void}) {
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
  )
}

function RolesStep({next} : {next: () => void}) {
  const [roles, setRoles] = useState([<NewRole key={0}/>]);

  const newRole = () => {
    setRoles([...roles, <NewRole key={roles.length}/>])
  }
  return (
    <>
      {roles.map((role) => (
        role
      ))}
      <button onClick={newRole}>New Role</button>
      <button onClick={next}>Add Phases</button>
    </>
  )
}

function PhasesStep() {
  let roles = ['role1', 'role2', 'role3'];

  const [phases, setPhases] = useState([<NewPhase roles={roles} key={0}/>]);

  const newPhase = () => {
    setPhases([...phases, <NewPhase roles={roles} key={phases.length}/>])
  }
  return (
    <>
      {phases.map((phase) => (
        phase
      ))}
      <button onClick={newPhase}>New Phase</button>
      <button>Finish Template</button>
    </>
  )
}


export default function NewTemplatePage() {
  const next = () => {
    setIndex((prev) => (prev + 1));
  };

  const components = [<ScenarioStep next={next}/>, <RolesStep next={next}/>, <PhasesStep/>];
  const [index, setIndex] = useState(0);

  return(
    <>
      <h1>New Template Page</h1>
      {components[index]}
    </>
  )
}

