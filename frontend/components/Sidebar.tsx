// frontend/components/SideBar.tsx
"use client";

import { Section } from "@/app/page";

const NAV_ITEMS: { id: Section; label: string; icon: string; description: string }[] = [
  { id: "factsheet", label: "Fact Sheet", icon: "◈", description: "Product details" },
  { id: "blog",      label: "Blog Post",  icon: "✦", description: "Long-form content" },
  { id: "social",    label: "Social Posts", icon: "◎", description: "Platform content" },
  { id: "email",     label: "Email Teaser", icon: "◇", description: "Campaign copy" },
  { id: "logs",      label: "Agent Logs",  icon: "⊕", description: "Process timeline" },
];

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (s: Section) => void;
  isOpen: boolean;
  darkMode: boolean;
}

export default function Sidebar({ activeSection, onSectionChange, isOpen, darkMode }: SidebarProps) {
  return (
    <aside
      className={`
        fixed top-0 left-0 h-full w-64 z-30 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        ${darkMode
          ? "bg-gray-900 border-r border-gray-800"
          : "bg-white border-r border-slate-200"}
      `}
    >
      {/* Logo area */}
      <div className={`px-6 pt-8 pb-6 border-b ${darkMode ? "border-gray-800" : "border-slate-100"}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <div>
            <p className={`text-xs font-semibold tracking-[0.15em] uppercase ${darkMode ? "text-amber-400" : "text-amber-600"}`}>
              ContentForge
            </p>
            <p className={`text-[10px] ${darkMode ? "text-gray-500" : "text-slate-400"}`}>
              AI Content Studio
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className={`px-3 mb-3 text-[10px] font-semibold tracking-[0.2em] uppercase ${darkMode ? "text-gray-600" : "text-slate-400"}`}>
          Sections
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left
                transition-all duration-200 group relative overflow-hidden
                ${isActive
                  ? darkMode
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-amber-50 text-amber-700"
                  : darkMode
                    ? "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-amber-400 rounded-r-full" />
              )}

              <span className={`text-base w-5 text-center flex-shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                {item.icon}
              </span>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isActive ? "" : ""}`}>
                  {item.label}
                </p>
                <p className={`text-[11px] truncate mt-0.5 ${
                  isActive
                    ? darkMode ? "text-amber-400/90" : "text-amber-600/70"
                    : darkMode ? "text-gray-500" : "text-slate-400"
                }`}>
                  {item.description}
                </p>
              </div>

              {isActive && (
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${darkMode ? "bg-amber-400" : "bg-amber-500"}`} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`px-6 py-5 border-t ${darkMode ? "border-gray-800" : "border-slate-100"}`}>
        <div className={`text-[11px] ${darkMode ? "text-gray-600" : "text-slate-400"}`}>
          <p className="font-medium mb-1">Powered by</p>
          <p>Multi-Agent AI Pipeline</p>
        </div>
      </div>
    </aside>
  );
}