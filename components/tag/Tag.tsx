import { useState } from "react";
import Image from "next/image";
import { UUID } from "crypto";
import cross from "@/assets/images/DeleteTagCross.svg";
import COLORS from "@/styles/colors";
import { ColorDot, DeleteButton, StyledTag, StyledTagName } from "./styles";

type ColorKey = keyof typeof COLORS;

type TagComponentProps = {
  color: ColorKey;
  name: string;
  tag_id: UUID;
  sidebar: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onDelete?: (tag_id: UUID) => void;
  onRename?: (tag_id: UUID, newName: string) => void;
};

export function TagComponent({
  color,
  name,
  tag_id,
  sidebar,
  onClick,
  onDelete,
  onRename,
}: TagComponentProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);

  function handleRenameSubmit() {
    if (onRename && value.trim() !== "") {
      onRename(tag_id, value.trim());
    }
    setEditing(false);
  }

  return (
    <StyledTag
      onClick={sidebar ? onClick : undefined}
      onDoubleClick={() => sidebar && setEditing(true)}
    >
      <ColorDot $color={color} />

      {editing ? (
        <input
          autoFocus
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={handleRenameSubmit}
          onKeyDown={e => e.key === "Enter" && handleRenameSubmit()}
        />
      ) : (
        <StyledTagName>{name}</StyledTagName>
      )}

      {!sidebar && onDelete && (
        <DeleteButton onClick={() => onDelete(tag_id)}>
          <Image alt="delete tag cross" src={cross} />
        </DeleteButton>
      )}
    </StyledTag>
  );
}
