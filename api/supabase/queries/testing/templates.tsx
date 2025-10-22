import { createTemplates, createPhases, createRoles, createRolePhases, createPrompts } from "../templates";
import { defaultTemplates, defaultRoles } from "./dummyData";

export default async function insertTemplateFlow() {
    let template_id = await createTemplates(defaultTemplates[0].template_name, defaultTemplates[0].accessible_to_all, defaultTemplates[0].objective, defaultTemplates[0].summary, defaultTemplates[0].setting, defaultTemplates[0].current_activity);
    
    for (let role of defaultRoles) {
        await createRoles(role.role_name, template_id!, role.role_description);
    }
    return
}