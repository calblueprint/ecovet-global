"use client";

import { useEffect, useState } from "react";
import {
  assignTagToTemplate,
  createTag,
  getAllTags,
  getTagsForTemplate,
  getTemplatesforTag,
  removeTagFromTemplate,
} from "@/actions/supabase/queries/tag";
import { fetchUserGroups } from "@/api/supabase/queries/user-groups";
import { UserGroup } from "@/types/schema";

const UserGroupsPage = () => {
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);

  useEffect(() => {
    async function runTests() {
      const results: string[] = [];

      const testTemplateId = "e470268b-6074-435c-b647-85a1c7fff244"; // Replace with actual UUID
      const user_group_id = "0b73ed2d-61c3-472e-b361-edaa88f27622";
      const testTagId = "517108e6-99a5-41bc-977e-799f192685c1";

      try {
        // Test creating a tag
        const tagId = await createTag("Test Tag Script", user_group_id, 1);
        console.log("Tag created:", tagId);
        console.log(`Created tag: ${tagId}`);

        // Test getting all tags
        const tags = await getAllTags(user_group_id);
        console.log("Tag fetched:", tags);
        console.log(`Found ${tags.length} tags`);

        // Test 3: Assign tag to template
        console.log("\n Assigning tag to template...");
        const assigned = await assignTagToTemplate(testTemplateId, tagId);
        console.log("Tag assigned:", assigned);

        // Test 4: Get tags for template
        console.log("\n Getting tags for template...");
        const templateTags = await getTagsForTemplate(testTemplateId);
        console.log("Template tags:", templateTags);

        // Test 5: Get templates for tag
        console.log("\nGetting templates for tag...");
        const tagTemplates = await getTemplatesforTag(testTagId);
        console.log("Tag templates:", tagTemplates);

        // Test 6: Remove tag from template
        console.log("\nRemoving tag from template...");
        const removed = await removeTagFromTemplate(testTemplateId, tagId);
        console.log("Tag removed:", removed);
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    }

    runTests();
  }, []);

  useEffect(() => {
    async function loadUserGroups() {
      const fetchedUserGrps = await fetchUserGroups();
      if (fetchedUserGrps) {
        setUserGroups(fetchedUserGrps);
      }
    }

    loadUserGroups();
  }, []);

  return (
    <div>
      <h1>User Groups</h1>
      {userGroups.map((usergrp, index) => (
        <div key={index}>{usergrp.user_group_name}</div>
      ))}
    </div>
  );
};

export default UserGroupsPage;
