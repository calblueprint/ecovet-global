"use client";

import type { SelectInstance } from "react-select";
import { useCallback, useId, useMemo } from "react";
import Select, { MultiValue, SingleValue, StylesConfig } from "react-select";
import { DropdownOption } from "@/types/dropdown";
import { getSelectStyles, selectStyles } from "./styles";

// for map: key is actual data stored, value is displayed
interface CommonProps {
  options: Set<string> | Map<string, string>;
  label: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  customStyles?: StylesConfig<DropdownOption, boolean>;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  selectRef?: React.Ref<SelectInstance<DropdownOption>>;
  defaultValue?: string;
  isClearable?: boolean;
  outlined?: boolean;
}

interface MultiSelectProps extends CommonProps {
  multi: true;
  value?: Set<string>;
  onChange?: (value: Set<string>) => void;
}

interface SingleSelectProps extends CommonProps {
  multi?: false;
  value?: string | null;
  onChange?: (value: string | null) => void;
}

type InputDropdownProps = SingleSelectProps | MultiSelectProps;
// main dropdown component
export default function InputDropdown(props: InputDropdownProps) {
  const {
    options,
    placeholder = "",
    disabled,
    required,
    onChange,
    multi,
    customStyles,
    onKeyDown,
    selectRef,
    defaultValue,
    isClearable,
    outlined = true,
  } = props;

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

  const defaultOption = defaultValue
    ? optionsArray.find(o => o.value === defaultValue)
    : undefined;

  const controlledValue = useMemo(() => {
    if (props.multi) {
      if (props.value === undefined) return undefined;
      return optionsArray.filter(o => props.value!.has(o.value));
    } else {
      if (props.value === undefined) return undefined;
      if (props.value === null) return null;
      return optionsArray.find(o => o.value === props.value) ?? null;
    }
  }, [props, optionsArray]);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={selectRef as React.Ref<any>}
      onKeyDown={onKeyDown}
      isClearable={isClearable}
      closeMenuOnSelect={multi ? false : true}
      tabSelectsValue={false}
      hideSelectedOptions={false}
      required={required}
      isDisabled={disabled}
      instanceId={useId()}
      options={optionsArray}
      placeholder={placeholder}
      isMulti={multi}
      onChange={handleChange}
      value={controlledValue}
      defaultValue={defaultOption}
      styles={{
        ...((customStyles || getSelectStyles(outlined)) as StylesConfig<
          DropdownOption,
          boolean
        >),
        menuPortal: base => ({ ...base, zIndex: 9999 }),
      }}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      menuPosition="fixed"
    />
  );
}
