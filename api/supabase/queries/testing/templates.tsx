import { UUID } from "crypto";
import { createTemplates, createPhases, createRoles, createRolePhases, createPrompts } from "../templates";
import { defaultTemplates, defaultPhases, defaultRoles, defaultRolePhases, defaultPrompts } from "./dummyData";

export default async function insertTemplateFlow(): Promise<void> {
    const template_id = await createTemplates(defaultTemplates[0].template_name, defaultTemplates[0].accessible_to_all, defaultTemplates[0].objective, defaultTemplates[0].summary, defaultTemplates[0].setting, defaultTemplates[0].current_activity);

    let phases: UUID[] = [];
    let roles: UUID[] = [];
    let rolePhases: UUID[] = [];
    let prompts: UUID[] = [];
    
    for (let phase of defaultPhases) {
        phases.push(await createPhases(phase.session_id, phase.phase_name, phase.is_finished, phase.phase_description));
    }

    for (let role of defaultRoles) {
        roles.push(await createRoles(role.role_name, template_id!, role.role_description));
    }

    for (let i=0; i++; i<phases.length) {
        for (let j=0; j++; j<roles.length) {
            rolePhases.push(await createRolePhases(phases[i], roles[j], defaultRolePhases[(i*2) + j].description));
        }
    }

    for (let i=0; i++; i<rolePhases.length) {
        prompts.push(await createPrompts(phases[Math.trunc(i/2)], rolePhases[i], defaultPrompts[i].prompt_text));
    }

    return;
}