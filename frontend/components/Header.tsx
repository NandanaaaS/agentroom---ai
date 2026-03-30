"use client";

interface HeaderProps {
  darkMode: boolean;
  onToggleDark: () => void;
  onMenuOpen: () => void;
  onRegenerate: () => void;
  loading: boolean;
}

export default function Header({ darkMode, onToggleDark, onMenuOpen, onRegenerate, loading }: HeaderProps) {
  return (
    <header
      className={`
        sticky top-0 z-10 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4
        backdrop-blur-md border-b transition-colors duration-300
        ${darkMode
          ? "bg-gray-950/80 border-gray-800"
          : "bg-white/80 border-slate-200"}
      `}
    >
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className={`lg:hidden p-2 rounded-lg transition-colors ${darkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 className={`text-sm sm:text-base font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
            AI Content Generator
          </h1>
          <p className={`text-[11px] hidden sm:block ${darkMode ? "text-gray-400" : "text-slate-500"}`}>
            Multi-agent pipeline dashboard
          </p>
        </div>
      </div>

      {/* Right: dark mode + regenerate */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className={`
            relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0
            ${darkMode ? "bg-amber-500" : "bg-slate-300"}
          `}
          aria-label="Toggle dark mode"
        >
          <span
            className={`
              absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all duration-300 flex items-center justify-center text-[10px]
              ${darkMode ? "translate-x-6 bg-gray-900" : "translate-x-0.5 bg-white"}
            `}
          >
            {darkMode ? "🌙" : "☀️"}
          </span>
        </button>

        {/* Regenerate button */}
        <button
          onClick={onRegenerate}
          disabled={loading}
          className={`
            relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
            transition-all duration-200 overflow-hidden
            ${loading
              ? "opacity-70 cursor-not-allowed"
              : "hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            }
            bg-gradient-to-r from-amber-500 to-orange-500 text-white
            shadow-md shadow-amber-500/25
          `}
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span className="hidden sm:inline">Generating...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Regenerate</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}