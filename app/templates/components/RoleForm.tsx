import { roleFormInput } from "@/types/schema";

export default function RoleForm({
    value,
    onChange,
  }: {
    value: roleFormInput;
    onChange: (v: string) => void;
  }) {
  
  
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
    </div>
  );
}