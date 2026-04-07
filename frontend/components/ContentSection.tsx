"use client";

import { useState, useEffect } from "react";
import { ContentData } from "@/lib/parseContent";
import ReactMarkdown from "react-markdown";

interface ContentSectionProps {
  activeTab: "blog" | "social" | "email";
  onTabChange: (tab: "blog" | "social" | "email") => void;
  content: ContentData | null;
  loading: boolean;
  onApprove: (section: "blog" | "social" | "email") => void;
  onRegenerate: (section: "blog" | "social" | "email") => void;
  approvedSections?: {
    blog: boolean;
    social: boolean;
    email: boolean;
  };
}

const TABS = [
  { id: "blog", label: "Blog Post", icon: "✦" },
  { id: "social", label: "Social Posts", icon: "◎" },
  { id: "email", label: "Email Teaser", icon: "◇" },
] as const;

function SkeletonPulse({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg dark:bg-gray-800 bg-slate-200 ${className}`}
    />
  );
}

export default function ContentSection({
  activeTab,
  onTabChange,
  content,
  loading,
  onApprove,
  onRegenerate,
  approvedSections = {
    blog: false,
    social: false,
    email: false,
  },
}: ContentSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, [activeTab]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const downloadText =
      activeTab === "blog"
        ? content?.blog || ""
        : activeTab === "email"
        ? content?.email || ""
        : (content?.social || []).join("\n\n");

    const blob = new Blob([downloadText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ReviewActions = ({
    section,
  }: {
    section: "blog" | "social" | "email";
  }) => {
    const isApproved = approvedSections[section];

    return (
      <div className="mt-8 flex items-center justify-between border-t dark:border-gray-800 border-slate-100 pt-6">
        <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">
          Human Review Required
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onRegenerate(section)}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all text-slate-600 dark:text-gray-300"
          >
            REGENERATE
          </button>
          <button
            type="button"
            onClick={() => onApprove(section)}
            disabled={isApproved}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isApproved
                ? "bg-emerald-700 text-white cursor-not-allowed"
                : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
            }`}
          >
            {isApproved ? "APPROVED ✅" : "APPROVE"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center">
        <div className="flex gap-1 p-1.5 rounded-2xl dark:bg-gray-900 bg-slate-100 border dark:border-gray-800 border-slate-200 w-full sm:w-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                  : "text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex bg-slate-100 dark:bg-gray-900 rounded-xl p-1 border dark:border-gray-800 border-slate-200">
          <button
            type="button"
            onClick={() => setViewMode("desktop")}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
              viewMode === "desktop"
                ? "bg-white dark:bg-gray-800 shadow-sm text-amber-600"
                : "text-slate-400"
            }`}
          >
            DESKTOP
          </button>
          <button
            type="button"
            onClick={() => setViewMode("mobile")}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
              viewMode === "mobile"
                ? "bg-white dark:bg-gray-800 shadow-sm text-amber-600"
                : "text-slate-400"
            }`}
          >
            MOBILE
          </button>
        </div>
      </div>

      <div
        className={`transition-all duration-500 mx-auto ${
          viewMode === "mobile"
            ? "max-w-[375px] border-[12px] border-slate-900 dark:border-black rounded-[3rem] shadow-2xl h-[650px] overflow-y-auto bg-white dark:bg-gray-950 p-2"
            : "max-w-full"
        }`}
      >
        <div
          className={`transition-all duration-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          {loading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <SkeletonPulse
                  key={i}
                  className={i === 0 ? "h-48 w-full" : "h-28 w-full"}
                />
              ))}
            </div>
          ) : !content || (!content.blog && (content.social?.length ?? 0) === 0) ? (
            <div className="py-20 text-center border-2 border-dashed dark:border-gray-800 border-slate-200 rounded-3xl opacity-60">
              <p className="text-sm text-slate-500 dark:text-gray-400">
                Content sections could not be parsed.
              </p>
            </div>
          ) : (
            <div
              className={`relative rounded-2xl p-6 ${
                viewMode === "mobile"
                  ? ""
                  : "border dark:border-gray-800 border-slate-200 dark:bg-gray-900/30 bg-white shadow-sm"
              }`}
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  type="button"
                  onClick={() => {
                    const textToCopy =
                      activeTab === "blog"
                        ? content.blog || ""
                        : activeTab === "email"
                        ? content.email || ""
                        : (content.social || []).join("\n\n");
                    handleCopy(textToCopy);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-gray-800 text-[10px] font-bold uppercase tracking-wider hover:bg-amber-500 hover:text-white transition-all border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400"
                >
                  {copied ? "✓ Copied" : "📋 Copy"}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="ml-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-gray-800 text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400"
                >
                  📥 Download
                </button>
              </div>

              {activeTab === "blog" && (
                <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-700 dark:prose-p:text-gray-300">
                  <ReactMarkdown>{content.blog || ""}</ReactMarkdown>
                  <ReviewActions section="blog" />
                </div>
              )}

              {activeTab === "social" && (
                <div className="space-y-4 pt-8">
                  {(content.social || []).map((post, i) => (
  <div key={i} className="group p-5 rounded-2xl border dark:border-gray-800 border-slate-100 dark:bg-gray-900/50 bg-slate-50/50 transition-all hover:border-amber-500/50">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-[10px] text-amber-500 font-bold border border-amber-500/20">
        {i + 1}
      </div>
      <span className="text-[11px] font-bold uppercase tracking-wider dark:text-gray-400 text-slate-500">
        Post {i + 1}
      </span>
    </div>
    <div className="text-sm leading-relaxed dark:text-gray-200 text-slate-800 font-medium">
      <ReactMarkdown>{post}</ReactMarkdown>
    </div>
  </div>
))}
                  <ReviewActions section="social" />
                </div>
              )}

              {activeTab === "email" && (
                <div className="relative pt-10">
                  <div className="absolute top-0 left-0 px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded uppercase border border-blue-500/20">
                    Draft Teaser
                  </div>
                  <div className="leading-relaxed dark:text-gray-100 text-slate-900 font-mono text-sm pt-2 prose prose-sm max-w-none">
                    <ReactMarkdown>{content.email || ""}</ReactMarkdown>
                  </div>
                  <ReviewActions section="email" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}