"use client";

import { useCallback, useId, useMemo } from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import { DropdownOption } from "@/types/dropdown";

// for map: key is actual data stored, value is displayed
interface CommonProps {
  options: Set<string> | Map<string, string>;
  label: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
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
}: InputDropdownProps) {
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

  const handleChange = useCallback(
    (newValue: MultiValue<DropdownOption> | SingleValue<DropdownOption>) => {
      if (multi && newValue instanceof Array) {
        onChange?.(new Set(newValue.map(v => v.value)));
      } else if (!multi && !(newValue instanceof Array)) {
        onChange?.(newValue ? newValue.value : null);
      } else {
        throw new Error("An unexpected error occurred!");
      }
    },
    [multi, onChange],
  );

  return (
    <Select
      isClearable
      closeMenuOnSelect={false}
      tabSelectsValue={false}
      hideSelectedOptions={false}
      unstyled
      required={required}
      isDisabled={disabled}
      instanceId={useId()}
      options={optionsArray}
      placeholder={placeholder}
      isMulti={multi}
      onChange={handleChange}
    />
  );
}
