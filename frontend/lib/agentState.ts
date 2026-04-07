// lib/agentState.ts
export type AgentState = {
  researcher: "idle" | "thinking" | "done";
  writer: "idle" | "thinking" | "done";
  editor: "idle" | "thinking" | "done";
};

export function deriveAgentState(logs: { message: string }[]): AgentState {
  const state: AgentState = {
    researcher: "idle",
    writer: "idle",
    editor: "idle",
  };

  logs.forEach((log) => {
    const msg = log.message.toLowerCase();

    // RESEARCHER
    if (msg.includes("ocr") || msg.includes("research")) {
      state.researcher = "thinking";
    }
    if (msg.includes("fact sheet")) {
      state.researcher = "done";
    }

    // WRITER
    if (msg.includes("writing") || msg.includes("draft")) {
      state.writer = "thinking";
    }
    if (msg.includes("reviewing")) {
      state.writer = "done";
    }

    // EDITOR
    if (msg.includes("reviewing")) {
      state.editor = "thinking";
    }
    if (msg.includes("final") || msg.includes("ready")) {
      state.editor = "done";
    }
  });

  return state;
}