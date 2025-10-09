"use client";

import { NewRole, NewPhase } from "./components/components";
import { useState } from "react";

function ScenarioStep() {
  return (
    <form>
        <label>
          Scenario Title:
          <input type="text" name="scenario_title" placeholder="" />
        </label>
        <label>
          Scenario Description:
          <input type="text" name="scenario_description" placeholder="" />
        </label>
        <input type="submit" value="Add Roles" />
      </form>
  )
}

function RolesStep() {
  const [roles, SetRoles] = useState([<NewRole/>]);

  const newRole = () => {
    SetRoles([...roles, <NewRole/>])
  }
  return (
    <>
      {roles.map((role) => (
        role
      ))}
      <button onClick={newRole}>New Role</button>
      <button>Add Phases</button>
    </>
  )
}

function PhasesStep() {
  let roles = ['role1', 'role2', 'role3']

  const [phases, SetPhases] = useState([<NewPhase roles={roles}/>]);

  const newPhase = () => {
    SetPhases([...phases, <NewPhase roles={roles}/>])
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
  const submitScenario = () => {
    // go to add roles
    return
  }
  const components = [<ScenarioStep/>, <RolesStep/>, <PhasesStep/>];
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % components.length);
  };

  return(
    <>
      <h1>New Template Page</h1>
      {/* scenario title */}
      {/* scenario description */}
      {components[index]}
      <button onClick={next}>Next Component</button>
      {/* <ScenarioStep/> */}
      {/* next --------> */}
      {/* <RolesStep/> */}
      {/* add roles */}
        {/* role name */}
        {/* role description */}
        {/* OPTIONAL: role requirements? */}
      {/* next --------> */}
      {/* <PhasesStep/> */}
      {/* add phases */}
        {/* phase title */}
        {/* phase description */}
        {/* for each role */}
          {/* question input */}
    </>
  )
}

