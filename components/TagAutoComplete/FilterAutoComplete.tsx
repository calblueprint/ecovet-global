"use client";

import { useMemo, useState } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";
import { autocompletesx, chipSx } from "./styles";

const filter = createFilterOptions<Option>();
type Option = { label: string; value: string; inputValue?: string };

interface FilterAutocompleteProps {
  availableTags: { tag_id: string; name: string }[];
  selectedTagIds: Set<string>;
  onSelect: (tagId: string) => void;
  onCreate: (name: string) => void;
  onRemove: (tagId: string) => void;
  onBlur?: () => void;
}

export function FilterAutocomplete({
  availableTags,
  selectedTagIds,
  onSelect,
  onCreate,
  onRemove,
  onBlur,
}: FilterAutocompleteProps) {
  const [inputValue, setInputValue] = useState("");

  const allOptions: Option[] = useMemo(
    () => availableTags.map(tag => ({ label: tag.name, value: tag.tag_id })),
    [availableTags],
  );

  const value: Option[] = useMemo(
    () => allOptions.filter(opt => selectedTagIds.has(opt.value)),
    [allOptions, selectedTagIds],
  );

  return (
    <Autocomplete
      multiple
      freeSolo
      disableCloseOnSelect
      filterSelectedOptions
      inputValue={inputValue}
      onInputChange={(_, val, reason) => {
        if (reason === "input") setInputValue(val);
      }}
      value={value}
      options={allOptions}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        const trimmed = params.inputValue.trim();
        const isExisting = allOptions.some(
          opt => opt.label.toLowerCase() === trimmed.toLowerCase(),
        );
        if (trimmed !== "" && !isExisting) {
          filtered.push({
            inputValue: trimmed,
            label: `Make new tag: "${trimmed}"`,
            value: "__create__",
          });
        }
        return filtered;
      }}
      getOptionLabel={option => {
        if (typeof option === "string") return option;
        return option.inputValue ?? option.label;
      }}
      onChange={(_, newValue) => {
        const newItem = newValue.find(item => {
          if (typeof item === "string") return true;
          return !selectedTagIds.has(item.value) || item.value === "__create__";
        });

        if (!newItem) {
          const removedOption = value.find(
            v =>
              !newValue.some(n => typeof n !== "string" && n.value === v.value),
          );
          if (removedOption) onRemove(removedOption.value);
          return;
        }

        if (typeof newItem === "string") {
          onCreate(newItem.trim());
        } else if (newItem.inputValue) {
          onCreate(newItem.inputValue);
        } else {
          onSelect(newItem.value);
        }

        setInputValue("");
      }}
      onBlur={onBlur}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip
              key={key}
              label={typeof option === "string" ? option : option.label}
              {...tagProps}
              size="small"
              sx={chipSx}
            />
          );
        })
      }
      renderOption={(props, option) => (
        <li
          {...props}
          key={option.value}
          style={{ fontFamily: Sans.style.fontFamily, fontSize: "12px" }}
        >
          {option.label}
        </li>
      )}
      renderInput={params => (
    <TextField
        {...params} 
        placeholder={value.length === 0 ? "Search or create tag..." : ""}
        sx={{
          "& .MuiOutlinedInput-root": {
        height: "32px",
        minHeight: "32px",
        borderRadius: "4px",
        padding: "0 8px",
        display: "flex",
        alignItems: "center",

        // 👇 THIS is the missing piece
        fontSize: "12px",
        fontFamily: Sans.style.fontFamily,

        "& fieldset": {
          border: "1px solid #EEEDE9",
        },
        "&:hover fieldset": {
          border: "1px solid #EEEDE9",
        },
        "&.Mui-focused fieldset": {
          border: "2px solid #000000",
        },
      },

      // 👇 THE important part (fixes your font jump issue)
      "& .MuiAutocomplete-input": {
        fontSize: "12px",
        fontFamily: Sans.style.fontFamily,
        padding: 0,
        margin: 0,
      },

      "& .MuiAutocomplete-input::placeholder": {
        color: "#C7C6C3",
        opacity: 1,
      },    

      "& .MuiOutlinedInput-root, & .MuiAutocomplete-input": {
        fontSize: "12px !important",
         fontFamily: Sans.style.fontFamily,
      }
        }}
    />
    )}
      slotProps={{
        paper: {
          sx: {
            boxShadow: "none",
            border: `1px solid ${COLORS.darkElectricBlue}`,
          },
        },
      }}
      sx={autocompletesx}
    />
  );
}
