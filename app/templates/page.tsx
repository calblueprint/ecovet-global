"use client";

import { useState } from "react";
import { produce } from "immer";
import { localStore, Template } from "@/types/schema";
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
        objective: "",
        summary: "",
        setting: "",
        current_activity: "",
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
  const template = newTemp?.rolesById[1] as Template;

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
      {isNew && newTemp && (
        <input
          type="text"
          value={template.template_name ?? "New Template"}
          onChange={e =>
            updateLocalStore(draft => {
              (draft.rolesById[1] as Template).template_name = e.target.value;
            })
          }
          className="text-4xl font-bold mb-4 border"
        />
      )}
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
