"use client";

import { useState } from "react";
import supabase from "@/actions/supabase/client";

export default function TestRPC() {
  // hardcoded values for testing
  const SESSION_ID = "0c50c7cf-8e27-41de-9252-e17201ea6f70";
  const CURRENT_PHASE_NUMBER = 1;

  const [result, setResult] = useState<string | null>(null);

  async function runTest() {
    setResult("Running...");

    const { data, error } = await supabase.rpc("advance_phase", {
      p_session_id: SESSION_ID,
      p_current_phase_num: CURRENT_PHASE_NUMBER,
    });

    if (error) {
      setResult("Error: " + error.message);
    } else if (data === null) {
      setResult("Final phase.");
    } else {
      setResult("Next phase_id: " + data);
    }
  }

  return (
    <div>
      <h1>RPC Test: advance_to_next_phase</h1>

      <p>Session ID:{SESSION_ID}</p>
      <p>Current Phase Number:{CURRENT_PHASE_NUMBER}</p>

      <button onClick={runTest}>Run RPC</button>

      {result && <p>{result}</p>}
    </div>
  );
}
