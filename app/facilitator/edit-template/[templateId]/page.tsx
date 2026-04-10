"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { produce } from "immer";
import { fetchFullTemplate } from "@/actions/supabase/queries/templates";
import TemplateBuilder from "@/app/templates/components/TemplateBuilder/TemplateBuilder";
import TemplateBuilderSideBar from "@/app/templates/components/TemplateBuilderSidebar/TemplateBuilderSidebar";
import { ActiveIds } from "@/app/templates/page";
import { LayoutWrapper, TemplateMainBox } from "@/app/templates/styles";
// UI Components & Styles
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
// Types
import {
  EditablePhase,
  LocalStore,
  Prompt,
  Role,
  RolePhase,
  Template,
  UUID,
} from "@/types/schema";
import { SideNavContainer } from "../../styles";

// Step 2 Interface: Matches the Supabase Query
interface FullTemplateResponse extends Template {
  roles: Role[];
  phases: (EditablePhase & {
    role_phases: (RolePhase & {
      prompts: Prompt[];
    })[];
  })[];
}

// Step 3 Component: The Page UI
export default function EditTemplatePage() {
  const params = useParams();
  const templateId = params.templateId as UUID;

  const [localStore, setLocalStore] = useState<LocalStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIds, setActiveIds] = useState<ActiveIds>({
    roleId: 1,
    rolePhaseId: null,
  });

  useEffect(() => {
    async function load() {
      if (!templateId) return;

      try {
        const data = (await fetchFullTemplate(
          templateId,
        )) as FullTemplateResponse | null;
        if (data) {
          setLocalStore(transformToLocalStore(data));
        }
      } catch (err) {
        console.error("Load failed", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [templateId]);

  const updateLocalStore = (updater: (draft: LocalStore) => void) => {
    setLocalStore(prev => (prev ? produce(prev, updater) : prev));
  };

  if (loading)
    return <div style={{ padding: "20px" }}>Loading template...</div>;
  if (!localStore)
    return <div style={{ padding: "20px" }}>Template not found.</div>;

  return (
    <>
      <TopNavBar />
      <LayoutWrapper>
        <SideNavContainer>
          <TemplateBuilderSideBar
            localStore={localStore}
            updateLocalStore={updateLocalStore}
            setActiveIds={setActiveIds}
          />
        </SideNavContainer>

        <TemplateMainBox>
          <TemplateBuilder
            activeIds={activeIds}
            setActiveIds={setActiveIds}
            localStore={localStore}
            onFinish={() => {}}
            update={updateLocalStore}
          />
        </TemplateMainBox>
      </LayoutWrapper>
    </>
  );
}

// Step 2 Helper: The Transformer
function transformToLocalStore(data: FullTemplateResponse): LocalStore {
  const rolesById: Record<number | UUID, Role | Template> = { 1: data };
  const roleIds: (number | UUID)[] = [1];
  const phasesById: Record<UUID, EditablePhase> = {};
  const phaseIds: UUID[] = [];
  const rolePhasesById: Record<UUID, RolePhase> = {};
  const promptById: Record<UUID, Prompt> = {};
  const rolePhaseIndex: Record<UUID, Record<UUID, UUID>> = {};
  const promptIndex: Record<UUID, UUID[]> = {};

  data.roles?.forEach(role => {
    rolesById[role.role_id] = role;
    roleIds.push(role.role_id);
  });

  data.phases?.forEach(phase => {
    phasesById[phase.phase_id] = phase;
    phaseIds.push(phase.phase_id);

    phase.role_phases?.forEach(rp => {
      rolePhasesById[rp.role_phase_id] = rp;
      if (!rolePhaseIndex[rp.role_id]) rolePhaseIndex[rp.role_id] = {};
      rolePhaseIndex[rp.role_id][phase.phase_id] = rp.role_phase_id;

      if (!promptIndex[rp.role_phase_id]) promptIndex[rp.role_phase_id] = [];
      rp.prompts?.forEach(p => {
        promptById[p.prompt_id] = p;
        promptIndex[rp.role_phase_id].push(p.prompt_id);
      });
    });
  });

  return {
    templateID: data.template_id,
    rolesById,
    roleIds,
    phasesById,
    phaseIds,
    rolePhasesById,
    rolePhaseIndex,
    promptById,
    promptIndex,
    optionsByPromptId: {},
  };
}
