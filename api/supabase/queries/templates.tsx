import { UUID } from "crypto"
import supabase from "../createClient"
import { TemplateUpdatable } from "@/types/schema";

export async function createTemplates(template_name: string|null=null, accessible_to_all: boolean|null=null, objective: string|null=null, summary: string|null=null, setting: string|null=null, current_activity: string|null=null, user_group_id: UUID|null=null): Promise<UUID> {
    const { data, error } = await supabase
    .from('template')
    .insert({ 
        template_name: template_name,
        accessible_to_all: accessible_to_all,
        user_group_id: user_group_id,
        objective: objective,
        summary: summary,
        setting: setting,
        current_activity: current_activity, })
    .select("template_id")
    .single();
    
    if (error) throw error;
    return data.template_id;
}

export async function updateTemplates(template_id: UUID, updates: Partial<TemplateUpdatable>): Promise<void> {
    const { error } = await supabase
    .from('template')
    .update(updates)
    .eq('template_id', template_id);

    if (error) throw error;
}

export async function deleteTemplates(template_id: UUID): Promise<void> {
    const { error } = await supabase
    .from('template')
    .delete()
    .eq('template_id', template_id);

    if (error) throw error;
}

export async function createPhases(session_id: UUID|null, phase_name: string, is_finished: boolean, 
    phase_description: string|null=null): Promise<UUID> {
    const { data, error } = await supabase
    .from('phase')
    .insert({ 
        session_id: session_id,
        phase_name: phase_name,
        phase_description: phase_description,
        is_finished: is_finished,
    })
    .select('phase_id')
    .single();

    if (error) throw error;
    return data.phase_id;
}

export async function createRoles(role_name: string, template_id: UUID|null, role_description: string|null=null): Promise<UUID> {
    const { data, error } = await supabase
    .from('role')
    .insert({ 
        role_name: role_name,
        role_description: role_description,
        template_id: template_id,
    })
    .select('role_id')
    .single();

    if (error) throw error;
    return data.role_id;

}

export async function createRolePhases(phase_id: UUID, role_id: UUID, description: string): Promise<UUID> {
    const { data, error } = await supabase
    .from('role_phase')
    .insert({ 
        phase_id: phase_id,
        role_id: role_id,
        description: description,
    })
    .select('role_phase_id')
    .single();
    
    if (error) throw error;
    return data.role_phase_id;
}

export async function createPrompts(user_id: UUID|null, role_phase_id: UUID, prompt_text: string): Promise<UUID> {
    const { data, error } = await supabase
    .from('prompt')
    .insert({ 
        user_id: user_id,
        role_phase_id: role_phase_id,
        prompt_text: prompt_text,
    })
    .select('prompt_id')
    .single();

    if (error) throw error;
    return data.prompt_id;
}