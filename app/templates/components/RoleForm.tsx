import { roleFormInput, RolePhase } from "@/types/schema";
import { UUID } from "crypto";

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
              placeholder="da descrition"
              value={value.role.role_description ?? ""}
              onChange={(e) => onChange(value.role.role_id, 'role_description', e.target.value)}
            />
        </fieldset>
        {rolePhases.map((rolePhase, i) => (
          <fieldset key={rolePhase.role_phase_id}>
            <legend>Phase {i + 1}</legend>
            <div style={{display: 'flex'}}>
              <div> 
                <input 
                  type="text" 
                  name="role_phase_description" 
                  placeholder="da descrition"
                  value={rolePhase.description ?? ""}
                  onChange={(e) => onChange(rolePhase.role_phase_id, 'description', e.target.value)}
                />
                <div key={'div' + rolePhase.role_phase_id} style={{ display: "flex", flexDirection: "column", width: '25%' }}>
                  {value.promptIndex[rolePhase.role_phase_id].map((promptID, i) => (
                    <div key={'div' + promptID}>
                      <input
                        key={promptID}
                        type="text" 
                        name="prompt" 
                        placeholder="da prompt"
                        value={value.promptById[promptID].prompt_text ?? ""}
                        onChange={(e) => onChange(promptID, 'prompt_text', e.target.value)}
                      />
                      <button onClick={() => onChange(promptID, 'remove_prompt', rolePhase.role_phase_id)}>- Remove</button>
                    </div>
                ))}
                </div>
                <button onClick={() => onChange(rolePhase.role_phase_id, 'add_prompt', rolePhase.role_phase_id)}>+ New Prompt</button>
              </div>
            <button onClick={() => onChange(rolePhase.phase_id, 'remove_phase', rolePhase.phase_id)}>Trash</button>
            </div>
          </fieldset>
        ))}
    </div>
  );
}