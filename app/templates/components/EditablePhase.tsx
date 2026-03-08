import COLORS from "@/styles/colors";
import { Caption } from "@/styles/text";
import { PhaseCaption, PhaseEntry } from "./styles";

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
      <PhaseCaption>{index + 1}</PhaseCaption>
      <PhaseCaption
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const value = e.currentTarget.textContent?.trim();
          onUpdate(value && value.length > 0 ? value : `Phase ${index + 1}`);
        }}
      >
        {name}
      </PhaseCaption>
    </PhaseEntry>
  );
}
