import { roleFormInput, RolePhase } from "@/types/schema";

export default function RoleForm({
    value,
    onChange,
  }: {
    value: roleFormInput;
    onChange: (field: string, v: string) => void;
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
              onChange={(e) => onChange('role_description', e.target.value)}
            />
        </fieldset>
        {rolePhases.map((rolePhase, i) => (
          <fieldset key={rolePhase.role_phase_id}>
            <legend>Phase {i + 1}</legend>
            
            <div key={'div' + rolePhase.role_phase_id} style={{ display: "flex", flexDirection: "column", width: '25%' }}>
              {value.promptIndex[rolePhase.role_phase_id].map((promptID, i) => (
                <div key={'div' + promptID}>
                  <input
                    key={promptID}
                    type="text" 
                    name="prompt" 
                    placeholder="da prompt"
                    value={value.promptById[promptID].prompt_text ?? ""}
                    onChange={(e) => onChange(promptID, e.target.value)}
                  />
                  <button onClick={(e) => onChange('remove_prompt', promptID)}>- Remove</button>
                </div>
            ))}
            </div>

            <button onClick={(e) => onChange('add_prompt', rolePhase.role_phase_id)}>+ New Prompt</button>
          </fieldset>
        ))}
    </div>
  );
}