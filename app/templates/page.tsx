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

//   const TABS = [
//   { id: "intro",       label: "Introduction",  component: IntroTab },
//   { id: "experience",  label: "Work Experience", component: ExperienceTab },
//   { id: "education",   label: "Education",     component: EducationTab },
//   { id: "review",      label: "Review & Submit", component: ReviewTab },
// ];
  return(
    <>
      <h1>New Template Page</h1>
      {/* scenario title */}
      {/* scenario description */}
      <ScenarioStep/>
      {/* next --------> */}
      <RolesStep/>
      {/* add roles */}
        {/* role name */}
        {/* role description */}
        {/* OPTIONAL: role requirements? */}
      {/* next --------> */}
      <PhasesStep/>
      {/* add phases */}
        {/* phase title */}
        {/* phase description */}
        {/* for each role */}
          {/* question input */}
    </>
  )
}

