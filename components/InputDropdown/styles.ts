// components/styles.ts
import { GroupBase, StylesConfig } from "react-select";
import COLORS from "@/styles/colors";
import { DropdownOption } from "@/types/dropdown";

export const getSelectStyles = (
  outlined: boolean = true,
): StylesConfig<DropdownOption, boolean, GroupBase<DropdownOption>> => ({
  control: base => ({
    ...base,
    border: outlined
      ? `1px solid ${COLORS.black}`
      : `1px solid ${COLORS.oat_medium}`,
    boxShadow: outlined ? base.boxShadow : "none",
  }),
  menu: base => ({
    ...base,
    border: `1px solid ${COLORS.black}`,
  }),
});

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
