import { EditablePhase, RoleFormInput, UUID } from "@/types/schema";
import {
  BigInput,
  FieldCard,
  FieldLegend,
  FormStack,
  GhostButton,
  PhaseCard,
  PhaseTemplateHeader,
  RoleDescriptionTemplate,
  RoleHeader,
  RoleHeaderContainer,
  RolePhaseDescriptionInput,
  RoleTemplateName,
} from "./styles";

export default function RoleForm({
  value,
  rolePhaseId,
  phase,
  onChange,
}: {
  value: RoleFormInput;
  rolePhaseId: UUID;
  phase: EditablePhase;
  onChange: (id: UUID, field: string, v: string) => void;
}) {
  const rolePhase = value.rolePhases[rolePhaseId];

  return (
    <FormStack>
      <RoleHeaderContainer>
        <RoleHeader>
          <PhaseTemplateHeader>{phase.phase_name}</PhaseTemplateHeader>
          <RoleTemplateName>{value.role.role_name}</RoleTemplateName>
        </RoleHeader>

        <RoleDescriptionTemplate>
          <RolePhaseDescriptionInput
            placeholder="Enter phase description here..."
            value={rolePhase.description ?? ""}
            onChange={e => onChange(rolePhaseId, "description", e.target.value)}
          ></RolePhaseDescriptionInput>
        </RoleDescriptionTemplate>
      </RoleHeaderContainer>

      <PhaseCard key={rolePhase.role_phase_id}>
        {(value.promptIndex[rolePhase.role_phase_id] ?? []).map(
          (promptID, j) => (
            <FieldCard key={promptID}>
              <FieldLegend>Question {j + 1}</FieldLegend>
              <BigInput
                name="prompt"
                placeholder="Type question..."
                value={value.promptById[promptID].prompt_text ?? ""}
                onChange={e =>
                  onChange(promptID, "prompt_text", e.target.value)
                }
              />
            </FieldCard>
          ),
        )}

        <GhostButton
          onClick={() =>
            onChange(
              rolePhase.role_phase_id,
              "add_prompt",
              rolePhase.role_phase_id,
            )
          }
        >
          + New Prompt
        </GhostButton>
      </PhaseCard>
    </FormStack>
  );
}
