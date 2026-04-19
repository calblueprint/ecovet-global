"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { produce } from "immer";
import { fetchFullTemplate } from "@/actions/supabase/queries/templates";
import { SideNavContainer } from "@/app/facilitator/styles";
import TemplateBuilder from "@/app/templates/components/TemplateBuilder/TemplateBuilder";
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
} from "./styles";

interface FullTemplateResponse extends Template {
  roles: Role[];
  phases: (EditablePhase & {
    role_phases: (RolePhase & { prompts: Prompt[] })[];
  })[];
}

export type ActiveIds = {
  roleId: UUID | number;
  rolePhaseId: UUID | null;
};

const createInitialStore = (): LocalStore => {
  const templateID = crypto.randomUUID() as UUID;

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

export default function TemplateBuilderPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId") as UUID | null;
  const isFromTemplateList = searchParams.get("fromTemplateList") === "true";

  const [localStore, setLocalStore] = useState<LocalStore>(() =>
    createInitialStore(),
  );
  const [loading, setLoading] = useState(isFromTemplateList);

  const [activeIds, setActiveIds] = useState<ActiveIds>({
    roleId: 1,
    rolePhaseId: null,
  });

  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (isFromTemplateList && templateId) {
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
    }
    load();
  }, [isFromTemplateList, templateId]);

  const updateLocalStore = (updater: (draft: LocalStore) => void) => {
    setLocalStore(prev => produce(prev, updater));
  };

  const resetTemplate = () => {
    setLocalStore(createInitialStore());
    setActiveIds({ roleId: 1, rolePhaseId: null });
    setSelectedPhaseId(null);
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
      setActiveIds({ roleId: roleId, rolePhaseId });
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
            onFinish={resetTemplate}
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
