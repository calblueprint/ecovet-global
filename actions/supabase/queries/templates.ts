"use server";

import type { Template, UUID } from "@/types/schema";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  PhaseUpdatable,
  PromptUpdatable,
  RolePhaseUpdatable,
  RoleUpdatable,
  Tag,
  TemplateUpdatable,
} from "@/types/schema";
import { replacePromptOptions } from "./prompt";

export async function createTemplates( // create templates with inputs, but lowk most can be null as well
  templateID: UUID,
  template_name: string | null = null,
  accessible_to_all: boolean | null = null,
  summary: string | null = null,
  setting: string | null = null,
  current_activity: string | null = null,
  user_group_id: UUID | null = null,
): Promise<UUID> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("template")
    .upsert(
      {
        template_id: templateID,
        template_name: template_name,
        accessible_to_all: accessible_to_all,
        user_group_id: user_group_id,
        summary: summary,
        setting: setting,
        current_activity: current_activity,
      },
      { onConflict: "template_id" },
    )
    .select("template_id")
    .single();

  if (error) throw error;
  return data.template_id;
}

export async function updateTemplates( // NOTE: not using anymore but didn't want to remove in case needed in future
  template_id: UUID,
  updates: Partial<TemplateUpdatable>,
): Promise<void> {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("template")
    .update(updates)
    .eq("template_id", template_id);

  if (error) throw error;
}

export async function deleteTemplates(template_id: UUID): Promise<void> {
  // NOTE: not using anymore but didn't want to remove in case needed in future
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("template")
    .delete()
    .eq("template_id", template_id);

  if (error) throw error;
}

export async function createPhases(
  phase_id: UUID,
  template_id: UUID | null,
  phase_name: string | null,
  phase_description: string | null = null,
  phase_number: number,
): Promise<UUID> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("phase")
    .upsert(
      {
        phase_id: phase_id,
        template_id: template_id,
        phase_name: phase_name,
        phase_description: phase_description,
        phase_number,
      },
      { onConflict: "phase_id" },
    )
    .select("phase_id")
    .single();

  if (error) throw error;
  return data.phase_id;
}

export async function updatePhases( // NOTE: not using anymore but didn't want to remove in case needed in future
  phase_id: UUID,
  updates: Partial<PhaseUpdatable>,
): Promise<void> {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("phase")
    .update(updates)
    .eq("phase_id", phase_id);

  if (error) throw error;
}

export async function deletePhases(phase_id: UUID): Promise<void> {
  // NOTE: not using anymore but didn't want to remove in case needed in future
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("phase")
    .delete()
    .eq("phase_id", phase_id);

  if (error) throw error;
}

export async function createRoles(
  role_id: UUID,
  template_id: UUID,
  role_name: string | null = null,
  role_description: string | null = null,
): Promise<UUID> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("role")
    .upsert(
      {
        role_id: role_id,
        role_name: role_name,
        role_description: role_description,
        template_id: template_id,
      },
      { onConflict: "role_id" },
    )
    .select("role_id")
    .single();

  if (error) throw error;
  return data.role_id;
}

export async function updateRoles( // NOTE: not using anymore but didn't want to remove in case needed in future
  role_id: UUID,
  updates: Partial<RoleUpdatable>,
): Promise<void> {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("role")
    .update(updates)
    .eq("role_id", role_id);

  if (error) throw error;
}

export async function deleteRoles(role_id: UUID): Promise<void> {
  // NOTE: not using anymore but didn't want to remove in case needed in future
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("role").delete().eq("role_id", role_id);

  if (error) throw error;
}

export async function createRolePhases(
  role_phase_id: UUID,
  phase_id: UUID,
  role_id: UUID,
  description: string | null,
): Promise<UUID> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("role_phase")
    .upsert(
      {
        role_phase_id: role_phase_id,
        phase_id: phase_id,
        role_id: role_id,
        role_phase_description: description,
      },
      { onConflict: "role_phase_id" },
    )
    .select("role_phase_id")
    .single();

  if (error) throw error;
  return data.role_phase_id;
}

export async function updateRolePhases( // NOTE: not using anymore but didn't want to remove in case needed in future
  role_phase_id: UUID,
  updates: Partial<RolePhaseUpdatable>,
): Promise<void> {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("role_phase")
    .update(updates)
    .eq("role_phase_id", role_phase_id);

  if (error) throw error;
}

export async function deleteRolePhase(role_phase_id: UUID): Promise<void> {
  // NOTE: not using anymore but didn't want to remove in case needed in future
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("role_phase")
    .delete()
    .eq("role_phase_id", role_phase_id);

  if (error) throw error;
}

export async function createPrompts(
  prompt_id: UUID,
  role_phase_id: UUID,
  prompt_text: string | null,
  prompt_follow_ups: string | null,
  prompt_type: "text" | "multiple_choice" | "checkbox" | null,
  prompt_number: number | null,
): Promise<UUID> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompt")
    .upsert(
      {
        prompt_id: prompt_id,
        role_phase_id: role_phase_id,
        prompt_text: prompt_text,
        prompt_follow_ups: prompt_follow_ups,
        prompt_type: prompt_type,
        prompt_number: prompt_number,
      },
      { onConflict: "prompt_id" },
    )
    .select("prompt_id")
    .single();

  if (error) throw error;
  return data.prompt_id;
}

export async function updatePrompts( // NOTE: not using anymore but didn't want to remove in case needed in future
  prompt_id: UUID,
  updates: Partial<PromptUpdatable>,
): Promise<void> {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("prompt")
    .update(updates)
    .eq("prompt_id", prompt_id);

  if (error) throw error;
}

export async function deletePrompts(prompt_id: UUID): Promise<void> {
  // NOTE: not using anymore but didn't want to remove in case needed in future
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("prompt")
    .delete()
    .eq("prompt_id", prompt_id);

  if (error) throw error;
}

export async function fetchTemplate(
  template_id: string,
): Promise<Template | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("template")
    .select("*")
    .eq("template_id", template_id)
    .single();
  if (error) {
    console.error("Error fetching template by template_id:", error);
    return null;
  }

  return data;
}

export async function fetchAllTemplates() {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.from("template").select("*");

    if (error) throw error;

    return data;
  } catch (error) {
    console.log("Error fetching templates from supabase API: ", error);
  }
}

export async function fetchTemplatesWithTags(user_group_id: UUID) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("template")
    .select(
      `
      *,
      template_tag (
        tag (
          tag_id,
          name,
          color,
          number,
          user_group_id
        )
      )
    `,
    )
    .or(`user_group_id.eq.${user_group_id},accessible_to_all.eq.true`);

  if (error) throw error;

  return data?.map(t => ({
    ...t,
    associated_tags: t.template_tag.map((tt: { tag: Tag }) => tt.tag),
  }));
}

export const fetchTemplatesExercise = async (userGroup: string) => {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("template")
    .select("*")
    .or(`user_group_id.eq.${userGroup},accessible_to_all.eq.true`);

  if (error) {
    console.error("Error fetching templates:", error);
    return [];
  }
  return data;
};

export async function fetchFullTemplate(template_id: string) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("template")
    .select(
      `
      *,
      roles:role(*),
      phases:phase(
        *,
        role_phases:role_phase(
          *,
          prompts:prompt!prompt_role_phase_id_fkey(
            *,
            options:prompt_option(*)
          )
        )
      )
    `,
    )
    .eq("template_id", template_id)
    .order("phase_number", { referencedTable: "phases" })
    .order("prompt_number", { referencedTable: "phases.role_phases.prompts" })
    .single();

  if (error) {
    console.error("Supabase Error fetching full template:", error);
    return null;
  }

  return data;
}

export async function copyTemplate(
  sourceTemplateId: UUID,
  newOwnerGroupId: UUID,
): Promise<UUID | null> {
  const data = await fetchFullTemplate(sourceTemplateId);
  if (!data) return null;

  const idMap = new Map<UUID, UUID>();
  const remap = (oldId: UUID): UUID => {
    let next = idMap.get(oldId);
    if (!next) {
      next = crypto.randomUUID() as UUID;
      idMap.set(oldId, next);
    }
    return next;
  };

  const newTemplateId = crypto.randomUUID() as UUID;

  data.roles?.forEach(r => remap(r.role_id));
  data.phases?.forEach(p => {
    remap(p.phase_id);
    p.role_phases?.forEach(rp => {
      remap(rp.role_phase_id);
      rp.prompts?.forEach(pr => remap(pr.prompt_id));
    });
  });

  await createTemplates(
    newTemplateId,
    `${data.template_name ?? "Untitled"} (COPY)`,
    false,
    data.summary ?? "",
    data.setting ?? "",
    data.current_activity ?? "",
    newOwnerGroupId,
  );

  for (const role of data.roles ?? []) {
    await createRoles(
      remap(role.role_id),
      newTemplateId,
      role.role_name,
      role.role_description,
    );
  }

  for (const phase of data.phases ?? []) {
    await createPhases(
      remap(phase.phase_id),
      newTemplateId,
      phase.phase_name,
      phase.phase_description,
      phase.phase_number,
    );
  }

  for (const phase of data.phases ?? []) {
    for (const rp of phase.role_phases ?? []) {
      await createRolePhases(
        remap(rp.role_phase_id),
        remap(phase.phase_id),
        remap(rp.role_id),
        rp.role_phase_description,
      );

      for (let i = 0; i < (rp.prompts ?? []).length; i++) {
        const prompt = rp.prompts![i];
        const newPromptId = remap(prompt.prompt_id);

        await createPrompts(
          newPromptId,
          remap(rp.role_phase_id),
          prompt.prompt_text,
          prompt.prompt_follow_ups,
          prompt.prompt_type,
          i + 1,
        );

        const options = (prompt.options ?? []).map(o => ({
          ...o,
        }));
        await replacePromptOptions(newPromptId, options ? [] : options);
      }
    }
  }

  return newTemplateId;
}
