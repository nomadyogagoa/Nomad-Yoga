"use client";

import { useEffect, useState } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"sunrise" | "candlelight">("sunrise");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("nomad-theme") as "sunrise" | "candlelight" | null;
    const initial = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "candlelight" : "sunrise");
    setTheme(initial);
    if (initial === "candlelight") {
      document.documentElement.setAttribute("data-theme", "candlelight");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "sunrise" ? "candlelight" : "sunrise";
    setTheme(next);
    document.documentElement.classList.add("theme-transitioning");
    if (next === "candlelight") {
      document.documentElement.setAttribute("data-theme", "candlelight");
      localStorage.setItem("nomad-theme", "candlelight");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("nomad-theme", "sunrise");
    }
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 400);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className={`theme-toggle-btn ${className}`}
        aria-label="Toggle Candlelight Mode"
      >
        <span className="theme-toggle-icon">🕯</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${theme === "candlelight" ? "is-candlelight" : ""} ${className}`}
      aria-label={`Switch to ${theme === "sunrise" ? "Candlelight" : "Sunrise"} mode`}
      title={`Switch to ${theme === "sunrise" ? "Candlelight Mode (Evening)" : "Sunrise Mode (Day)"}`}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {theme === "sunrise" ? "🕯" : "☀"}
      </span>
      <span className="theme-toggle-label">
        {theme === "sunrise" ? "Candlelight" : "Sunrise"}
      </span>
    </button>
  );
}
