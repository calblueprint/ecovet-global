"use client";

import { useCallback, useId, useMemo } from "react";
import Select, {
  components,
  MenuListProps,
  MultiValue,
  SingleValue,
} from "react-select";
import CreatableSelect from "react-select/creatable";
import { DropdownOption } from "@/types/dropdown";
import { selectStyles, tagSelectStyles } from "./styles";

// for map: key is actual data stored, value is displayed
interface CommonProps {
  isTagStyle?: boolean;
  options: Set<string> | Map<string, string>;
  label: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  creatable?: boolean;
  multiple?: boolean;
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

const CustomMenuList = (props: MenuListProps<DropdownOption>) => {
  return (
    <components.MenuList {...props}>
      <div
        style={{
          padding: "8px 12px",
          fontSize: "11px",
          color: "#959492",
          fontWeight: 500,
        }}
      >
        Add a tag
      </div>
      {props.children}
    </components.MenuList>
  );
};

// main dropdown component
export default function InputDropdown({
  options,
  isTagStyle = false,
  placeholder = "",
  disabled,
  required,
  onChange,
  multi,
  multiple,
  creatable,
  onCreateOption,
  value,
  onBlur,
}: InputDropdownProps) {
  const SelectComponent = creatable ? CreatableSelect : Select;
  const styles = isTagStyle ? tagSelectStyles : selectStyles;

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

  // For tag style: exclude already-selected from the dropdown list
  const filteredOptions = useMemo(() => {
    if (!isTagStyle || !value) return optionsArray;
    return optionsArray.filter(opt => !value.has(opt.value));
  }, [optionsArray, isTagStyle, value]);

  const handleChange = useCallback(
    (newValue: MultiValue<DropdownOption> | SingleValue<DropdownOption>) => {
      if (multi) {
        const values = (newValue as MultiValue<DropdownOption>) || [];
        onChange?.(new Set(values.map(v => v.value)));
      } else {
        const val = newValue as SingleValue<DropdownOption>;
        onChange?.(val ? val.value : null);
      }
    },
    [multi, onChange],
  );

  return (
    <SelectComponent
      menuIsOpen={isTagStyle ? true : undefined}
      components={
        isTagStyle ? { MenuList: CustomMenuList, Control: () => null } : {}
      }
      closeMenuOnSelect={false}
      tabSelectsValue={false}
      hideSelectedOptions={true}
      required={required}
      controlShouldRenderValue={false}
      isDisabled={disabled}
      instanceId={useId()}
      options={filteredOptions}
      placeholder={placeholder}
      isMulti={multi}
      onBlur={onBlur}
      autoFocus={true}
      value={[]}
      onChange={handleChange}
      onCreateOption={onCreateOption}
      styles={styles}
      isClearable={false}
    />
  );
}
