"use client";

import { useEffect, useRef } from "react";

interface LogsSectionProps {
  logs?: string[];
  loading: boolean;
}

function SkeletonPulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg dark:bg-gray-800 bg-slate-200 ${className}`} />;
}

const LOG_ICONS: Record<number, string> = {};

function getLogStyle(log: string, index: number, total: number) {
  const isLast = index === total - 1;
  const isApproved = log.toLowerCase().includes("approved") || log.toLowerCase().includes("final");
  const isError = log.toLowerCase().includes("error") || log.toLowerCase().includes("failed");

  if (isError) return { dot: "bg-rose-500", text: "dark:text-rose-400 text-rose-600", label: "Error" };
  if (isApproved) return { dot: "bg-emerald-500", text: "dark:text-emerald-400 text-emerald-600", label: "Done" };
  if (isLast) return { dot: "bg-amber-500 animate-pulse", text: "dark:text-amber-400 text-amber-600", label: "Active" };
  return { dot: "bg-blue-500", text: "dark:text-gray-300 text-slate-700", label: "Info" };
}

export default function LogsSection({ logs, loading }: LogsSectionProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold dark:text-white text-slate-900 tracking-tight">
          Agent Logs
        </h2>
        <p className="text-sm dark:text-gray-500 text-slate-400 mt-1 tracking-wide uppercase font-medium">
          Pipeline execution trace
        </p>
      </div>

      <div className="rounded-2xl dark:bg-gray-900 bg-white border dark:border-gray-800 border-slate-200 overflow-hidden">
        {/* Terminal header bar */}
        <div className={`px-5 py-3 dark:bg-gray-800/80 bg-slate-100 border-b dark:border-gray-700 border-slate-200 flex items-center gap-2`}>
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs dark:text-gray-500 text-slate-400 ml-2 font-mono">
            pipeline.log
          </span>
          {!loading && logs && (
            <span className="ml-auto text-xs dark:text-gray-600 text-slate-400">
              {logs.length} entries
            </span>
          )}
        </div>

        {/* Log content */}
        <div className="h-[420px] overflow-y-auto p-5 space-y-1 scroll-smooth font-mono text-sm">
          {loading || !logs ? (
            <div className="space-y-3 pt-2">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <SkeletonPulse className="w-2 h-2 rounded-full flex-shrink-0" />
                  <SkeletonPulse className={`h-4 ${i % 2 === 0 ? "w-3/4" : "w-1/2"}`} />
                </div>
              ))}
            </div>
          ) : (
            <>
              {logs.map((log, i) => {
                const { dot, text, label } = getLogStyle(log, i, logs.length);
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 py-2.5 px-3 rounded-lg dark:hover:bg-gray-800/60 hover:bg-slate-50 transition-colors duration-150 group"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {/* Timeline line */}
                    <div className="flex flex-col items-center flex-shrink-0 mt-1">
                      <div className={`w-2 h-2 rounded-full ${dot} shadow-sm`} />
                      {i < logs.length - 1 && (
                        <div className="w-px h-6 dark:bg-gray-700 bg-slate-200 mt-1" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${text} opacity-70`}>
                          {label}
                        </span>
                        <span className="text-[10px] dark:text-gray-600 text-slate-400">
                          T+{(i * 0.8).toFixed(1)}s
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${text}`}>
                        {log}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Status footer */}
        {!loading && logs && (
          <div className="px-5 py-3 dark:bg-gray-800/50 bg-slate-50 border-t dark:border-gray-700 border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs dark:text-gray-500 text-slate-500 font-mono">
              Pipeline complete — {logs.length} steps executed
            </span>
          </div>
        )}
      </div>
    </div>
  );
}