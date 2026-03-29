"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

const MOCK_DATA: ApiResponse = {
  factSheet: {
    product_name: "EcoChill Bottle",
    features: ["Leak-proof", "Temperature control", "Eco-friendly"],
    price: 25,
    target_audience: "eco-conscious users",
  },
  finalContent: `BLOG:
## Stay Cool, Stay Green: The EcoChill Bottle Revolution

In a world increasingly aware of its environmental footprint, the EcoChill Bottle emerges as the perfect companion for the eco-conscious consumer. Priced at an accessible $25, this isn't just a water bottle — it's a lifestyle statement.

Crafted with sustainability at its core, the EcoChill Bottle combines three powerful features: leak-proof engineering, advanced temperature control technology, and eco-friendly materials. Whether you're commuting through the city or hiking mountain trails, your beverages stay at the perfect temperature for up to 24 hours.

The leak-proof seal means you can toss it in your bag without a second thought. The double-wall vacuum insulation keeps drinks cold for 24 hours and hot for 12. And because it's made from recycled materials, every sip you take is a small victory for the planet.

Join thousands of eco-conscious users who've already made the switch. The EcoChill Bottle isn't just about staying hydrated — it's about staying committed to a better future.

SOCIAL:
Post 1: 🌿 Meet your new hydration hero. The EcoChill Bottle keeps drinks perfect while keeping the planet happier. Leak-proof. Temperature-controlled. Eco-friendly. All for just $25. #EcoChill #SustainableLiving #HydrationGoals

Post 2: Hot coffee in the morning. Ice-cold water by noon. The EcoChill Bottle handles it all — and it's 100% eco-friendly. Your wallet and the planet will thank you. 💧 Shop now for only $25! #GreenLiving #EcoBottle

Post 3: Why choose between convenience and conscience? 🌍 The EcoChill Bottle is leak-proof, temperature-controlling, and made with eco-friendly materials. Perfect for the conscious consumer. Only $25. Tag a friend who needs this! #EcoConscious #ZeroWaste

EMAIL:
Subject: Introducing EcoChill — Hydration That Cares

Hi there,

We're thrilled to introduce the EcoChill Bottle — the hydration solution designed for people who care about quality AND the planet.

Here's what makes EcoChill special:
✓ Leak-proof design — toss it in your bag, no worries
✓ Temperature control — hot or cold, hours on end  
✓ Eco-friendly materials — because the planet matters

And the best part? It's just $25.

Whether you're at the gym, in the office, or exploring the outdoors, EcoChill is your perfect companion. Join our growing community of eco-conscious users making a difference, one sip at a time.

Ready to make the switch?

Stay cool,
The EcoChill Team`,
  logs: [
    "Research Agent analyzing product specifications...",
    "Gathering market insights for eco-conscious segment...",
    "Copywriter Agent generating blog content...",
    "Social media specialist crafting platform-optimized posts...",
    "Email marketing agent composing teaser campaign...",
    "Quality review agent checking tone and brand alignment...",
    "Final content approved and ready for review.",
  ],
};

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>("factsheet");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [data, setData] = useState<ApiResponse | null>(MOCK_DATA);
  const [loading, setLoading] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const parsedContent = data ? parseContent(data.finalContent) : null;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleRegenerate = async () => {
    setLoading(true);
    setContentVisible(false);
    try {
      const res = await fetch("/api/workflow/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json: ApiResponse = await res.json();
      setTimeout(() => {
        setData(json);
        setContentVisible(true);
        showToast("Content regenerated successfully!", "success");
      }, 300);
    } catch (err) {
      // Fallback to mock for demo
      setTimeout(() => {
        setData(MOCK_DATA);
        setContentVisible(true);
        showToast("Using demo data — connect your API endpoint.", "error");
      }, 1500);
    } finally {
      setTimeout(() => setLoading(false), 1800);
    }
  };
console.log("DATA:", data);
console.log("PARSED:", parsedContent);
  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-500 ${darkMode ? "dark bg-gray-950" : "bg-slate-50"}`}>
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        activeSection={activeSection}
        onSectionChange={(s) => { setActiveSection(s); setSidebarOpen(false); }}
        isOpen={sidebarOpen}
        darkMode={darkMode}
      />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <Header
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(!darkMode)}
          onMenuOpen={() => setSidebarOpen(true)}
          onRegenerate={handleRegenerate}
          loading={loading}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          <div
            className={`transition-all duration-500 ${contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {activeSection === "factsheet" && (
              <FactSheetSection data={data?.factSheet} loading={loading} />
            )}
            {(activeSection === "blog" || activeSection === "social" || activeSection === "email") && (
              <ContentSection
                activeTab={activeSection}
                onTabChange={(t) => setActiveSection(t)}
                content={parsedContent}
                loading={loading}
              />
            )}
            {activeSection === "logs" && (
              <LogsSection logs={data?.logs} loading={loading} />
            )}
          </div>
        </main>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}