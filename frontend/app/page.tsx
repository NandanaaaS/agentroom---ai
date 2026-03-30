"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import FactSheetSection from "@/components/FactSheetSection";
import ContentSection from "@/components/ContentSection";
import LogsSection from "@/components/LogsSection";
import Toast from "@/components/Toast";
import { parseContent, ContentData } from "@/lib/parseContent";

export type Section = "factsheet" | "blog" | "social" | "email" | "logs";

export interface ApiResponse {
  factSheet: {
    product_name: string;
    features: string[];
    price: number;
    target_audience: string;
  };
  finalContent: string;
  logs: string[];
}

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "funny", label: "Funny" },
  { value: "inspirational", label: "Inspirational" },
];

// --- Input modal (Your Original Styling) ---
interface InputModalProps {
  onSubmit: (content: string, tone: string) => void;
  onClose: () => void;
  darkMode: boolean;
  initialContent: string;
  initialTone: string;
}

function InputModal({ onSubmit, onClose, darkMode, initialContent, initialTone }: InputModalProps) {
  const [content, setContent] = useState(initialContent);
  const [tone, setTone] = useState(initialTone);
  const isEmpty = content.trim().length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`relative w-full max-w-lg mx-4 rounded-2xl shadow-2xl p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Generate Campaign</h2>
        <label className="block mb-1 text-sm font-medium opacity-70">Product / Idea description</label>
        <textarea
          className={`w-full h-36 rounded-xl border p-3 text-sm resize-none focus:outline-none focus:ring-2 transition ${
            darkMode ? "bg-gray-800 border-gray-700 focus:ring-indigo-500" : "bg-slate-50 border-slate-300 focus:ring-indigo-400"
          }`}
          placeholder="Describe your product/idea here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <label className="block mt-4 mb-1 text-sm font-medium opacity-70">Tone</label>
        <div className="flex gap-2 flex-wrap">
          {TONE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTone(opt.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                tone === opt.value
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : darkMode
                  ? "border-gray-600 text-gray-300 hover:border-indigo-400"
                  : "border-slate-300 text-slate-600 hover:border-indigo-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${darkMode ? "text-gray-400 hover:text-white" : "text-slate-500 hover:text-slate-800"}`}>
            Cancel
          </button>
          <button
            disabled={isEmpty}
            onClick={() => !isEmpty && onSubmit(content.trim(), tone)}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Generate ✨
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Persistent input panel (Your Original Styling) ---
interface InputPanelProps {
  content: string;
  tone: string;
  setContent: (v: string) => void;
  setTone: (v: string) => void;
  onGenerate: () => void;
  darkMode: boolean;
}

function InputPanel({ content, tone, setContent, setTone, onGenerate, darkMode }: InputPanelProps) {
  return (
    <div className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800">
      <label className="block mb-2 font-medium opacity-80">Product / Idea description</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700`}
        placeholder="Describe your product/idea here..."
      />
      <label className="block mt-4 mb-2 font-medium opacity-80">Tone</label>
      <div className="flex gap-2 flex-wrap">
        {TONE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setTone(opt.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              tone === opt.value
                ? "bg-indigo-600 border-indigo-600 text-white"
                : darkMode
                ? "border-gray-600 text-gray-300 hover:border-indigo-400"
                : "border-gray-300 text-gray-600 hover:border-indigo-400"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <button onClick={onGenerate} className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition">
          Generate ✨
        </button>
      </div>
    </div>
  );
}

// --- Main Dashboard ---
export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>("factsheet");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  // FIX: Start with null so mock data doesn't override your input
  const [data, setData] = useState<ApiResponse | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [lastContent, setLastContent] = useState("");
  const [lastTone, setLastTone] = useState("professional");

  const parsedContent: ContentData | null = data ? parseContent(data.finalContent) : null;

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleGenerate = useCallback(
    async (content: string, tone: string) => {
      setShowModal(false);
      setLastContent(content);
      setLastTone(tone);
      setLoading(true);
      setContentVisible(false);

      try {
        // FIX: Call local next.js proxy to avoid 401/CORS
        const res = await fetch("/api/workflow/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, tone }),
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          throw new Error(errJson.error ?? `HTTP ${res.status}`);
        }

        const json: ApiResponse = await res.json();

        setTimeout(() => {
          setData(json);
          setContentVisible(true);
          setActiveSection("factsheet");
          showToast("Campaign generated successfully! 🎉", "success");
          setLoading(false);
        }, 300);
      } catch (err: any) {
        console.error("[generate]", err);
        setTimeout(() => {
          setContentVisible(true);
          showToast(err.message, "error");
          setLoading(false);
        }, 300);
      }
    },
    [showToast]
  );

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-500 ${darkMode ? "dark bg-gray-950" : "bg-slate-50"}`}>
      {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <Sidebar activeSection={activeSection} onSectionChange={(s) => { setActiveSection(s); setSidebarOpen(false); }} isOpen={sidebarOpen} darkMode={darkMode} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <Header darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)} onMenuOpen={() => setSidebarOpen(true)} onRegenerate={() => setShowModal(true)} loading={loading} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          <InputPanel
            content={lastContent}
            tone={lastTone}
            setContent={setLastContent}
            setTone={setLastTone}
            onGenerate={() => handleGenerate(lastContent, lastTone)}
            darkMode={darkMode}
          />

          <div className={`transition-all duration-500 ${contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {!data && !loading ? (
               <div className="py-20 text-center opacity-30">
                  <p className="text-xl font-medium">Input product details to begin</p>
               </div>
            ) : (
              <>
                {activeSection === "factsheet" && <FactSheetSection data={data?.factSheet} loading={loading} />}
                {(activeSection === "blog" || activeSection === "social" || activeSection === "email") && (
                  <ContentSection activeTab={activeSection} onTabChange={setActiveSection} content={parsedContent} loading={loading} />
                )}
                {activeSection === "logs" && <LogsSection logs={data?.logs} loading={loading} />}
              </>
            )}
          </div>
        </main>
      </div>

      {showModal && <InputModal darkMode={darkMode} initialContent={lastContent} initialTone={lastTone} onClose={() => setShowModal(false)} onSubmit={handleGenerate} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}