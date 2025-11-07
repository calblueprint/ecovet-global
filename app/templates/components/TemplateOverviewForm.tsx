import { Template } from "@/types/schema";
import { BigInput, FieldCard, FieldLegend, FormStack } from "./styles";

export default function TemplteOverviewForm({
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
          placeholder="da summary"
          value={value.summary ?? ""}
          onChange={e => onChange(1, "summary", e.target.value)}
        />
      </FieldCard>

      <FieldCard>
        <FieldLegend>Setting</FieldLegend>
        <BigInput
          name="template_setting"
          placeholder="da setting"
          value={value.setting ?? ""}
          onChange={e => onChange(1, "setting", e.target.value)}
        />
      </FieldCard>

      <FieldCard>
        <FieldLegend>Current Activity</FieldLegend>
        <BigInput
          name="template_activity"
          placeholder="da current activity"
          value={value.current_activity ?? ""}
          onChange={e => onChange(1, "current_activity", e.target.value)}
        />
      </FieldCard>
    </FormStack>
  );
}
