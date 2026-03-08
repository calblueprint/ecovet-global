import { UUID } from "crypto";
import COLORS from "@/styles/colors";
import { B2, H3 } from "@/styles/text";
import { Phase, roleFormInput, RolePhase } from "@/types/schema";
import {
  BigInput,
  FieldCard,
  FieldLegend,
  FormStack,
  GhostButton,
  PhaseCard,
  QuestionCard,
  RemoveQuestionButton,
  RoleHeader,
  RoleHeaderContainer,
  RolePhaseDescriptionInput,
} from "./styles";

export default function RoleForm({
  value,
  rolePhaseId,
  phase,
  onChange,
}: {
  value: roleFormInput;
  rolePhaseId: UUID;
  phase: Phase;
  onChange: (id: UUID, field: string, v: string) => void;
}) {
  const rolePhase = value.rolePhases[rolePhaseId];

  return (
    <FormStack>
      <RoleHeaderContainer>
        <RoleHeader>
          <H3 $color={COLORS.black100} $fontWeight="700">
            {phase.phase_name}
          </H3>
          <B2 $color={COLORS.black70}>{value.role.role_name}</B2>
        </RoleHeader>

        <B2 $color={COLORS.black40}>
          <RolePhaseDescriptionInput
            placeholder="Enter phase description here..."
            value={rolePhase.description ?? ""}
            onChange={e => onChange(rolePhaseId, "description", e.target.value)}
          ></RolePhaseDescriptionInput>
        </B2>
      </RoleHeaderContainer>

      {/* TODO: change to phase description */}
      <FieldCard>
        <FieldLegend>Role description</FieldLegend>

        <BigInput
          name="role_description"
          placeholder="Role description"
          value={value.role.role_description ?? ""}
          onChange={e =>
            onChange(value.role.role_id, "role_description", e.target.value)
          }
        />
      </FieldCard>

      <PhaseCard key={rolePhase.role_phase_id}>
        {(value.promptIndex[rolePhase.role_phase_id] ?? []).map(
          (promptID, j) => (
            <QuestionCard key={promptID}>
              <FieldLegend>Question {j + 1}</FieldLegend>
              <BigInput
                name="prompt"
                placeholder="Type here..."
                value={value.promptById[promptID].prompt_text ?? ""}
                onChange={e =>
                  onChange(promptID, "prompt_text", e.target.value)
                }
              />
              <RemoveQuestionButton
                onClick={() =>
                  onChange(promptID, "remove_prompt", rolePhase.role_phase_id)
                }
              >
                Remove
              </RemoveQuestionButton>
            </QuestionCard>
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
