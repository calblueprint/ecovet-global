"use client";

import { useSearchParams } from "next/navigation";
import AddFacilitators from "../AddFacilitators";

export default function ClientWrapper() {
  const searchParams = useSearchParams();
  const userGroupId = searchParams.get("userGroupId");

  if (!userGroupId) return null;

  return <AddFacilitators userGroupId={userGroupId} />;
}
