import type { UUID } from "crypto";

export interface UserGroup {
  id: UUID;
  user_group_name: string;
}
