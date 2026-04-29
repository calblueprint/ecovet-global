import { SetStateAction } from "react";
import { StylesConfig } from "react-select";
import COLORS from "@/styles/colors";
import { DropdownOption } from "@/types/schema";
import { AnnouncementRoom } from "@/utils/UseAnnouncements";
import InputDropdown from "../InputDropdown/InputDropdown";
import { SelectUsersContainer } from "./styles";

export default function AnnouncementSelector({
  options,
  selectedRoom,
  setSelectedRoom,
}: {
  options: [AnnouncementRoom, string][];
  selectedRoom: AnnouncementRoom;
  setSelectedRoom: React.Dispatch<SetStateAction<AnnouncementRoom>>;
}) {
  const stringifiedOptions = new Map(
    options.map(([room, label]) => [JSON.stringify(room), label]),
  );

  return (
    <SelectUsersContainer>
      <InputDropdown
        label={`Participant user`}
        options={stringifiedOptions}
        placeholder="Add person"
        value={JSON.stringify(selectedRoom)}
        onChange={announcementRoomString => {
          if (!announcementRoomString) return;
          const room = JSON.parse(announcementRoomString);
          setSelectedRoom(room);
        }}
        customStyles={dropdownStyles}
      />
    </SelectUsersContainer>
  );
}

const captionStyles = {
  color: COLORS.black40,
  fontFamily: '"Public Sans", sans-serif',
  fontSize: "0.75rem",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal",
  letterSpacing: "0.015rem",
};

const dropdownStyles: StylesConfig<DropdownOption, boolean> = {
  container: base => ({
    ...base,
    width: "100%",
  }),
  control: base => ({
    ...base,
    ...captionStyles,
    width: "100%",
  }),
  placeholder: base => ({
    ...base,
    ...captionStyles,
    width: "100%",
  }),
  singleValue: base => ({
    ...base,
    ...captionStyles,
    width: "100%",
  }),
  option: base => ({
    ...base,
    ...captionStyles,
    width: "100%",
  }),
  multiValueLabel: base => ({
    ...base,
    ...captionStyles,
    width: "100%",
  }),
};
