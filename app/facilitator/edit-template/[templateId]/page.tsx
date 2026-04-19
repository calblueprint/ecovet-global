"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { produce } from "immer";
import { fetchFullTemplate } from "@/actions/supabase/queries/templates";
import { SideNavContainer } from "@/app/facilitator/styles";
import TemplateBuilder from "@/app/templates/components/TemplateBuilder/TemplateBuilder";
import { ActiveIds } from "@/app/templates/page";
import { LayoutWrapper, TemplateMainBox } from "@/app/templates/styles";
import InputDropdown from "@/components/InputDropdown/InputDropdown";
import {
  EditablePhase,
  LocalStore,
  Prompt,
  Role,
  RolePhase,
  Template,
  UUID,
} from "@/types/schema";
import {
  ActionRow,
  ActionText,
  BackLink,
  LoadingMessages,
  RoleItem,
  RolesListContainer,
  RolesTitle,
  SettingsBlock,
  SidebarContent,
  Title,
} from "../styles";

interface FullTemplateResponse extends Template {
  roles: Role[];
  phases: (EditablePhase & {
    role_phases: (RolePhase & { prompts: Prompt[] })[];
  })[];
}

export default function EditTemplatePage() {
  const params = useParams();
  const templateId = params.templateId as UUID;

  const [localStore, setLocalStore] = useState<LocalStore | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeIds, setActiveIds] = useState<ActiveIds>({
    roleId: 1,
    rolePhaseId: null,
  });

  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!templateId) return;
      try {
        const data = (await fetchFullTemplate(
          templateId,
        )) as FullTemplateResponse | null;
        if (data) setLocalStore(transformToLocalStore(data));
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

  const phaseOptionsMap = useMemo(() => {
    const map = new Map<string, string>();
    if (!localStore) return map;
    localStore.phaseIds.forEach(id => {
      const phase = localStore.phasesById[id];
      if (phase)
        map.set(String(phase.phase_id), phase.phase_name || "Unnamed Phase");
    });
    return map;
  }, [localStore]);

  const availableRoles = useMemo(() => {
    if (!localStore) return [];
    return localStore.roleIds
      .filter(id => id !== 1)
      .map(id => localStore.rolesById[id] as Role);
  }, [localStore]);

  const rootTemplate = localStore?.rolesById[1] as Template | undefined;
  const templateName = rootTemplate?.template_name || "Loading...";

  const handleRoleClick = (roleId: number | string) => {
    if (!selectedPhaseId || !localStore) return;

    const rolePhaseId = localStore.rolePhaseIndex[roleId]?.[selectedPhaseId];
    if (rolePhaseId) {
      setActiveIds({ roleId: Number(roleId), rolePhaseId });
    }
  };

  const handleScenarioSettingsClick = () => {
    setActiveIds({ roleId: 1, rolePhaseId: null });
  };

  if (loading) return <LoadingMessages>Loading template...</LoadingMessages>;
  if (!localStore)
    return <LoadingMessages>Template not found.</LoadingMessages>;

  return (
    <>
      <LayoutWrapper>
        <SideNavContainer>
          <SidebarContent>
            <div>
              <BackLink>← Catalogue</BackLink>
              <Title>{templateName}</Title>
              <ActionRow>
                <ActionText>✎ Rename</ActionText>
                <ActionText>▷ Start exercise</ActionText>
              </ActionRow>
            </div>

            <SettingsBlock
              $active={activeIds.roleId === 1}
              onClick={handleScenarioSettingsClick}
            >
              Scenario Settings
            </SettingsBlock>

            <InputDropdown
              label="Select field..."
              placeholder="Select field..."
              options={phaseOptionsMap}
              value={selectedPhaseId}
              onChange={(val: string | null) => {
                setSelectedPhaseId(val);
                if (activeIds.roleId !== 1) {
                  setActiveIds({ roleId: 1, rolePhaseId: null });
                }
              }}
              isClearable
            />

            <RolesListContainer>
              <RolesTitle>Roles</RolesTitle>
              {availableRoles.map(role => {
                const isActive = activeIds.roleId === role.role_id;
                return (
                  <RoleItem
                    key={role.role_id}
                    $isDisabled={!selectedPhaseId}
                    $active={isActive}
                    disabled={!selectedPhaseId}
                    onClick={() => handleRoleClick(role.role_id)}
                  >
                    {role.role_name}
                  </RoleItem>
                );
              })}
            </RolesListContainer>
          </SidebarContent>
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
