import { UUID } from "crypto";
import { roleFormInput, RolePhase } from "@/types/schema";
import { BigInput, FieldCard, FieldLegend, FormStack, GhostButton, SectionH2 } from "./styles";
import { Flex } from "@/styles/containers";

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
          onChange={(e) =>
            onChange(value.role.role_id, "role_description", e.target.value)
          }
        />
      </FieldCard>

      {rolePhases.map((rolePhase, i) => (
        <div key={rolePhase.role_phase_id}>
          <SectionH2>Phase {i + 1}</SectionH2>

          <FieldCard>
            <FieldLegend>Description</FieldLegend>
            <BigInput
              name="role_phase_description"
              placeholder="da descrition"
              value={rolePhase.description ?? ""}
              onChange={(e) =>
                onChange(rolePhase.role_phase_id, "description", e.target.value)
              }
            />
          </FieldCard>

          {/* Prompts list */}
          {(value.promptIndex[rolePhase.role_phase_id] ?? []).map((promptID, j) => (
            <FieldCard key={promptID}>
              <FieldLegend>Question {j + 1}</FieldLegend>
              <BigInput
                name="prompt"
                placeholder="da prompt"
                value={value.promptById[promptID].prompt_text ?? ""}
                onChange={(e) =>
                  onChange(promptID, "prompt_text", e.target.value)
                }
              />
              <Flex $mt="10px">
                <GhostButton
                  onClick={() =>
                    onChange(promptID, "remove_prompt", rolePhase.role_phase_id)
                  }
                >
                  - Remove
                </GhostButton>
              </Flex>
            </FieldCard>
          ))}

          <GhostButton
            onClick={() =>
              onChange(rolePhase.role_phase_id, "add_prompt", rolePhase.role_phase_id)
            }
          >
            + New Prompt
          </GhostButton>

          <Flex $mt="12px">
            <GhostButton
              onClick={() =>
                onChange(rolePhase.phase_id, "remove_phase", rolePhase.phase_id)
              }
            >
              🗑️
            </GhostButton>
          </Flex>
        </div>
      ))}
    </FormStack>
  );
}
