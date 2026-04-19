import { Button, Checkbox, Radio, RadioGroup } from "@mui/material";
import InputDropdown from "@/components/InputDropdown/InputDropdown";
import {
  EditablePhase,
  PromptType,
  RoleFormInput,
  StagedOption,
  UUID,
} from "@/types/schema";
import {
  AddNewOptionStyled,
  AddNewOptionTextStyled,
  BigInput,
  CheckboxPromptStyled,
  compactSelectStyles,
  DeleteButton,
  DeleteMcqOptionButton,
  FieldCard,
  FieldLegend,
  FormStack,
  HeaderButtonDark,
  HeaderButtonGroup,
  HeaderButtonLight,
  LegendFlex,
  McqOptionStyled,
  MultipleChoicePromptStyled,
  PhaseCard,
  PhaseTemplateHeader,
  PromptTypeDropdownStyled,
  QuestionRowStyled,
  RoleDescriptionTemplate,
  RoleHeader,
  RoleHeaderContainer,
  RolePhaseDescriptionInput,
  RoleTemplateName,
  TextFieldStyled,
} from "./styles";

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
  >
    <rect y="4.44434" width="10" height="1.11111" fill="#476C77" />
    <rect
      x="5.55566"
      width="10"
      height="1.11111"
      transform="rotate(90 5.55566 0)"
      fill="#476C77"
    />
  </svg>
);

export default function QuestionBuilder({
  value,
  rolePhaseId,
  phase,
  onChange,
  onNextPhase, // NEW PROP
  onSaveAndExit, // NEW PROP
}: {
  value: RoleFormInput;
  rolePhaseId: UUID;
  phase: EditablePhase;
  onChange: (
    id: UUID,
    field: string,
    v: string | PromptType | StagedOption[],
  ) => void;
  onNextPhase: () => void; // NEW PROP
  onSaveAndExit: () => void; // NEW PROP
}) {
  const rolePhase = value.rolePhases[rolePhaseId];

  function handleTypeChange(promptID: UUID, newType: PromptType) {
    onChange(promptID, "prompt_type", newType);
  }

  function deletePrompt(promptID: UUID) {
    onChange(promptID, "remove_prompt", rolePhase.role_phase_id);
  }

  function addOption(promptID: UUID) {
    const current = value.optionsByPromptId[promptID] ?? [];
    const updated: StagedOption[] = [
      ...current,
      { option_number: current.length + 1, option_text: "" },
    ];
    onChange(promptID, "options", updated);
  }

  function deleteOption(promptID: UUID, option_number: number) {
    const current = value.optionsByPromptId[promptID] ?? [];
    const updated = current
      .filter(o => o.option_number !== option_number)
      .map((o, i) => ({ ...o, option_number: i + 1 }));
    onChange(promptID, "options", updated);
  }

  function updateOptionText(
    promptID: UUID,
    option_number: number,
    text: string,
  ) {
    const current = value.optionsByPromptId[promptID] ?? [];
    const updated = current.map(o =>
      o.option_number === option_number ? { ...o, option_text: text } : o,
    );
    onChange(promptID, "options", updated);
  }

  return (
    <FormStack>
      <RoleHeaderContainer>
        <RoleHeader>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <RoleTemplateName>{value.role.role_name}</RoleTemplateName>
            <PhaseTemplateHeader>{phase.phase_name}</PhaseTemplateHeader>
          </div>

          <HeaderButtonGroup>
            <HeaderButtonLight
              onClick={() =>
                onChange(
                  rolePhase.role_phase_id,
                  "add_prompt",
                  rolePhase.role_phase_id,
                )
              }
            >
              + Question
            </HeaderButtonLight>
            <HeaderButtonDark onClick={onNextPhase}>
              + Next phase
            </HeaderButtonDark>
            <HeaderButtonDark onClick={onSaveAndExit}>
              + Save and exit
            </HeaderButtonDark>
          </HeaderButtonGroup>
        </RoleHeader>

        <RoleDescriptionTemplate>
          <RolePhaseDescriptionInput
            placeholder="Phase description..."
            value={rolePhase.role_phase_description ?? ""}
            onChange={e => onChange(rolePhaseId, "description", e.target.value)}
          />
        </RoleDescriptionTemplate>
      </RoleHeaderContainer>

      <PhaseCard key={rolePhase.role_phase_id}>
        {(value.promptIndex[rolePhase.role_phase_id] ?? []).map(
          (promptID, j) => {
            const prompt = value.promptById[promptID];
            const promptType = (prompt.prompt_type ?? "text") as PromptType;
            const options = value.optionsByPromptId[promptID] ?? [];

            return (
              <FieldCard key={promptID}>
                <LegendFlex>
                  <FieldLegend>Question {j + 1}</FieldLegend>
                  <DeleteButton onClick={() => deletePrompt(promptID)}>
                    Delete
                  </DeleteButton>
                </LegendFlex>

                <QuestionRowStyled>
                  <BigInput
                    name="prompt"
                    placeholder="Type question..."
                    value={prompt.prompt_text ?? ""}
                    onChange={e =>
                      onChange(promptID, "prompt_text", e.target.value)
                    }
                  />
                  <PromptTypeDropdownStyled>
                    <InputDropdown
                      label=""
                      options={
                        new Map([
                          ["text", "Text"],
                          ["multiple_choice", "Multiple Choice"],
                          ["checkbox", "Checkbox"],
                        ])
                      }
                      value={promptType}
                      defaultValue="text"
                      isClearable={false}
                      customStyles={compactSelectStyles}
                      onChange={value => {
                        if (value)
                          handleTypeChange(promptID, value as PromptType);
                      }}
                    />
                  </PromptTypeDropdownStyled>
                </QuestionRowStyled>

                <BigInput
                  name="prompt_follow_ups"
                  placeholder="Type question follow ups (Use Shift+Return to add more lines)..."
                  value={prompt.prompt_follow_ups ?? ""}
                  onChange={e =>
                    onChange(promptID, "prompt_follow_ups", e.target.value)
                  }
                />

                {promptType === "multiple_choice" && (
                  <MultipleChoicePromptStyled>
                    <RadioGroup name={`mcq-${promptID}`}>
                      {options.map(opt => (
                        <McqOptionStyled key={opt.option_number}>
                          <Radio value={opt.option_number} />
                          <TextFieldStyled
                            size="small"
                            placeholder="Enter option text"
                            value={opt.option_text}
                            onChange={e =>
                              updateOptionText(
                                promptID,
                                opt.option_number,
                                e.target.value,
                              )
                            }
                          />
                          <DeleteMcqOptionButton>
                            <Button
                              color="error"
                              onClick={() =>
                                deleteOption(promptID, opt.option_number)
                              }
                            >
                              Delete
                            </Button>
                          </DeleteMcqOptionButton>
                        </McqOptionStyled>
                      ))}
                    </RadioGroup>
                    <Button
                      onClick={() => addOption(promptID)}
                      sx={{ textTransform: "none" }}
                    >
                      <AddNewOptionStyled>
                        <PlusIcon />
                        <AddNewOptionTextStyled>
                          Add Option
                        </AddNewOptionTextStyled>
                      </AddNewOptionStyled>
                    </Button>
                  </MultipleChoicePromptStyled>
                )}

                {promptType === "checkbox" && (
                  <CheckboxPromptStyled>
                    {options.map(opt => (
                      <McqOptionStyled key={opt.option_number}>
                        <Checkbox />
                        <TextFieldStyled
                          size="small"
                          placeholder="Enter option text"
                          value={opt.option_text}
                          onChange={e =>
                            updateOptionText(
                              promptID,
                              opt.option_number,
                              e.target.value,
                            )
                          }
                        />
                        <DeleteMcqOptionButton>
                          <Button
                            color="error"
                            onClick={() =>
                              deleteOption(promptID, opt.option_number)
                            }
                          >
                            Delete
                          </Button>
                        </DeleteMcqOptionButton>
                      </McqOptionStyled>
                    ))}
                    <Button
                      onClick={() => addOption(promptID)}
                      sx={{ textTransform: "none" }}
                    >
                      <AddNewOptionStyled>
                        <PlusIcon />
                        <AddNewOptionTextStyled>
                          Add Option
                        </AddNewOptionTextStyled>
                      </AddNewOptionStyled>
                    </Button>
                  </CheckboxPromptStyled>
                )}
              </FieldCard>
            );
          },
        )}
      </PhaseCard>
    </FormStack>
  );
}
