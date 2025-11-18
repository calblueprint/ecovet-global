// //---------------------------------------------------------------------------------------------------------
// //---------------------------        THIS CODE IS OUTDATED; DONT USE       --------------------------------
// //---------------------------------------------------------------------------------------------------------

// import { UUID } from "crypto";
// import {
//   createPhases,
//   createPrompts,
//   createRolePhases,
//   createRoles,
//   createTemplates,
// } from "../templates";
// import {
//   defaultPhases,
//   defaultPrompts,
//   defaultRolePhases,
//   defaultRoles,
//   defaultTemplates,
// } from "./dummyData";

// export default async function insertTemplateFlow(): Promise<void> {
//   console.log("starting test");
//   const template_id = await createTemplates(
//     defaultTemplates[0].template_name,
//     defaultTemplates[0].accessible_to_all,
//     defaultTemplates[0].objective,
//     defaultTemplates[0].summary,
//     defaultTemplates[0].setting,
//     defaultTemplates[0].current_activity,
//   );
//   console.log("created template: ", template_id);

//   let phases: UUID[] = [];
//   let roles: UUID[] = [];
//   let rolePhases: UUID[] = [];
//   let prompts: UUID[] = [];

//   for (let phase of defaultPhases) {
//     phases.push(
//       await createPhases(
//         phase.session_id,
//         phase.phase_name,
//         phase.is_finished,
//         phase.phase_description,
//       ),
//     );
//     console.log("created phase");
//   }
//   console.log("created all phases: ", phases);

//   for (let role of defaultRoles) {
//     roles.push(
//       await createRoles(role.role_name, template_id!, role.role_description),
//     );
//     console.log("created role");
//   }
//   console.log("created all rolesL: ", roles);

//   for (let i = 0; i < phases.length; i++) {
//     for (let j = 0; j < roles.length; j++) {
//       rolePhases.push(
//         await createRolePhases(
//           phases[i],
//           roles[j],
//           defaultRolePhases[i * 2 + j].description,
//         ),
//       );
//       console.log("created rolephase");
//     }
//   }
//   console.log("created all rolephases: ", rolePhases);

//   for (let i = 0; i < rolePhases.length; i++) {
//     prompts.push(
//       await createPrompts(null, rolePhases[i], defaultPrompts[i].prompt_text),
//     );
//     console.log("created prompt");
//   }
//   console.log("created all prompts: ", prompts);

//   return;
// }
