"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 10);
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onClose]);

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl
        transition-all duration-300 max-w-xs
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        ${type === "success"
          ? "bg-gray-900 border border-emerald-500/30"
          : "bg-gray-900 border border-rose-500/30"
        }
      `}
    >
      <span className={`text-base flex-shrink-0 ${type === "success" ? "text-emerald-400" : "text-rose-400"}`}>
        {type === "success" ? "✓" : "⚠"}
      </span>
      <p className="text-sm text-gray-200 font-medium">{message}</p>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        className="ml-2 text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0 text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}