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

export const tagSelectStyles: StylesConfig<
  DropdownOption,
  boolean,
  GroupBase<DropdownOption>
> = {
  control: base => ({
    ...base,
    border: "none",
    boxShadow: "none",
    backgroundColor: "transparent",
    minHeight: "0px",
    cursor: "text",
  }),
  indicatorsContainer: base => ({
    ...base,
    display: "none",
  }),

  dropdownIndicator: () => ({
    display: "none",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  menu: base => ({
    ...base,
    width: "200px",
    borderRadius: "8px",
    marginTop: "4px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    border: `1px solid ${COLORS.oat_medium}`,
    zIndex: 100,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? COLORS.oat_light : "transparent",
    color: COLORS.black,
    padding: "8px 12px",
    fontSize: "12px",
    cursor: "pointer",
    "&:active": {
      backgroundColor: COLORS.oat_medium,
    },
  }),
};
