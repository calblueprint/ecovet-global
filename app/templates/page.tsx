"use client";

import { useState } from "react";
import { localStore, Template } from "@/types/schema";
import TemplateBuilder from "./components/TemplateBuilder";
import {
  NewTemplateButton,
  NewTemplateDiv,
  NewTemplateHeader,
  TemplateMainBox,
} from "./styles";

export const createInitialStore = (): localStore => {
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
  const [, setTick] = useState(0); //some boofed way to force a rerender by calling a random usestate lmao

  function useForceUpdate(): void {
    // call whenever my screen isn't updating :)
    setTick(tick => (tick + 1) % 10);
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
    <TemplateMainBox>
      <NewTemplateHeader>
        {(newTemp?.rolesById?.[1] as Template)?.template_name ??
          "Create A New Template"}
      </NewTemplateHeader>
      <NewTemplateDiv>
        {isNew ? (
          <TemplateBuilder
            localStore={newTemp}
            onFinish={resetTemplate}
            update={useForceUpdate}
          />
        ) : (
          <NewTemplateButton onClick={newTemplate}>
            New Template
          </NewTemplateButton>
        )}
      </NewTemplateDiv>
    </TemplateMainBox>
  );
}
