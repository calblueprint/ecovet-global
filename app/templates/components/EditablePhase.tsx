import COLORS from "@/styles/colors";
import { Caption } from "@/styles/text";
import { PhaseEntry } from "./styles";

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
    <PhaseEntry>
      <Caption $color={COLORS.black70} $fontWeight={400}>
        {index + 1}
      </Caption>
      <Caption
        $color={COLORS.black70}
        $fontWeight={400}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const value = e.currentTarget.textContent?.trim();
          onUpdate(value && value.length > 0 ? value : `Phase ${index + 1}`);
        }}
      >
        {name}
      </Caption>
    </PhaseEntry>
  );
}
