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
};

export function TagComponent({
  color,
  name,
  tag_id,
  sidebar,
  onClick,
  onDelete,
}: TagComponentProps) {
  return (
    <StyledTag onClick={sidebar ? onClick : undefined}>
      <ColorDot $color={color} />
      <StyledTagName>{name}</StyledTagName>
      {!sidebar && onDelete && (
        <DeleteButton onClick={() => onDelete(tag_id)}>
          <Image alt="delete tag cross" src={cross} />
        </DeleteButton>
      )}
    </StyledTag>
  );
}
