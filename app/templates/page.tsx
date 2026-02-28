"use client";

import { useState } from "react";
import Link from "next/link";
import { produce } from "immer";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import { localStore, Template } from "@/types/schema";
import { SideNavContainer } from "../facilitator/styles";
import TemplateBuilder from "./components/TemplateBuilder";
import TemplateBuilderSideBar from "./components/TemplateBuilderSidebar";
import { TemplateMainBox } from "./styles";

const createInitialStore = (): localStore => {
  const templateID =
    crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`;

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
        timestamp: "",
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
  const [newTemp, setNewTemp] = useState<localStore>(() =>
    createInitialStore(),
  );
  const template = newTemp?.rolesById[1] as Template;

  function updateLocalStore(updater: (draft: localStore) => void) {
    setNewTemp(prev => produce(prev, updater));
  }

  function resetTemplate() {
    setNewTemp(createInitialStore());
  }

  return (
    <>
      <TopNavBar />

      <SideNavContainer>
        <TemplateBuilderSideBar />
      </SideNavContainer>

      <TemplateMainBox>
        <h1
          contentEditable
          suppressContentEditableWarning
          className="text-5xl font-extrabold mb-4 outline-none"
          onBlur={e => {
            const value = e.currentTarget.textContent?.trim();

            updateLocalStore(draft => {
              (draft.rolesById[1] as Template).template_name =
                value && value.length > 0 ? value : "New Template";
            });
          }}
        >
          {template.template_name}
        </h1>
        <TemplateBuilder
          localStore={newTemp}
          onFinish={resetTemplate}
          update={updateLocalStore}
        />
      </TemplateMainBox>
    </>
  );
}
