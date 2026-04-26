import { SxProps, Theme } from "@mui/material";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const autocompletesx = (showBorder: boolean): SxProps<Theme> => ({
  width: "100%",

  "& .MuiAutocomplete-clearIndicator": {
    display: "none",
  },

  "& .MuiOutlinedInput-root": {
    borderRadius: "0.4rem",
    flexWrap: "wrap",
    paddingTop: "0 !important",
    padding: "0.1rem 0.5rem",
    gap: "0.25rem",
    backgroundColor: "transparent",
    minHeight: "2.25rem",
    alignItems: "center",

    "& fieldset": {
      border: showBorder ? `1px solid ${COLORS.oat_medium}` : "none",
    },
    "&:hover fieldset": {
      border: showBorder ? `1px solid ${COLORS.oat_medium}` : "none",
    },
    "&.Mui-focused fieldset": {
      border: showBorder ? `1px solid ${COLORS.oat_dark}` : "none",
      borderWidth: "0.0625rem",
    },
  },

  "& .MuiAutocomplete-inputRoot": {
    flexWrap: "wrap",
  },

  "& input::placeholder": {
    opacity: "0.2s",
    transition: "opacity 0.2s",
  },
  "&:focus-within input::placeholder": {
    opacity: 1,
    fontSize: "0.8125rem",
    color: `${COLORS.black40}`,
  },

  "& input": {
    fontSize: "0.8125rem",
    padding: "0.125rem 0.25rem !important",
    minWidth: "5rem",
    width: "auto",
  },

  "& .MuiAutocomplete-listbox": {
    maxHeight: "12.5rem",
    padding: "0.25rem 0",
    fontFamily: Sans.style.fontFamily,
    "& .MuiAutocomplete-option": {
      fontSize: "0.8125rem",
      fontFamily: Sans.style.fontFamily,
      padding: "0.375rem 0.75rem",
      color: "#374151",
      '&[aria-selected="true"]': { backgroundColor: `${COLORS.tagYellow}` },
      "&.Mui-focused": { backgroundColor: `${COLORS.tagYellow}` },
    },
  },

  "& .MuiChip-deleteIcon": {
    display: "none",
  },
  "&:focus-within .MuiChip-deleteIcon": {
    display: "flex",
  },

  "& .MuiAutocomplete-paper": {
    boxShadow: "none",
    border: "none",
  },

  "& .MuiAutocomplete-popper": {
    border: "none",
  },
});

export const chipSx: SxProps<Theme> = {
  clipPath: "inset(0)",
  backgroundColor: `${COLORS.tagYellow}`,
  fontWeight: 500,
  fontSize: "0.75rem",
  height: "1.5rem",
  maxWidth: "fit-content",
  "& .MuiChip-label": {
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
  },
  "& .MuiChip-deleteIcon": {
    color: `${COLORS.lightEletricBlue}`,
    fontSize: "0.875rem",
    margin: "0 0.25rem 0 -0.125rem",
    "&:hover": { color: `${COLORS.darkElectricBlue}` },
  },
};
