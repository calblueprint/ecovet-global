import { Template } from "@/types/schema";

export default function TemplateOverviewForm({
  value,
  onChange,
}: {
  value: Template;
  onChange: (id: number, field: string, val: string) => void;
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
          onChange={e => onChange(1, "summary", e.target.value)}
        />
      </fieldset>
      <fieldset>
        <legend>Setting</legend>
        <input
          type="text"
          name="template_setting"
          placeholder="da setting"
          value={value.setting ?? ""}
          onChange={e => onChange(1, "setting", e.target.value)}
        />
      </fieldset>
      <fieldset>
        <legend>Current Activity</legend>
        <input
          type="text"
          name="template_activity"
          placeholder="da current activity"
          value={value.current_activity ?? ""}
          onChange={e => onChange(1, "current_activity", e.target.value)}
        />
      </fieldset>
    </div>
  );
}
