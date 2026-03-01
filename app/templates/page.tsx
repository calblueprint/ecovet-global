"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UUID } from "crypto";
import { produce } from "immer";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import { localStore, Template } from "@/types/schema";
import { SideNavContainer } from "../facilitator/styles";
import { LayoutWrapper } from "./components/styles";
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
  const [activeId, setActiveId] = useState<UUID | number>(1); // current 'tab' or role
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

  useEffect(() => {
    console.log(newTemp);
  }, [newTemp]);

  return (
    <>
      <TopNavBar />

      <LayoutWrapper>
        <SideNavContainer>
          <TemplateBuilderSideBar
            localStore={newTemp}
            updateLocalStore={updateLocalStore}
            setActiveId={setActiveId}
          />
        </SideNavContainer>

        <TemplateMainBox>
          <TemplateBuilder
            activeId={activeId}
            setActiveId={setActiveId}
            localStore={newTemp}
            onFinish={resetTemplate}
            update={updateLocalStore}
          />
        </TemplateMainBox>
      </LayoutWrapper>
    </>
  );
}
