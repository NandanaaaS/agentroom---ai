"use client";

import { useState, useEffect } from "react";
import { ContentData } from "@/lib/parseContent";
import ReactMarkdown from "react-markdown";

interface ContentSectionProps {
  activeTab: "blog" | "social" | "email";
  onTabChange: (tab: "blog" | "social" | "email") => void;
  content: ContentData | null;
  loading: boolean;
}

const TABS = [
  { id: "blog", label: "Blog Post", icon: "✦" },
  { id: "social", label: "Social Posts", icon: "◎" },
  { id: "email", label: "Email Teaser", icon: "◇" },
] as const;

function SkeletonPulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg dark:bg-gray-800 bg-slate-200 ${className}`} />;
}

export default function ContentSection({ activeTab, onTabChange, content, loading }: ContentSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Tabs Header */}
      <div className="flex gap-1 p-1 rounded-2xl dark:bg-gray-900 bg-white border dark:border-gray-800">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id 
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" 
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className={`transition-all duration-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <SkeletonPulse key={i} className={i === 0 ? "h-48 w-full" : "h-28 w-full"} />
            ))}
          </div>
        ) : !content || (!content.blog && content.social.length === 0) ? (
          <div className="py-20 text-center border-2 border-dashed dark:border-gray-800 rounded-3xl opacity-40">
            <p className="text-sm text-slate-500">Content sections could not be parsed. Check the logs for full output.</p>
          </div>
        ) : (
          <div className="relative rounded-2xl border dark:border-gray-800 dark:bg-gray-900/30 bg-white p-6 shadow-sm">
            
            {/* Action Buttons (Copy) */}
            <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => {
                    const textToCopy = activeTab === 'blog' ? content.blog : 
                                     activeTab === 'email' ? content.email : 
                                     content.social.join('\n\n');
                    handleCopy(textToCopy);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-[10px] font-bold uppercase tracking-wider hover:bg-amber-500 hover:text-white transition-all border dark:border-gray-700"
                >
                  {copied ? "✓ Copied" : "📋 Copy Section"}
                </button>
            </div>

            {/* Blog Section */}
            {activeTab === "blog" && (
              <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base">
                <div className="dark:text-gray-200 text-slate-700 leading-relaxed">
                  <ReactMarkdown>{content.blog || ""}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Social Posts Section - Card Style */}
            {activeTab === "social" && (
              <div className="space-y-4 pt-8">
                {content.social.map((post, i) => (
                  <div 
                    key={i} 
                    className="group p-5 rounded-2xl border dark:border-gray-800 dark:bg-gray-900/50 bg-slate-50 transition-all hover:border-amber-500/50"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-[10px] text-amber-500 font-bold border border-amber-500/20">
                        {i + 1}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider dark:text-gray-400 text-slate-500">
                        Post {i + 1}
                      </span>
                    </div>
                    <div className="text-sm leading-relaxed dark:text-gray-200 text-slate-700">
                      <ReactMarkdown>{post}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Email Section */}
            {activeTab === "email" && (
              <div className="relative pt-10">
                 <div className="absolute top-0 left-0 px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[10px] font-bold rounded uppercase border border-blue-500/20">
                    Draft Teaser
                 </div>
                 <div className="leading-relaxed dark:text-gray-100 text-slate-800 font-mono text-sm pt-2">
                    <ReactMarkdown>{content.email || ""}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}