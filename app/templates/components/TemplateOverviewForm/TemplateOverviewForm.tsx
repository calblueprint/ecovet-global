import { useState } from "react";
import Check from "@/assets/images/checkmark.svg";
import { ImageLogo } from "@/components/styles";
import { EditablePhase, Role, Template, UUID } from "@/types/schema";
import { AutoGrowBigInput } from "./AutoGrow";
import {
  BigInput,
  CardTitle,
  DeleteIconButton,
  DummyInput,
  FieldCard,
  FieldLegend,
  FormStack,
  HeaderButtonDark,
  ListCard,
  PhaseTemplateHeader,
  RoleHeader,
  RoleHeaderContainer,
  SmallButton,
  TabButton,
  TabsContainer,
} from "./styles";

export default function TemplateOverviewForm({
  value,
  phases,
  roles,
  onChange,
  onAddPhase,
  onAddRole,
  onRenamePhase,
  onRenameRole,
  onRemovePhase,
  onRemoveRole,
  onUpdatePhaseDescription,
  onUpdateRoleDescription,
  onSaveAndExit,
  saving,
}: {
  value: Template;
  phases: EditablePhase[];
  roles: Role[];
  onChange: (id: number, field: string, val: string) => void;
  onAddPhase: () => void;
  onAddRole: () => void;
  onRenamePhase: (phase_id: UUID, name: string) => void;
  onRenameRole: (role_id: UUID, name: string) => void;
  onRemovePhase: (phase_id: UUID) => void;
  onRemoveRole: (role_id: UUID) => void;
  onUpdatePhaseDescription: (phase_id: UUID, description: string) => void;
  onUpdateRoleDescription: (role_id: UUID, description: string) => void;
  onSaveAndExit: () => void;
  saving: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"phases" | "roles">("phases");
  return (
    <FormStack>
      <RoleHeaderContainer>
        <RoleHeader>
          <PhaseTemplateHeader>Scenario Overview</PhaseTemplateHeader>

          <HeaderButtonDark onClick={onSaveAndExit} disabled={saving}>
            {saving ? (
              "Saving..."
            ) : (
              <>
                <ImageLogo
                  src={Check.src}
                  alt="Checkmark"
                  width={12}
                  height={12}
                  padding-right={1}
                />
                Save and exit
              </>
            )}
          </HeaderButtonDark>
        </RoleHeader>
      </RoleHeaderContainer>

      <FieldCard>
        <FieldLegend>Summary</FieldLegend>
        <AutoGrowBigInput
          name="template_summary"
          placeholder="Summary"
          value={value.summary ?? ""}
          onChange={e => onChange(1, "summary", e.target.value)}
        />
      </FieldCard>

      <FieldCard>
        <FieldLegend>Setting</FieldLegend>
        <AutoGrowBigInput
          name="template_setting"
          placeholder="Setting"
          value={value.setting ?? ""}
          onChange={e => onChange(1, "setting", e.target.value)}
        />
      </FieldCard>

      <FieldCard>
        <FieldLegend>Current Activity</FieldLegend>
        <AutoGrowBigInput
          name="template_activity"
          placeholder="Current activity"
          value={value.current_activity ?? ""}
          onChange={e => onChange(1, "current_activity", e.target.value)}
        />
      </FieldCard>

      <TabsContainer>
        <TabButton
          $active={activeTab === "phases"}
          onClick={e => {
            e.preventDefault();
            setActiveTab("phases");
          }}
        >
          Phases ({phases.length})
        </TabButton>
        <TabButton
          $active={activeTab === "roles"}
          onClick={e => {
            e.preventDefault();
            setActiveTab("roles");
          }}
        >
          Roles ({roles.length})
        </TabButton>
      </TabsContainer>

      {activeTab === "phases" && (
        <div>
          {phases.map((phase, index) => (
            <ListCard key={phase.phase_id}>
              <CardTitle>
                {phase.phase_name || `Phase ${index + 1}`}
                <DeleteIconButton
                  type="button"
                  aria-label={`Delete ${phase.phase_name || `Phase ${index + 1}`}`}
                  onClick={() => onRemovePhase(phase.phase_id)}
                >
                  ×
                </DeleteIconButton>
              </CardTitle>
              <DummyInput
                value={phase.phase_name ?? ""}
                placeholder={`Phase ${index + 1}`}
                onChange={e => onRenamePhase(phase.phase_id, e.target.value)}
              />
              <AutoGrowBigInput
                value={phase.phase_description ?? ""}
                placeholder={`Enter phase description....`}
                onChange={e =>
                  onUpdatePhaseDescription(phase.phase_id, e.target.value)
                }
              />
            </ListCard>
          ))}
          <SmallButton
            onClick={e => {
              e.preventDefault();
              onAddPhase();
            }}
          >
            + Add Phase
          </SmallButton>
        </div>
      )}

      {activeTab === "roles" && (
        <div>
          {roles.map((role, index) => (
            <ListCard key={role.role_id as string}>
              <CardTitle>
                {role.role_name || `Role ${index + 1}`}

                <DeleteIconButton
                  type="button"
                  aria-label={`Delete ${role.role_name || `Role ${index + 1}`}`}
                  onClick={() => onRemoveRole(role.role_id)}
                >
                  ×
                </DeleteIconButton>
              </CardTitle>
              <DummyInput
                value={role.role_name ?? ""}
                placeholder={`Role ${index + 1}`}
                onChange={e =>
                  onRenameRole(role.role_id as UUID, e.target.value)
                }
              />
              <AutoGrowBigInput
                value={role.role_description ?? ""}
                placeholder="Role description..."
                onChange={e =>
                  onUpdateRoleDescription(role.role_id as UUID, e.target.value)
                }
              />
            </ListCard>
          ))}
          <SmallButton
            onClick={e => {
              e.preventDefault();
              onAddRole();
            }}
          >
            + Add Role
          </SmallButton>
        </div>
      )}
    </FormStack>
  );
}
