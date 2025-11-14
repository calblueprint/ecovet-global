import { StyledTag, StyledTagName, ColorDot, DeleteButton } from "./styles";
import COLORS from "@/styles/colors";

type ColorKey = keyof typeof COLORS;

type TagProps = {
  color: ColorKey;
  name: string;
};

export function Tag({ color, name }: TagProps) {
    function deleteTag () {

    }

    return (
        <StyledTag>
            <ColorDot $color={color} />
            <StyledTagName>{name}</StyledTagName>
            <DeleteButton onClick={deleteTag}>×</DeleteButton>
        </StyledTag>
    );
}
