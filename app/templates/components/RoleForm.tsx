import { UUID } from "crypto";
import COLORS from "@/styles/colors";
import { B2, Caption, H3 } from "@/styles/text";
import { roleFormInput, RolePhase } from "@/types/schema";
import {
  BigInput,
  FieldCard,
  FieldLegend,
  FormStack,
  GhostButton,
  PhaseCard,
  PhaseHeader,
  QuestionCard,
  RemovePhaseButton,
  RemoveQuestionButton,
  RoleHeader,
  SectionH2,
} from "./styles";

export default function RoleForm({
  value,
  // rolePhaseId,
  onChange,
}: {
  value: roleFormInput;
  // rolePhaseId: UUID;
  onChange: (id: UUID, field: string, v: string) => void;
}) {
  const rolePhases: RolePhase[] = [];
  for (const [, rolePhaseID] of Object.entries(value.rolePhaseIndex)) {
    rolePhases.push(value.rolePhases[rolePhaseID]);
  }

  return (
    <FormStack>
      <RoleHeader>
        <H3 $color={COLORS.black100} $fontWeight="700">
          Phase 1
        </H3>
        <B2 $color={COLORS.black70}>{value.role.role_name}</B2>
      </RoleHeader>

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

      {rolePhases.map((rolePhase, i) => (
        <PhaseCard key={rolePhase.role_phase_id}>
          <PhaseHeader>
            <SectionH2>
              Phase{" "}
              {value.phasesById[rolePhase.phase_id]?.phase_number ?? i + 1}
            </SectionH2>
            <RemovePhaseButton
              onClick={() =>
                onChange(rolePhase.phase_id, "remove_phase", rolePhase.phase_id)
              }
            >
              🗑️
            </RemovePhaseButton>
          </PhaseHeader>

          <FieldCard>
            <FieldLegend>Description</FieldLegend>
            <BigInput
              name="role_phase_description"
              placeholder="Type here..."
              value={rolePhase.description ?? ""}
              onChange={e =>
                onChange(rolePhase.role_phase_id, "description", e.target.value)
              }
            />
          </FieldCard>

          {/* Prompts list */}
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
      ))}
    </FormStack>
  );
}
