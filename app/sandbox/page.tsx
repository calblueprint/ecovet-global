"use client";

import { useState } from "react";
import WarningModal from "../../components/WarningModal/WarningModal";

export default function SandboxPage() {
  const [open, setOpen] = useState(false);

  // test function to see if value selected (delete or cancel) is being passed back correctly from the WarningModal
  const testDelete = (selectedValue: boolean) => {
    console.log("An option was selected, delete item is " + selectedValue);
    setOpen(false);
  };

  return (
    <div>
      <h1>BETA TESTING ONLY!!! For testing components and whatnot</h1>
      <button onClick={() => setOpen(true)}>
        Click to show the Warning Modal
      </button>

      <WarningModal open={open} onClose={testDelete} />
    </div>
  );
}
