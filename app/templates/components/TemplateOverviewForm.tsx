import { Template } from "@/types/schema";
import { BigInput, FieldCard, FieldLegend, FormStack } from "./styles";

export default function TemplateOverviewForm({
  value,
  onChange,
}: {
  value: Template;
  onChange: (id: number, field: string, val: string) => void;
}) {
  return (
    <FormStack>
      <FieldCard>
        <FieldLegend>Summary</FieldLegend>
        <BigInput
          name="template_summary"
          placeholder="Summary"
          value={value.summary ?? ""}
          onChange={e => onChange(1, "summary", e.target.value)}
        />
      </FieldCard>

      <FieldCard>
        <FieldLegend>Setting</FieldLegend>
        <BigInput
          name="template_setting"
          placeholder="Setting"
          value={value.setting ?? ""}
          onChange={e => onChange(1, "setting", e.target.value)}
        />
      </FieldCard>

      <FieldCard>
        <FieldLegend>Current Activity</FieldLegend>
        <BigInput
          name="template_activity"
          placeholder="Current activity"
          value={value.current_activity ?? ""}
          onChange={e => onChange(1, "current_activity", e.target.value)}
        />
      </FieldCard>
    </FormStack>
  );
}
