"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { ArrowBigDown } from "lucide-react";
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
  selectedTagIds: UUID[] | null;
  onTagClick: (id: UUID) => void;
  onTagRenamed: () => void;
}

export default function TemplateSideBar({
  filterMode,
  setFilterMode,
  onDeleteConfirmed,
  user_group_id,
  selectedTagIds,
  onTagClick,
  onTagRenamed,
}: TemplateSideBarProps) {
  const router = useRouter();

  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [resolveDelete, setResolveDelete] = useState<
    ((val: boolean) => void) | null
  >(null);
  const [tagToDelete, setTagToDelete] = useState<UUID | null>(null);

  const handleRequestDelete = async (id: UUID): Promise<boolean> => {
    setTagToDelete(id);
    setIsWarningOpen(true);
    return new Promise(resolve => {
      setResolveDelete(() => (val: boolean) => resolve(val));
    });
  };

  const handleModalClose = (shouldDel: boolean) => {
    if (shouldDel && tagToDelete && onDeleteConfirmed) {
      onDeleteConfirmed(tagToDelete);
    }

    if (resolveDelete) {
      resolveDelete(shouldDel);
    }

    setIsWarningOpen(false);
    setTagToDelete(null);
    setResolveDelete(null);
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

      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowBigDown />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <p> Manage Tags </p>
        </AccordionSummary>
        <AccordionDetails>
          <TagCreator
            user_group_id={user_group_id} // Ensure this is passed
            selectedTagIds={selectedTagIds} // Ensure this is passed
            onTagClick={onTagClick}
            onTagRenamed={onTagRenamed}
            onDeleteTag={handleRequestDelete}
          />
        </AccordionDetails>
      </Accordion>

      <WarningModal open={isWarningOpen} onClose={handleModalClose} />
    </div>
  );
}
