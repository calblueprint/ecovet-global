"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Dropdown from "@/assets/images/dropdown.svg";
import Plus from "@/assets/images/plus.svg";
import { TagCreator } from "@/components/Tag/TagCreator";
import WarningModal, {
  WarningAction,
} from "@/components/WarningModal/WarningModal";
import { UUID } from "@/types/schema";
import {
  ManageCaption,
  SideNavButton,
  SideNavContainer,
  SideNavNewTemplateButton,
  SideNavTemplatesContainer,
  StyledAccordion,
  TagsCaption,
} from "./styles";

interface TemplateSideBarProps {
  filterMode: "All" | "Your" | "Browse";
  setFilterMode: (val: "All" | "Your" | "Browse") => void;
  onDeleteConfirmed?: (tagId: UUID) => void;
  user_group_id: UUID;
  selectedTagIds: UUID[] | null;
  onTagRenamed: () => void;
}

export default function TemplateSideBar({
  filterMode,
  setFilterMode,
  onDeleteConfirmed,
  user_group_id,
  selectedTagIds,
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

  const handleModalClose = (action: WarningAction) => {
    if (action === "confirm" && tagToDelete && onDeleteConfirmed) {
      onDeleteConfirmed(tagToDelete);
    }

    if (resolveDelete) {
      resolveDelete(action === "confirm");
    }

    setIsWarningOpen(false);
    setTagToDelete(null);
    setResolveDelete(null);
  };

  return (
    <SideNavContainer>
      <SideNavNewTemplateButton onClick={() => router.push("/templates")}>
        <Image src={Plus} alt="+" width={10} height={10} /> New Template
      </SideNavNewTemplateButton>

      <SideNavTemplatesContainer>
        <SideNavButton
          selected={filterMode === "All"}
          onClick={() => setFilterMode("All")}
        >
          All Templates
        </SideNavButton>
        <SideNavButton
          selected={filterMode === "Your"}
          onClick={() => setFilterMode("Your")}
        >
          Your Templates
        </SideNavButton>
        <SideNavButton
          selected={filterMode === "Browse"}
          onClick={() => setFilterMode("Browse")}
        >
          Browse Templates
        </SideNavButton>

        <StyledAccordion>
          <AccordionSummary
            expandIcon={<Image src={Dropdown} alt="^" width={10} height={10} />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <ManageCaption>Manage Tags</ManageCaption>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <TagCreator
              user_group_id={user_group_id}
              selectedTagIds={selectedTagIds}
              onTagRenamed={onTagRenamed}
              onDeleteTag={handleRequestDelete}
            />
          </AccordionDetails>
        </StyledAccordion>

        <WarningModal open={isWarningOpen} onClose={handleModalClose} />
      </SideNavTemplatesContainer>
    </SideNavContainer>
  );
}
