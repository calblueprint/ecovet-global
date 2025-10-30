import { Template } from "@/types/schema";

export default function TemplteOverviewForm({
    value,
    onChange,
  }: {
    value: Template;
    onChange: (field: string, val: string) => void;
  }) {
  return (
    <div>
        <fieldset>
            <legend>Summary</legend>
            <input 
              type="text" 
              name="template_summary" 
              placeholder="da summary"
              value={value.summary ?? ""}
              onChange={(e) => onChange('summary', e.target.value)}
            />
        </fieldset>
        <fieldset>
            <legend>Setting</legend>
            <input 
              type="text" 
              name="template_setting" 
              placeholder="da setting"
              value={value.setting ?? ""}
              onChange={(e) => onChange('setting', e.target.value)}
            />
        </fieldset>
        <fieldset>
            <legend>Current Activity</legend>
            <input 
              type="text" 
              name="template_activity" 
              placeholder="da current activity"
              value={value.current_activity ?? ""}
              onChange={(e) => onChange('current_activity', e.target.value)}
            />
        </fieldset>
    </div>
  );
}