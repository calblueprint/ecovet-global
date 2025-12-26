import { UUID } from "crypto";
import { roleFormInput, RolePhase } from "@/types/schema";

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
    <div>
      <fieldset>
        <legend>Role Description</legend>
        <input
          type="text"
          name="role_description"
          placeholder="Role Description"
          value={value.role.role_description ?? ""}
          onChange={e =>
            onChange(value.role.role_id, "role_description", e.target.value)
          }
        />
      </fieldset>
      {rolePhases.map((rolePhase, i) => (
        <fieldset key={rolePhase.role_phase_id}>
          <legend>
            Phase {value.phasesById[rolePhase.phase_id]?.phase_number ?? i + 1}
          </legend>
          <div style={{ display: "flex" }}>
            <div>
              <input
                type="text"
                name="role_phase_description"
                placeholder="Phase Role Description"
                value={rolePhase.description ?? ""}
                onChange={e =>
                  onChange(
                    rolePhase.role_phase_id,
                    "description",
                    e.target.value,
                  )
                }
              />
              <div
                key={"div" + rolePhase.role_phase_id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "25%",
                }}
              >
                {value.promptIndex[rolePhase.role_phase_id].map(promptID => (
                  <div key={"div" + promptID}>
                    <input
                      key={promptID}
                      type="text"
                      name="prompt"
                      placeholder="prompt"
                      value={value.promptById[promptID].prompt_text ?? ""}
                      onChange={e =>
                        onChange(promptID, "prompt_text", e.target.value)
                      }
                    />
                    <button
                      onClick={() =>
                        onChange(
                          promptID,
                          "remove_prompt",
                          rolePhase.role_phase_id,
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  onChange(
                    rolePhase.role_phase_id,
                    "add_prompt",
                    rolePhase.role_phase_id,
                  )
                }
              >
                + New Prompt
              </button>
            </div>
            <button
              onClick={() =>
                onChange(rolePhase.phase_id, "remove_phase", rolePhase.phase_id)
              }
            >
              Remove Phase
            </button>
          </div>
        </fieldset>
      ))}
    </div>
  );
}
