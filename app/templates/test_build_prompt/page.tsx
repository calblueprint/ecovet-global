"use client";

import { useState } from "react";
import PromptRenderer from "@/components/prompts/BuildPromptRenderer"; 
import { UUID } from "crypto";

// Fake UUID for testing
const fakePromptId = "11111111-1111-1111-1111-111111111111" as UUID;

export default function TestPage() {
    const [draftData, setDraftData] = useState<any>(null);

    function handleUpdate(prompt_id: UUID, data: any) {
        console.log("🔥 Prompt Updated:", { prompt_id, ...data });
        setDraftData(data);
    }

    return (
        <div style={{ padding: "40px", display: "flex", gap: "40px" }}>
            {/* Left side: the interactive prompt builder */}
            <div style={{ flex: 1 }}>
                <h1>Prompt Builder Test Page</h1>

                <PromptRenderer 
                    prompt_id={fakePromptId}
                    onUpdate={handleUpdate}
                />
            </div>

            {/* Right side: live JSON preview */}
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
                    {JSON.stringify(draftData, null, 2)}
                </pre>
            </div>
        </div>
    );
}
