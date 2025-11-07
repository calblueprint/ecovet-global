import { UUID } from "crypto";
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
  SectionH2,
} from "./styles";

export default function RoleForm({
  value,
  onChange,
}: {
  value: roleFormInput;
  onChange: (id: UUID, field: string, v: string) => void;
}) {
  const rolePhases: RolePhase[] = [];
  for (const [, rolePhaseID] of Object.entries(value.rolePhaseIndex)) {
    rolePhases.push(value.rolePhases[rolePhaseID]);
  }

  return (
    <FormStack>
      <FieldCard>
        <FieldLegend>Role description</FieldLegend>
        <BigInput
          name="role_description"
          placeholder="da descrition"
          value={value.role.role_description ?? ""}
          onChange={e =>
            onChange(value.role.role_id, "role_description", e.target.value)
          }
        />
      </FieldCard>

      {rolePhases.map((rolePhase, i) => (
        <PhaseCard key={rolePhase.role_phase_id}>
          <PhaseHeader>
            <SectionH2>Phase {i + 1}</SectionH2>
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
              placeholder="da descrition"
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
                  placeholder="da prompt"
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
