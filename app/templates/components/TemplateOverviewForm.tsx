export default function TemplateOverviewForm() {
  return (
    <div>
        <fieldset>
            <legend>Summary</legend>
            <input type="text" name="template_summary" placeholder="da summary" />
        </fieldset>
        <fieldset>
            <legend>Setting</legend>
            <input type="text" name="template_setting" placeholder="da setting" />
        </fieldset>
        <fieldset>
            <legend>Current Activity</legend>
            <input type="text" name="template_activity" placeholder="da current activity" />
        </fieldset>
    </div>
  );
}