import { roleFormInput, RolePhase } from "@/types/schema";

export default function RoleForm({
    value,
    onChange,
  }: {
    value: roleFormInput;
    onChange: (v: string) => void;
  }) {
  
  const rolePhases: RolePhase[] = [];
  for (const [, rolePhaseID] of Object.entries(value.rolePhaseIndex)) {
    rolePhases.push(value.rolePhases[rolePhaseID]);
  }

  // changed function (what value was changed, and what 
  // was the change; i.e. description and "my description")
  return (
    <div>
        <fieldset>
            <legend>Role Description</legend>
            <input 
              type="text" 
              name="role_description" 
              placeholder="da descrition"
              value={value.role.role_description ?? ""}
              onChange={(e) => onChange(e.target.value)}
            />
        </fieldset>
        {rolePhases.map((rolePhase, i) => (
          <fieldset key={rolePhase.role_phase_id}>
            <legend>Phase {i + 1}</legend>
            <p>Prompt 1</p>
            <p>Prompt 2</p>
          </fieldset>
        ))}
    </div>
  );
}