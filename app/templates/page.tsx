import { NewRole } from "./components/components";
import { useState } from "react";

export default function Page() {
  const submitScenario = () => {
    // go to add roles
    return
  }

  return(
    <>
      <h1>New Template Page</h1>
      {/* scenario title */}
      {/* scenario description */}
      <form onSubmit={submitScenario}>
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

      {/* next --------> */}
      {/* add roles */}
        {/* role name */}
        {/* role description */}
        {/* OPTIONAL: role requirements? */}
      {/* next --------> */}
      {/* add phases */}
        {/* phase title */}
        {/* phase description */}
        {/* for each role */}
          {/* question input */}
    </>
  )
}