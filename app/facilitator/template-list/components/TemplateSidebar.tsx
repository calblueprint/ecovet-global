"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Plus from "@/assets/images/plus.svg";
import { TagCreator } from "@/components/Tag/TagCreator";
import WarningModal from "@/components/WarningModal/WarningModal";
import { UUID } from "@/types/schema";
import {
  SideNavButton,
  SideNavNewTemplateButton,
  SideNavTemplatesContainer,
} from "../../styles";

interface TemplateSideBarProps {
  filterMode: "all" | "your" | "browse";
  setFilterMode: (val: "all" | "your" | "browse") => void;
  onDeleteConfirmed?: (tagId: UUID) => void;
  user_group_id: UUID;
  selectedTagId: UUID | null;
  onTagClick: (id: UUID) => void;
  onTagRenamed: () => void;
}

export default function TemplateSideBar({
  filterMode,
  setFilterMode,
  onDeleteConfirmed,
  user_group_id,
  selectedTagId,
  onTagClick,
  onTagRenamed,
}: TemplateSideBarProps) {
  const router = useRouter();

  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<UUID | null>(null);

  const handleRequestDelete = async (id: UUID): Promise<boolean> => {
    setTagToDelete(id);
    setIsWarningOpen(true);
    return true;
  };

  const handleModalClose = (shouldDel: boolean) => {
    if (shouldDel && tagToDelete && onDeleteConfirmed) {
      onDeleteConfirmed(tagToDelete);
    }
    setIsWarningOpen(false);
    setTagToDelete(null);
  };

  return (
    <div>
      <SideNavNewTemplateButton onClick={() => router.push("/templates")}>
        <Image src={Plus} alt="+" width={10} height={10} /> New Template
      </SideNavNewTemplateButton>

      <SideNavTemplatesContainer>
        <SideNavButton
          selected={filterMode === "all"}
          onClick={() => setFilterMode("all")}
        >
          All Templates
        </SideNavButton>
        <SideNavButton
          selected={filterMode === "your"}
          onClick={() => setFilterMode("your")}
        >
          Your Templates
        </SideNavButton>
        <SideNavButton
          selected={filterMode === "browse"}
          onClick={() => setFilterMode("browse")}
        >
          Browse Templates
        </SideNavButton>
      </SideNavTemplatesContainer>

      <TagCreator
        user_group_id={user_group_id} // Ensure this is passed
        selectedTagId={selectedTagId} // Ensure this is passed
        onTagClick={onTagClick}
        onTagRenamed={onTagRenamed}
        onDeleteTag={handleRequestDelete}
      />

      <WarningModal open={isWarningOpen} onClose={handleModalClose} />
    </div>
  );
}
