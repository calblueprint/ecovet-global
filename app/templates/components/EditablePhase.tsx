import COLORS from "@/styles/colors";
import { Flex } from "@/styles/containers";
import { Caption } from "@/styles/text";
import { SideBarItem } from "./styles";

export default function EditablePhase({
  name,
  index,
  onUpdate,
}: {
  name: string;
  index: number;
  onUpdate: (newName: string) => void;
}) {
  return (
    <SideBarItem key={index}>
      <Flex $gap="8px" $direction="row">
        <Caption $color={COLORS.black70}>{index + 1}</Caption>
        <Caption
          contentEditable
          suppressContentEditableWarning
          onBlur={e => {
            const value = e.currentTarget.textContent?.trim();
            onUpdate(value && value.length > 0 ? value : `Phase ${index + 1}`);
          }}
        >
          {name}
        </Caption>
      </Flex>
    </SideBarItem>
  );
}
