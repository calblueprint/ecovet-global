"use client";

import { useEffect, useState } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { PromptType } from "@/types/schema";
import CheckboxPrompt from "./CheckboxPrompt";
import MultipleChoicePrompt from "./MultipleChoicePrompt";
import {
  PromptRendererStyled,
  PromptTypeDropdownStyled,
  QuestionHeaderStyled,
  QuestionNumberStyled,
  TextFieldStyled,
} from "./styles";

// Options staged in state, only converted to PromptOptions on submit
export type StagedOption = {
  option_number: number;
  option_text: string;
};

type PromptRendererProps = {
  prompt_id: number;
  onUpdate: (
    prompt_id: number,
    data: {
      question: string;
      prompt_type: PromptType;
      options: StagedOption[];
    },
  ) => void;
};
export interface OptionsProps {
  options: StagedOption[];
  updateOptionText: (option_number: number, text: string) => void;
  addNewOption?: (newText: string) => void;
  deleteOption?: (option_number: number) => void;
}

export default function PromptRenderer({
  prompt_id,
  onUpdate,
}: PromptRendererProps) {
  const [prompt_type, setPromptType] = useState<PromptType>("text");
  const [options, setOptions] = useState<StagedOption[]>([]);
  const [question, setQuestion] = useState("");

  // Notify parent whenever prompt state changes
  useEffect(() => {
    onUpdate(prompt_id, { question, prompt_type, options });
  }, [question, prompt_type, options, onUpdate, prompt_id]);

  useEffect(() => {
    if (prompt_type === "text" && options.length === 0) {
      addNewOption("");
    }
  }, [prompt_type, options.length]);

  function handleChangePromptType(newType: PromptType) {
    // clear all options
    setOptions([]);

    // set new prompt type
    setPromptType(newType);
  }

  function addNewOption(newText: string) {
    setOptions(prev => [
      ...prev,
      {
        option_number: prev.length + 1,
        option_text: newText,
      },
    ]);
  }

  function deleteOption(option_number: number) {
    setOptions(
      prev =>
        prev
          .filter(o => o.option_number !== option_number)
          .map((o, i) => ({ ...o, option_number: i + 1 })), // reindex
    );
  }

  function updateOptionText(option_number: number, text: string) {
    console.log(options.length);

    setOptions(prev =>
      prev.map(o =>
        o.option_number === option_number ? { ...o, option_text: text } : o,
      ),
    );
  }

  const optionsField =
    prompt_type === "text" ? (
      <></>
    ) : prompt_type === "multiple_choice" ? (
      <MultipleChoicePrompt
        options={options}
        addNewOption={addNewOption}
        deleteOption={deleteOption}
        updateOptionText={updateOptionText}
      />
    ) : (
      <CheckboxPrompt
        options={options}
        addNewOption={addNewOption}
        deleteOption={deleteOption}
        updateOptionText={updateOptionText}
      />
    );

  return (
    <FormControl fullWidth>
      <PromptRendererStyled>
        <QuestionNumberStyled>Question {prompt_id}</QuestionNumberStyled>

        <QuestionHeaderStyled>
          <TextFieldStyled
            type="text"
            placeholder="Type Question..."
            value={question}
            onChange={e => setQuestion(e.target.value)}
          />

          <PromptTypeDropdownStyled>
            <Select
              value={prompt_type}
              onChange={e =>
                handleChangePromptType(e.target.value as PromptType)
              }
              size="small"
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
              <MenuItem value="checkbox">Checkbox</MenuItem>
            </Select>
          </PromptTypeDropdownStyled>
        </QuestionHeaderStyled>

        {optionsField}
      </PromptRendererStyled>
    </FormControl>
  );
}
