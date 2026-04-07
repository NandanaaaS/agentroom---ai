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
    price: string;
    target_audience: string;
    value_proposition?: string;
    ambiguities?: string[];
  };
  finalContent: string;
  logs: { message: string; time: string }[];
}

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "funny", label: "Funny" },
  { value: "inspirational", label: "Inspirational" },
];

// --- Input modal (Updated for consistency) ---
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

// --- Persistent input panel (Modified to support File Upload + Normal Text) ---
interface InputPanelProps {
  content: string;
  tone: string;
  setContent: (v: string) => void;
  setTone: (v: string) => void;
  onGenerate: () => void;
  darkMode: boolean;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

function InputPanel({ content, tone, setContent, setTone, onGenerate, darkMode, selectedFile, setSelectedFile }: InputPanelProps) {
  return (
    <div className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800">
      <label className="block mb-2 font-medium opacity-80">Product / Idea description</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700`}
        placeholder="Describe your product/idea here or upload a supporting document..."
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

      <div className="flex items-center justify-between mt-6 border-t dark:border-gray-800 pt-4">
        <div className="flex items-center gap-3">
          <label className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition ${
            darkMode ? "border-gray-700 hover:bg-gray-800 text-gray-300" : "border-slate-200 hover:bg-slate-50 text-slate-600"
          }`}>
            <span>📎 {selectedFile ? "Change File" : "Add PDF/Image"}</span>
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} 
            />
          </label>
          {selectedFile && (
            <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium truncate max-w-[150px]">
                {selectedFile.name}
              </span>
              <button 
                onClick={() => setSelectedFile(null)}
                className="text-amber-600 dark:text-amber-400 hover:text-rose-500 transition-colors"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <button 
          onClick={onGenerate} 
          disabled={!content.trim() && !selectedFile}
          className="px-6 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20"
        >
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [data, setData] = useState<ApiResponse>({
    factSheet: null as any,
    finalContent: "",
    logs: [],
  });  
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
    setData({
      factSheet: null as any,
      finalContent: "",
      logs: [],
    });
    setShowModal(false);
    setLastContent(content);
    setLastTone(tone);
    setLoading(true);
    //setContentVisible(false);
    setActiveSection("logs");

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("tone", tone);
      if (selectedFile) formData.append("file", selectedFile);

      const res = await fetch("http://127.0.0.1:5000/api/workflow/start-stream", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BACKEND_API_KEY}`,
      },
      body: formData,
    });

      if (!res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let factSheet: any = null;
      let finalContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (let line of lines) {
          if (!line.startsWith("data:")) continue;

          const json = JSON.parse(line.replace("data:", "").trim());

          if (json.type === "log") {
            const message = json.message || "Processing step...";

            const time = new Date().toLocaleTimeString();

            setData((prev: any) => {
            const newLogs = [...(prev.logs || []), { message, time }];

            return {
              ...prev,
              logs: newLogs,
            };
          });
          }

          if (json.type === "factsheet") {
            factSheet = json.data;
            setData((prev: any) => ({
              ...prev,
              factSheet,
              finalContent
            }));
            setActiveSection("factsheet");
          }

          if (json.type === "draft") {
            setData((prev: any) => ({
              ...prev,
              finalContent: (prev?.finalContent || "") + json.data,
              logs: prev?.logs || [],
              factSheet: prev?.factSheet || factSheet,
            }));
          }

          if (json.type === "final") {
            finalContent = json.data;
            setData((prev: any) => ({
              ...prev,
              factSheet,
              finalContent,
            }));

            setLoading(false);
            //setContentVisible(true);
            showToast("Campaign generated 🚀", "success");
          }

          if (json.type === "error") {
            throw new Error(json.message);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message, "error");
      setLoading(false);
      setContentVisible(true);
    }
  },
  [selectedFile, showToast]
);

  return (
  <div className={`min-h-screen flex font-sans transition-colors duration-500 ${darkMode ? "dark bg-gray-950" : "bg-slate-50"}`}>
    
    {sidebarOpen && (
      <div
        className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    <Sidebar
      activeSection={activeSection}
      onSectionChange={(s) => {
        setActiveSection(s);
        setSidebarOpen(false);
      }}
      isOpen={sidebarOpen}
      darkMode={darkMode}
    />

    <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
      <Header
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
        onMenuOpen={() => setSidebarOpen(true)}
        onRegenerate={() => setShowModal(true)}
        loading={loading}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
        <InputPanel
          content={lastContent}
          tone={lastTone}
          setContent={setLastContent}
          setTone={setLastTone}
          onGenerate={() => handleGenerate(lastContent, lastTone)}
          darkMode={darkMode}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />

        <div className={`transition-all duration-500 ${contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          
          {loading && (
            <LogsSection logs={data?.logs} loading={loading} />
          )}

          {!loading && (
            <>
              {activeSection === "factsheet" && (
                <FactSheetSection data={data?.factSheet} loading={loading} />
              )}

              {(activeSection === "blog" ||
                activeSection === "social" ||
                activeSection === "email") && (
                <ContentSection
                  activeTab={activeSection}
                  onTabChange={setActiveSection}
                  content={parsedContent}
                  loading={loading}
                />
              )}

              {activeSection === "logs" && (
                <LogsSection logs={data?.logs} loading={loading} />
              )}
            </>
          )}
        </div>
      </main>
    </div>

    {/* ✅ MODAL + TOAST INSIDE ROOT */}
    {showModal && (
      <InputModal
        darkMode={darkMode}
        initialContent={lastContent}
        initialTone={lastTone}
        onClose={() => setShowModal(false)}
        onSubmit={handleGenerate}
      />
    )}

    {toast && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    )}
  </div>
);
}