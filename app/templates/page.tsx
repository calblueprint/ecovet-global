"use client";

import { useState } from "react";
import { produce } from "immer";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import { LocalStore, Template, UUID } from "@/types/schema";
import { SideNavContainer } from "../facilitator/styles";
import { LayoutWrapper } from "./components/styles";
import TemplateBuilder from "./components/TemplateBuilder";
import TemplateBuilderSideBar from "./components/TemplateBuilderSidebar";
import { TemplateMainBox } from "./styles";

const createInitialStore = (): LocalStore => {
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
    optionsByPromptId: {},
  };
};

export type ActiveIds = {
  roleId: UUID | number;
  rolePhaseId: UUID | null;
};

export default function NewTemplatePage() {
  const [activeIds, setActiveIds] = useState<ActiveIds>({
    roleId: 1,
    rolePhaseId: null,
  });
  const [newTemp, setNewTemp] = useState<LocalStore>(() =>
    createInitialStore(),
  );
  const template = newTemp?.rolesById[1] as Template;

  function updateLocalStore(updater: (draft: LocalStore) => void) {
    setNewTemp(prev => produce(prev, updater));
  }

  function resetTemplate() {
    setNewTemp(createInitialStore());
  }

  return (
    <>
      <TopNavBar />

      <LayoutWrapper>
        <SideNavContainer>
          <TemplateBuilderSideBar
            localStore={newTemp}
            updateLocalStore={updateLocalStore}
            setActiveIds={setActiveIds}
          />
        </SideNavContainer>

        <TemplateMainBox>
          <TemplateBuilder
            activeIds={activeIds}
            setActiveIds={setActiveIds}
            localStore={newTemp}
            onFinish={resetTemplate}
            update={updateLocalStore}
          />
        </TemplateMainBox>
      </LayoutWrapper>
    </>
  );
}
