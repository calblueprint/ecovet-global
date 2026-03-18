// components/styles.ts
import { GroupBase, StylesConfig } from "react-select";
import COLORS from "@/styles/colors";
import { DropdownOption } from "@/types/dropdown";

export const selectStyles: StylesConfig<
  DropdownOption,
  boolean,
  GroupBase<DropdownOption>
> = {
  control: base => ({
    ...base,
    border: `1px solid ${COLORS.black}`,
  }),
  menu: base => ({
    ...base,
    border: `1px solid ${COLORS.black}`,
  }),
};
