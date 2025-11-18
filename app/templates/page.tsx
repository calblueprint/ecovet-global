"use client";

import { useState } from "react";
import { produce } from "immer";
import { localStore } from "@/types/schema";
import TemplateBuilder from "./components/TemplateBuilder";

const createInitialStore = (): localStore => {
  const templateID =
    crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`; //some crazy fix bc this crypto returns as a string but technically isnt UUID like in schema

  return {
    templateID: templateID,
    rolesById: {
      1: {
        template_id: templateID,
        template_name: "New Template",
        accessible_to_all: null,
        user_group_id: null,
        objective: "New Template Objective",
        summary: "New Template Summary",
        setting: "New Template Setting",
        current_activity: "New Template Current Activity",
      },
    },
    roleIds: [1],
    phasesById: {},
    phaseIds: [],
    rolePhasesById: {},
    rolePhaseIndex: {},
    promptById: {},
    promptIndex: {},
  };
};

export default function NewTemplatePage() {
  const [isNew, setIsNew] = useState(false);
  const [newTemp, setNewTemp] = useState<localStore | null>(null);

  function updateLocalStore(updater: (draft: localStore) => void) {
    setNewTemp(prev => produce(prev, updater));
  }

  async function newTemplate() {
    setNewTemp(createInitialStore());
    setIsNew(true);
  }

  function resetTemplate() {
    setIsNew(false);
    setNewTemp(null);
  }

  return (
    <>
      <h1>New Template Page</h1>
      {isNew ? (
        <TemplateBuilder
          localStore={newTemp}
          onFinish={resetTemplate}
          update={updateLocalStore}
        />
      ) : (
        <button onClick={newTemplate}>New Template</button>
      )}
    </>
  );
}
