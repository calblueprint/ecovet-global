"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { produce } from "immer";
import {
  addNewOption,
  replacePromptOptions,
} from "@/actions/supabase/queries/prompt";
import {
  createPhases,
  createPrompts,
  createRolePhases,
  createRoles,
  createTemplates,
  fetchFullTemplate,
} from "@/actions/supabase/queries/templates";
import TemplateBuilder from "@/app/templates/components/TemplateBuilder/TemplateBuilder";
import {
  LayoutWrapper,
  TemplateMainBox,
  TitleInput,
  TitleRow,
} from "@/app/templates/styles";
import Pencil from "@/assets/images/pencil.svg";
import Play from "@/assets/images/play.svg";
import InputDropdown from "@/components/InputDropdown/InputDropdown";
import { ImageLogo } from "@/components/styles";
import WarningModal, {
  WarningAction,
} from "@/components/WarningModal/WarningModal";
import {
  EditablePhase,
  LocalStore,
  Prompt,
  Role,
  RolePhase,
  StagedOption,
  Template,
  UUID,
} from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import { SideNavTemplatesContainer } from "../facilitator/template-list/components/styles";
import {
  ActionRow,
  ActionText,
  BackLink,
  HeaderButtonDark,
  LoadingMessages,
  RoleItem,
  RolesListContainer,
  RolesTitle,
  SettingsBlock,
  SidebarContent,
  SideNavContainer,
  Title,
} from "./styles";

interface FullTemplateResponse extends Template {
  roles: Role[];
  phases: (EditablePhase & {
    role_phases: (RolePhase & {
      prompts: (Prompt & { options?: StagedOption[] })[];
    })[];
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

interface FullTemplateResponse extends Template {
  roles: Role[];
  phases: (EditablePhase & {
    role_phases: (RolePhase & {
      prompts: (Prompt & { options?: StagedOption[] })[];
    })[];
  })[];
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
  const optionsByPromptId: Record<UUID, StagedOption[]> = {};

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
        optionsByPromptId[p.prompt_id] = p.options ?? [];
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
    optionsByPromptId,
  };
}

export default function TemplateBuilderPage() {
  const { profile } = useProfile();
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get("templateId") as UUID | null;
  const isFromTemplateList = searchParams.get("fromTemplateList") === "true";

  const [saving, setSaving] = useState(false);

  const [localStore, setLocalStore] = useState<LocalStore>(() =>
    createInitialStore(),
  );
  const [loading, setLoading] = useState(isFromTemplateList);

  const [activeIds, setActiveIds] = useState<ActiveIds>({
    roleId: 1,
    rolePhaseId: null,
  });

  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);

  const [showBackWarning, setShowBackWarning] = useState(false);

  async function saveTemplate(): Promise<void> {
    if (!localStore) return;
    setSaving(true);
    try {
      const saveStore: LocalStore = structuredClone(localStore);

      const realtemplateID = await createTemplates(
        saveStore.templateID,
        (saveStore.rolesById[1] as Template).template_name,
        null,
        (saveStore.rolesById[1] as Template).objective,
        (saveStore.rolesById[1] as Template).summary,
        (saveStore.rolesById[1] as Template).setting,
        (saveStore.rolesById[1] as Template).current_activity,
        profile?.user_group_id,
      );

      for (const roleID of saveStore.roleIds) {
        if (typeof roleID !== "number") {
          await createRoles(
            roleID,
            realtemplateID,
            (saveStore.rolesById[roleID] as Role).role_name,
            (saveStore.rolesById[roleID] as Role).role_description,
          );
        }
      }

      for (const phaseID of saveStore.phaseIds) {
        console.log("saving phase:", saveStore.phasesById[phaseID]);
        await createPhases(
          phaseID,
          saveStore.phasesById[phaseID].template_id,
          saveStore.phasesById[phaseID].phase_name,
          saveStore.phasesById[phaseID].phase_description,
          saveStore.phasesById[phaseID].phase_number,
        );
      }

      for (const [roleID, obj] of Object.entries(saveStore.rolePhaseIndex) as [
        UUID,
        Record<UUID, UUID>,
      ][]) {
        for (const [phaseID, rolePhaseID] of Object.entries(obj) as [
          UUID,
          UUID,
        ][]) {
          try {
            await createRolePhases(
              rolePhaseID,
              phaseID,
              roleID,
              saveStore.rolePhasesById[rolePhaseID].role_phase_description,
            );
          } catch (err) {
            console.error("createRolePhases error:", err);
          }
        }
      }

      for (const [rolePhaseID, promptIDs] of Object.entries(
        saveStore.promptIndex,
      ) as [UUID, UUID[]][]) {
        for (let i = 0; i < promptIDs.length; i++) {
          const promptID = promptIDs[i];
          const prompt = saveStore.promptById[promptID];
          if (!prompt) continue;

          await createPrompts(
            promptID,
            prompt.role_phase_id ?? rolePhaseID,
            prompt.prompt_text,
            prompt.prompt_follow_ups,
            prompt.prompt_type,
            i + 1,
          );
          const options = saveStore.optionsByPromptId[promptID] ?? [];
          await replacePromptOptions(promptID, options);
        }
      }
    } catch (err) {
      console.error("Save failed", err);
      throw err; // re-throw so callers can react
    } finally {
      setSaving(false);
    }
  }

  const handleBackToList = () => {
    setShowBackWarning(true);
  };

  const handleBackWarningClose = async (action: WarningAction) => {
    if (action === "cancel") {
      setShowBackWarning(false);
      return;
    }
    if (action === "primary") {
      try {
        await saveTemplate();
      } catch {
        // leave modal open so user can retry or choose "leave without saving"
        return;
      }
    }
    setShowBackWarning(false);
    router.push(`/facilitator/template-list`);
  };

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

  const handleBackConfirm = (shouldLeave: boolean) => {
    setShowBackWarning(false);
    if (shouldLeave) {
      router.push(`/facilitator/template-list`);
    }
  };

  const handleStartExercise = () => {
    if (!localStore) return;
    if (!isFromTemplateList) {
      alert("Please save the template before starting.");
      return;
    }
    router.push(
      `/facilitator/exercises/start?templateId=${localStore.templateID}`,
    );
  };

  const handleTemplateRename = (newName: string) => {
    updateLocalStore(draft => {
      (draft.rolesById[1] as Template).template_name = newName;
    });
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
  const templateName = rootTemplate?.template_name;

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
              <BackLink onClick={handleBackToList}>← Catalogue</BackLink>
              <TitleRow>
                {isRenaming ? (
                  <Title
                    as="input"
                    value={templateName as string}
                    autoFocus
                    onChange={e => handleTemplateRename(e.target.value)}
                    onBlur={() => setIsRenaming(false)}
                    onKeyDown={e => {
                      if (e.key === "Enter") setIsRenaming(false);
                    }}
                  />
                ) : (
                  <Title>{templateName || "Untitled"}</Title>
                )}
                <ActionText onClick={() => setIsRenaming(true)}>
                  <ImageLogo
                    src={Pencil.src}
                    alt="Pencil"
                    width={17}
                    height={17}
                  />
                </ActionText>
              </TitleRow>
              <ActionRow>
                <HeaderButtonDark onClick={handleStartExercise}>
                  <ImageLogo src={Play.src} alt="Play" width={12} height={12} />
                  Start exercise
                </HeaderButtonDark>
              </ActionRow>
            </div>

            <SettingsBlock
              $active={activeIds.roleId === 1}
              onClick={handleScenarioSettingsClick}
            >
              Scenario Settings
            </SettingsBlock>

            <InputDropdown
              label="Select a phase..."
              placeholder="Select a phase..."
              options={phaseOptionsMap}
              value={selectedPhaseId}
              onChange={(val: string | null) => {
                setSelectedPhaseId(val);
                if (activeIds.roleId !== 1) {
                  setActiveIds({ roleId: 1, rolePhaseId: null });
                }
              }}
              isClearable
              outlined={false}
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
            saveTemplate={saveTemplate}
            setSelectedPhaseId={setSelectedPhaseId}
          />
        </TemplateMainBox>
      </LayoutWrapper>

      <WarningModal
        open={showBackWarning}
        onClose={handleBackWarningClose}
        title="Unsaved changes"
        caption="You have unsaved changes. What would you like to do?"
        noCancel={true}
        confirmLabel="Leave without saving"
        primaryLabel="Save and leave"
        loading={saving}
      />
    </>
  );
}
