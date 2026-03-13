"use client";

import { useState } from "react";
import { UUID } from "crypto";
import { Button, TextField, Typography } from "@mui/material";
import { addNewOption, addNewPrompt } from "@/actions/supabase/queries/prompt";
import { LayoutWrapper, SideNavContainer } from "@/app/facilitator/styles";
import TemplateSideBar from "@/app/facilitator/template-list/components/TemplateSidebar";
import TopNavBar from "@/components/NavBar/NavBar";
import PromptRenderer, {
  StagedOption,
} from "@/components/prompts/BuildPromptRenderer";
import { PromptType } from "@/types/schema";
import {
  FacilitatorPromptBuilderStyled,
  PhaseDescriptionFieldStyled,
  TitleStyled,
} from "./styles";

type Data = {
  question: string;
  prompt_type: PromptType;
  options: StagedOption[];
};

export type StagedPrompt = {
  prompt_number: number;
  data: Data;
};

export default function TestPage() {
  const [prompts, setPrompts] = useState<StagedPrompt[]>([]);
  const phaseNumber = 1;

  function handleUpdate(prompt_number: number, data: Data) {
    console.log("Prompt Updated:", { prompt_number, ...data });
    setPrompts(prev =>
      prev.map(p => (p.prompt_number === prompt_number ? { ...p, data } : p)),
    );
  }

  function addEmptyPrompt() {
    const nextNum = prompts.length + 1;
    setPrompts(prev => [
      ...prev,
      {
        prompt_number: nextNum,
        data: {
          question: "",
          prompt_type: "text" as PromptType,
          options: [],
        },
      },
    ]);
  }

  async function handleSubmit() {
    try {
      for (const prompt of prompts) {
        const { question, prompt_type, options } = prompt.data;

        // Insert prompt => get prompt_id (UUID)
        const prompt_id = await addNewPrompt(question, prompt_type);

        // Insert each option
        for (const opt of options) {
          await addNewOption(prompt_id, opt.option_text);
        }
      }

      alert("All prompts saved!");

      // Clear data
      setPrompts([]);
    } catch (err) {
      console.error(err);
      alert("Error submitting prompts: ");
    }
  }

  return (
    <>
      <TopNavBar />
      <LayoutWrapper>
        <SideNavContainer>
          <TemplateSideBar filterMode="all" setFilterMode={() => ""} />
        </SideNavContainer>

        <FacilitatorPromptBuilderStyled>
          {/* LEFT SIDE */}

          <TitleStyled>
            <Typography variant="h4">Phase {phaseNumber}</Typography>

            <PhaseDescriptionFieldStyled>
              <TextField
                variant="standard"
                placeholder="Enter phase description here..."
              />
            </PhaseDescriptionFieldStyled>
          </TitleStyled>

          {prompts.map(p => (
            <PromptRenderer
              key={p.prompt_number}
              prompt_id={p.prompt_number}
              onUpdate={handleUpdate}
            />
          ))}

          <div>
            <Button variant="contained" onClick={addEmptyPrompt}>
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
              Add New Prompt
            </Button>

            <Button variant="contained" color="success" onClick={handleSubmit}>
              Submit All
            </Button>
          </div>

          {/* RIGHT SIDE */}
          {/* <Box flex={1}>
          <Paper sx={{ p: 3, bgcolor: "#111", color: "#0f0", minHeight: 400 }}>
            <Typography variant="h6">Live Data</Typography>

            <pre style={{ overflow: "auto" }}>
              {JSON.stringify(prompts, null, 2)}
            </pre>
          </Paper>
        </Box> */}
        </FacilitatorPromptBuilderStyled>
      </LayoutWrapper>
    </>
  );
}
