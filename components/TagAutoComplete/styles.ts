import { SxProps, Theme } from "@mui/material/styles";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const autocompletesx = (showBorder: boolean): SxProps<Theme> => ({
  width: "100%",
  fontFamily: Sans.style.fontFamily,

  "& .MuiOutlinedInput-root": {
    fontFamily: Sans.style.fontFamily,
    fontSize: "12px",
    backgroundColor: showBorder ? COLORS.white : "transparent",
    borderRadius: showBorder ? "0.5rem" : 0,
    padding: showBorder ? "0.25rem 0.5rem" : 0,
    minHeight: showBorder ? "2.28rem" : "auto",

    "& fieldset": {
      border: showBorder ? `1px solid ${COLORS.oat_medium}` : "none",
    },
    "&:hover fieldset": {
      border: showBorder ? `1px solid ${COLORS.oat_medium}` : "none",
    },
    "&.Mui-focused fieldset": {
      border: showBorder ? `1px solid ${COLORS.oat_medium}` : "none",
      borderWidth: "1px",
    },
  },

  "& .MuiOutlinedInput-input, & .MuiAutocomplete-input": {
    fontFamily: Sans.style.fontFamily,
    fontSize: "12px",
    padding: showBorder ? "0.25rem 0.5rem !important" : "0 !important",

    "&::placeholder": {
      fontFamily: Sans.style.fontFamily,
      fontSize: "12px",
      opacity: 0.6,
    },
  },
});

export const chipSx: SxProps<Theme> = {
  fontFamily: Sans.style.fontFamily,
  fontSize: "11px",
  height: "1.25rem",
  backgroundColor: `${COLORS.tagYellow}`,
  border: `0px solid ${COLORS.oat_medium}`,
  borderRadius: "2rem",

  "& .MuiChip-label": {
    fontFamily: Sans.style.fontFamily,
    fontSize: "11px",
    padding: "0 6px",
  },

  "& .MuiChip-deleteIcon": {
    fontSize: "14px",
    color: COLORS.black20,
    "&:hover": {
      color: COLORS.black40,
    },
  },
};
