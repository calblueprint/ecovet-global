import { UUID } from "crypto";
import { createTemplates, createPhases, createRoles, createRolePhases, createPrompts } from "../templates";
import { defaultTemplates, defaultPhases, defaultRoles } from "./dummyData";

export default async function insertTemplateFlow() {
    const template_id = await createTemplates(defaultTemplates[0].template_name, defaultTemplates[0].accessible_to_all, defaultTemplates[0].objective, defaultTemplates[0].summary, defaultTemplates[0].setting, defaultTemplates[0].current_activity);

    let phases: UUID[] = [];
    let roles: UUID[] = [];
    
    for (let phase of defaultPhases) {
        phases.push(await createPhases(phase.session_id, phase.phase_name, phase.is_finished, phase.phase_description));
    }

    for (let role of defaultRoles) {
        roles.push(await createRoles(role.role_name, template_id!, role.role_description));
    }

    createRolePhases()

    createPrompts()


    return
}