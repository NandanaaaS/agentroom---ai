"use client";

import { useState, useEffect } from "react";
import { ContentData } from "@/lib/parseContent";

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

  useEffect(() => {
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex gap-1 p-1 rounded-2xl dark:bg-gray-900 bg-white border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 rounded-xl ${
              activeTab === tab.id ? "bg-amber-500 text-white" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={`${mounted ? "opacity-100" : "opacity-0"}`}>
        {loading || !content ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <SkeletonPulse
                key={i}
                className={i === 0 ? "h-48 w-full" : "h-28 w-full"}
              />
            ))}
          </div>
        ) : (
          <>
            {activeTab === "blog" && content && (
              <div>{content.blog}</div>
            )}

            {activeTab === "social" && content && (
              <div className="space-y-2">
                {content.social.map((post, i) => (
                  <div key={i}>{post}</div>
                ))}
              </div>
            )}

            {activeTab === "email" && content && (
              <div>{content.email}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}