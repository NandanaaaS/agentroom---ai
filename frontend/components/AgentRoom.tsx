import { deriveAgentState, AgentState } from "@/lib/agentState";

type Status = "idle" | "thinking" | "done";

const STATUS_CONFIG: Record<Status, { color: string; text: string }> = {
  idle: {
    color: "bg-gray-500",
    text: "Idle",
  },
  thinking: {
    color: "bg-amber-500 animate-pulse",
    text: "Working...",
  },
  done: {
    color: "bg-emerald-500",
    text: "Done",
  },
};

function AgentCard({ name, status }: { name: string; status: Status }) {
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white dark:bg-gray-900 border dark:border-gray-800 border-slate-200 w-full transition-all">
      
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-xl">
          🤖
        </div>

        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${config.color}`}
        />
      </div>

      <p className="text-sm font-semibold dark:text-white text-slate-800">
        {name}
      </p>

      <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
        {config.text}
      </p>
    </div>
  );
}

export default function AgentRoom({ logs }: { logs: any[] }) {
  const state: AgentState = deriveAgentState(logs || []);

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <AgentCard name="Researcher" status={state.researcher} />
      <AgentCard name="Writer" status={state.writer} />
      <AgentCard name="Editor" status={state.editor} />
    </div>
  );
}