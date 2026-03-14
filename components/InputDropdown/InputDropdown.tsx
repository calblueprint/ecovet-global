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
      menuIsOpen={isTagStyle ? true : undefined}
      components={isTagStyle ? { MenuList: CustomMenuList } : {}}
      closeMenuOnSelect={false}
      tabSelectsValue={false}
      hideSelectedOptions={true}
      required={required}
      controlShouldRenderValue={!isTagStyle}
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
      styles={styles}
    />
  );
}
