"use client";

import { useState } from "react";
import PromptRenderer, { StagedOption } from "@/components/prompts/BuildPromptRenderer"; 
import { UUID } from "crypto";
import { PromptType } from "@/types/schema";
import { addNewPrompt, addNewOption } from "@/actions/supabase/queries/prompt";

type Data = {
    question: string;
    prompt_type: PromptType;
    options: StagedOption[];
}

export type StagedPrompt = {
    prompt_number: number;
    data: Data;
}

export default function TestPage() {
    const [prompts, setPrompts] = useState<StagedPrompt[]>([])

    function handleUpdate(prompt_number: number, data: any) {
        console.log("🔥 Prompt Updated:", { prompt_number, ...data });
        setPrompts(prev =>
            prev.map(p =>
                p.prompt_number === prompt_number
                    ? { ...p, data }
                    : p
            )
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
                    options: []
                }
            }
        ]);
    }

    async function handleSubmit() {
        try {
            for (const prompt of prompts) {
                const { question, prompt_type, options } = prompt.data;

                // Insert prompt => get prompt_id (UUID)
                const prompt_id: UUID = await addNewPrompt(
                    question,
                    prompt_type
                );

                // Insert each option
                for (const opt of options) {
                    await addNewOption(prompt_id, opt.option_text);
                }
            }

            alert("All prompts saved!");

            // Clear data
            setPrompts([])

        } catch (err: any) {
            console.error(err);
            alert("Error submitting prompts: " + err.message);
        }
    }

    return (
        <div style={{ padding: "40px", display: "flex", gap: "40px" }}>

            {/* LEFT SIDE */}
            <div style={{ flex: 1 }}>
                <h1>Prompt Builder Test Page</h1>

                <button onClick={addEmptyPrompt}>
                    ➕ Add New Prompt
                </button>

                <div style={{ marginTop: "20px" }}>
                    {prompts.map((p) => (
                        <div key={p.prompt_number} style={{ marginBottom: "20px" }}>
                            <PromptRenderer
                                prompt_id={p.prompt_number}   // local temp ID
                                onUpdate={handleUpdate}
                            />
                        </div>
                    ))}
                </div>

                <button 
                    style={{ marginTop: "20px", padding: "10px 20px" }}
                    onClick={handleSubmit}
                >
                    ✅ Submit All
                </button>
            </div>

            {/* RIGHT SIDE */}
            <div style={{ flex: 1 }}>
                <h2>Live Data</h2>
                <pre style={{
                    background: "#111",
                    color: "#0f0",
                    padding: "20px",
                    minHeight: "400px",
                    borderRadius: "8px",
                    overflow: "auto"
                }}>
                    {JSON.stringify(prompts, null, 2)}
                </pre>
            </div>
        </div>
    );
}