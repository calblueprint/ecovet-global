import { useRef, useState } from "react";
import { Button, Checkbox, Radio, RadioGroup } from "@mui/material";
import Check from "@/assets/images/checkmark.svg";
import InputDropdown from "@/components/InputDropdown/InputDropdown";
import { ImageLogo } from "@/components/styles";
import {
  EditablePhase,
  PromptType,
  RoleFormInput,
  StagedOption,
  UUID,
} from "@/types/schema";
import { AutoGrowBigInput } from "../TemplateOverviewForm/AutoGrow";
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
  InsertQuestionButton,
  InsertQuestionRow,
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

export default function QuestionBuilder({
  value,
  rolePhaseId,
  phase,
  onChange,
  onNextPhase,
  onSaveAndExit,
  saving,
}: {
  value: RoleFormInput;
  rolePhaseId: UUID;
  phase: EditablePhase;
  onChange: (
    id: UUID,
    field: string,
    v: string | PromptType | StagedOption[] | number,
  ) => UUID | null | void;
  onNextPhase: () => void;
  onSaveAndExit: () => void;
  saving: boolean;
}) {
  const rolePhase = value.rolePhases[rolePhaseId];
  const [focusedPromptId, setFocusedPromptId] = useState<UUID | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  function handleTypeChange(promptID: UUID, newType: PromptType) {
    onChange(promptID, "prompt_type", newType);
  }

  function deletePrompt(promptID: UUID) {
    onChange(promptID, "remove_prompt", rolePhase.role_phase_id);
    if (focusedPromptId === promptID) setFocusedPromptId(null);
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

  function insertAfter(index: number) {
    const newId = onChange(
      rolePhase.role_phase_id,
      "insert_prompt_at",
      index + 1,
    );
    if (newId) focusAndScrollTo(newId);
  }

  function focusAndScrollTo(promptID: UUID) {
    setFocusedPromptId(promptID);
    requestAnimationFrame(() => {
      cardRefs.current[promptID]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }

  const promptIds = value.promptIndex[rolePhase.role_phase_id] ?? [];

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
              onClick={() => {
                const newId = onChange(
                  rolePhase.role_phase_id,
                  "add_prompt",
                  rolePhase.role_phase_id,
                );
                if (newId) focusAndScrollTo(newId);
              }}
            >
              + Question
            </HeaderButtonLight>
            <HeaderButtonDark onClick={onNextPhase}>
              Next phase
            </HeaderButtonDark>
            <HeaderButtonDark onClick={onSaveAndExit} disabled={saving}>
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <ImageLogo
                    src={Check.src}
                    alt="Checkmark"
                    width={12}
                    height={12}
                    padding-right={1}
                  />
                  Save and exit
                </>
              )}
            </HeaderButtonDark>
          </HeaderButtonGroup>
        </RoleHeader>

        <RoleDescriptionTemplate>
          <AutoGrowBigInput
            placeholder="Role Phase description..."
            value={rolePhase.role_phase_description ?? ""}
            onChange={e => onChange(rolePhaseId, "description", e.target.value)}
          />
        </RoleDescriptionTemplate>
      </RoleHeaderContainer>

      <PhaseCard
        key={rolePhase.role_phase_id}
        onClick={e => {
          if (e.target === e.currentTarget) setFocusedPromptId(null);
        }}
      >
        {promptIds.map((promptID, j) => {
          const prompt = value.promptById[promptID];
          const promptType = (prompt.prompt_type ?? "text") as PromptType;
          const options = value.optionsByPromptId[promptID] ?? [];
          const isFocused = focusedPromptId === promptID;
          const isLast = j === promptIds.length - 1;

          return (
            <div
              key={promptID}
              ref={el => {
                cardRefs.current[promptID] = el;
              }}
            >
              <FieldCard
                onClick={() => setFocusedPromptId(promptID)}
                $focused={isFocused}
              >
                <LegendFlex>
                  <FieldLegend>Question {j + 1}</FieldLegend>
                  <DeleteButton
                    onClick={e => {
                      e.stopPropagation();
                      deletePrompt(promptID);
                    }}
                  >
                    Delete
                  </DeleteButton>
                </LegendFlex>

                <QuestionRowStyled>
                  <BigInput
                    name="prompt"
                    placeholder="Question Title"
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
                      {options.map((opt, idx) => (
                        <McqOptionStyled key={opt.option_number ?? idx}>
                          <Radio value={opt.option_number} disabled />
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
                          <DeleteMcqOptionButton
                            onClick={e => {
                              e.stopPropagation();
                              deleteOption(promptID, opt.option_number);
                            }}
                          >
                            x
                          </DeleteMcqOptionButton>
                        </McqOptionStyled>
                      ))}
                    </RadioGroup>
                    <Button
                      onClick={e => {
                        e.stopPropagation();
                        addOption(promptID);
                      }}
                      sx={{ textTransform: "none" }}
                    >
                      <AddNewOptionStyled>
                        <AddNewOptionTextStyled>
                          + Add Option
                        </AddNewOptionTextStyled>
                      </AddNewOptionStyled>
                    </Button>
                  </MultipleChoicePromptStyled>
                )}

                {promptType === "checkbox" && (
                  <CheckboxPromptStyled>
                    {options.map((opt, idx) => (
                      <McqOptionStyled key={opt.option_number ?? idx}>
                        <Checkbox disabled />
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
                            onClick={e => {
                              e.stopPropagation();
                              deleteOption(promptID, opt.option_number);
                            }}
                          >
                            x
                          </Button>
                        </DeleteMcqOptionButton>
                      </McqOptionStyled>
                    ))}
                    <Button
                      onClick={e => {
                        e.stopPropagation();
                        addOption(promptID);
                      }}
                      sx={{ textTransform: "none" }}
                    >
                      <AddNewOptionStyled>
                        <AddNewOptionTextStyled>
                          + Add Option
                        </AddNewOptionTextStyled>
                      </AddNewOptionStyled>
                    </Button>
                  </CheckboxPromptStyled>
                )}
              </FieldCard>

              {isFocused && !isLast && (
                <InsertQuestionRow>
                  <InsertQuestionButton
                    onClick={e => {
                      e.stopPropagation();
                      insertAfter(j);
                    }}
                  >
                    + Add question
                  </InsertQuestionButton>
                </InsertQuestionRow>
              )}
            </div>
          );
        })}
      </PhaseCard>
    </FormStack>
  );
}
