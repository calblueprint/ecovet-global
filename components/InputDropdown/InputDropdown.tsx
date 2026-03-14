"use client";

import { useCallback, useId, useMemo } from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { DropdownOption } from "@/types/dropdown";
import { selectStyles } from "./styles";

// for map: key is actual data stored, value is displayed
interface CommonProps {
  options: Set<string> | Map<string, string>;
  label: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  creatable?: boolean;
  onCreateOption?: (inputValue: string) => void;
  value?: Set<string>;
  onBlur?: () => void;
}

interface MultiSelectProps extends CommonProps {
  multi: true;
  onChange?: (value: Set<string>) => void;
}

interface SingleSelectProps extends CommonProps {
  multi?: false;
  onChange?: (value: string | null) => void;
}

type InputDropdownProps = SingleSelectProps | MultiSelectProps;

// main dropdown component
export default function InputDropdown({
  options,
  placeholder = "",
  disabled,
  required,
  onChange,
  multi,
  creatable,
  onCreateOption,
  value,
  onBlur,
}: InputDropdownProps) {
  const SelectComponent = creatable ? CreatableSelect : Select;

  const optionsArray = useMemo(
    () =>
      options instanceof Set
        ? Array.from(options).map(v => ({ label: v, value: v }))
        : Array.from(options.entries()).map(([k, v]) => ({
            value: k,
            label: v,
          })),
    [options],
  );

  const internalValue = useMemo(() => {
    if (!value) return multi ? [] : null;
    return optionsArray.filter(opt => value.has(opt.value));
  }, [value, optionsArray, multi]);

  const handleChange = useCallback(
    (newValue: MultiValue<DropdownOption> | SingleValue<DropdownOption>) => {
      if (multi) {
        // ensure newValue is an array
        const values = (newValue as MultiValue<DropdownOption>) || [];
        onChange?.(new Set(values.map(v => v.value)));
      } else {
        //ensure newValue is a single object
        const val = newValue as SingleValue<DropdownOption>;
        onChange?.(val ? val.value : null);
      }
    },
    [multi, onChange],
  );

  return (
    <SelectComponent
      isClearable
      closeMenuOnSelect={false}
      tabSelectsValue={false}
      hideSelectedOptions={true}
      required={required}
      isDisabled={disabled}
      instanceId={useId()}
      options={optionsArray}
      placeholder={placeholder}
      isMulti={multi}
      onBlur={onBlur} // dropdown goes away when click off
      autoFocus={true}
      value={internalValue}
      onChange={handleChange}
      onCreateOption={onCreateOption}
      styles={selectStyles}
      controlShouldRenderValue={true} // Ensures selected tags show up in the box
    />
  );
}
