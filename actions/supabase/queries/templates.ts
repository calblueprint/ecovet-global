"use server";

import type { PromptType, Template, UUID } from "@/types/schema";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Tag } from "@/types/schema";
import { savePromptOptions } from "./prompt";

export async function createTemplates( // create templates with inputs, but lowk most can be null as well
  templateID: UUID,
  template_name: string,
  accessible_to_all: boolean | null = null,
  summary: string | null = null,
  setting: string | null = null,
  current_activity: string | null = null,
  user_group_id: UUID,
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

export async function createPhases(
  phase_id: UUID,
  template_id: UUID,
  phase_name: string | null,
  phase_description: string | null = null,
  phase_number: number,
): Promise<UUID> {
  if (!phase_name) {
    phase_name = "Phase " + phase_number;
  }
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

export async function createRoles(
  role_id: UUID,
  template_id: UUID,
  role_name: string,
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

export async function createPrompts(
  prompt_id: UUID,
  role_phase_id: UUID,
  prompt_text: string | null,
  prompt_follow_ups: string | null,
  prompt_type: PromptType,
  prompt_number: number,
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
    .or(`user_group_id.eq.${userGroup},accessible_to_all.eq.true`)
    .eq("archived", false);

  if (error) {
    console.error("Error fetching templates:", error);
    return [];
  }
  return data;
};

// archive or delete a template
// can only do if from the right user_group (or if admin)
// no data is deleted (for PDFs and sessions)
export async function setTemplateArchived(
  template_id: UUID,
  archived: boolean,
  requester_group_id: UUID,
  is_admin: boolean,
): Promise<boolean> {
  const supabase = await getSupabaseServerClient();

  const { data: tmpl, error: fetchErr } = await supabase
    .from("template")
    .select("user_group_id, accessible_to_all")
    .eq("template_id", template_id)
    .single();

  if (fetchErr || !tmpl) {
    console.error("Error loading template for archive:", fetchErr);
    return false;
  }

  const ownsTemplate = tmpl.user_group_id === requester_group_id;
  const canArchive =
    ownsTemplate || (is_admin && Boolean(tmpl.accessible_to_all));

  if (!canArchive) {
    console.error("Not authorized to archive template:", template_id);
    return false;
  }

  const { error } = await supabase
    .from("template")
    .update({ archived })
    .eq("template_id", template_id);

  if (error) {
    console.error("Error archiving template:", error);
    return false;
  }

  return true;
}

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
    .eq("roles.archived", false)
    .eq("phases.archived", false)
    .eq("phases.role_phases.archived", false)
    .eq("phases.role_phases.prompts.archived", false)
    .eq("phases.role_phases.prompts.options.archived", false)
    .order("phase_number", { referencedTable: "phases" })
    .order("prompt_number", { referencedTable: "phases.role_phases.prompts" })
    .order("option_number", {
      referencedTable: "phases.role_phases.prompts.options",
      nullsFirst: false,
    })
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

        // New option IDs: reusing the originals would move them to the copy.
        await savePromptOptions(
          newPromptId,
          (prompt.options ?? []).map(o => ({
            option_id: crypto.randomUUID() as UUID,
            option_text: o.option_text ?? "",
          })),
        );
      }
    }
  }

  return newTemplateId;
}

// used for archiving vs deleting templates -
// only delete if no one has anwsered or played a session
type KeptTemplateIds = {
  roleIds: UUID[];
  phaseIds: UUID[];
  rolePhaseIds: UUID[];
  promptIds: UUID[];
};

async function must<T>(
  query: PromiseLike<{ data: T | null; error: unknown }>,
): Promise<T> {
  const { data, error } = await query;
  if (error) throw error;
  return data as T;
}

function notIn(ids: UUID[], keep: UUID[]): UUID[] {
  const keepSet = new Set(keep);
  return ids.filter(id => !keepSet.has(id));
}

function splitByUse(ids: UUID[], usedIds: string[]) {
  const used = new Set(usedIds);
  return {
    inUse: ids.filter(id => used.has(id)),
    unused: ids.filter(id => !used.has(id)),
  };
}

export async function removeDeletedTemplateItems(
  template_id: UUID,
  kept: KeptTemplateIds,
): Promise<void> {
  const supabase = await getSupabaseServerClient();

  const [phaseRows, roleRows] = await Promise.all([
    must(
      supabase
        .from("phase")
        .select("phase_id")
        .eq("template_id", template_id)
        .eq("archived", false),
    ),
    must(
      supabase
        .from("role")
        .select("role_id")
        .eq("template_id", template_id)
        .eq("archived", false),
    ),
  ]);
  const phaseIds = phaseRows.map(p => p.phase_id);
  const roleIds = roleRows.map(r => r.role_id);

  const rolePhaseRows = phaseIds.length
    ? await must(
        supabase
          .from("role_phase")
          .select("role_phase_id")
          .in("phase_id", phaseIds)
          .eq("archived", false),
      )
    : [];
  const rolePhaseIds = rolePhaseRows.map(rp => rp.role_phase_id);

  const promptRows = rolePhaseIds.length
    ? await must(
        supabase
          .from("prompt")
          .select("prompt_id")
          .in("role_phase_id", rolePhaseIds)
          .eq("archived", false),
      )
    : [];

  // Prompts: in use if anyone has answered them.
  const removedPrompts = notIn(
    promptRows.map(p => p.prompt_id),
    kept.promptIds,
  );
  if (removedPrompts.length) {
    const answered = await must(
      supabase
        .from("prompt_response")
        .select("prompt_id")
        .in("prompt_id", removedPrompts),
    );
    const { inUse, unused } = splitByUse(
      removedPrompts,
      answered.map(r => r.prompt_id),
    );
    if (inUse.length) {
      await must(
        supabase
          .from("prompt")
          .update({ archived: true })
          .in("prompt_id", inUse),
      );
    }
    if (unused.length) {
      await must(
        supabase.from("prompt_option").delete().in("prompt_id", unused),
      );
      await must(supabase.from("prompt").delete().in("prompt_id", unused));
    }
  }

  // Role phases: in use if they have answers or still hold (archived) prompts.
  const removedRolePhases = notIn(rolePhaseIds, kept.rolePhaseIds);
  if (removedRolePhases.length) {
    const [answered, remainingPrompts] = await Promise.all([
      must(
        supabase
          .from("prompt_response")
          .select("role_phase_id")
          .in("role_phase_id", removedRolePhases),
      ),
      must(
        supabase
          .from("prompt")
          .select("role_phase_id")
          .in("role_phase_id", removedRolePhases),
      ),
    ]);
    const { inUse, unused } = splitByUse(removedRolePhases, [
      ...answered.map(r => r.role_phase_id),
      ...remainingPrompts.map(p => p.role_phase_id),
    ]);
    if (inUse.length) {
      await must(
        supabase
          .from("role_phase")
          .update({ archived: true })
          .in("role_phase_id", inUse),
      );
    }
    if (unused.length) {
      await must(
        supabase.from("role_phase").delete().in("role_phase_id", unused),
      );
    }
  }

  // Phases: in use if they still hold (archived) role phases.
  const removedPhases = notIn(phaseIds, kept.phaseIds);
  if (removedPhases.length) {
    const remaining = await must(
      supabase
        .from("role_phase")
        .select("phase_id")
        .in("phase_id", removedPhases),
    );
    const { inUse, unused } = splitByUse(
      removedPhases,
      remaining.map(rp => rp.phase_id),
    );
    if (inUse.length) {
      await must(
        supabase.from("phase").update({ archived: true }).in("phase_id", inUse),
      );
    }
    if (unused.length) {
      await must(supabase.from("phase").delete().in("phase_id", unused));
    }
  }

  // Roles: in use if a participant was assigned them or they still hold (archived) role phases.
  const removedRoles = notIn(roleIds, kept.roleIds);
  if (removedRoles.length) {
    const [assigned, remaining] = await Promise.all([
      must(
        supabase
          .from("participant_session")
          .select("role_id")
          .in("role_id", removedRoles),
      ),
      must(
        supabase
          .from("role_phase")
          .select("role_id")
          .in("role_id", removedRoles),
      ),
    ]);
    const { inUse, unused } = splitByUse(removedRoles, [
      ...assigned.map(p => p.role_id).filter((id): id is UUID => Boolean(id)),
      ...remaining.map(rp => rp.role_id),
    ]);
    if (inUse.length) {
      await must(
        supabase.from("role").update({ archived: true }).in("role_id", inUse),
      );
    }
    if (unused.length) {
      await must(supabase.from("role").delete().in("role_id", unused));
    }
  }
}
