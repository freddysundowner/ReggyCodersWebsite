import { useEffect, useState } from "react";

type Theme = "classic" | "navy" | "warm";

const themes: { id: Theme; label: string; color: string }[] = [
  { id: "classic", label: "Classic", color: "#f8f9fc" },
  { id: "navy", label: "Navy", color: "#1e1b4b" },
  { id: "warm", label: "Warm", color: "#f5ead6" },
];

const storageKey = "reggycodas-theme";

function readTheme(): Theme {
  if (typeof window === "undefined") return "classic";
  const stored = window.localStorage.getItem(storageKey);
  return themes.some((theme) => theme.id === stored) ? (stored as Theme) : "classic";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

// Apply before the first React paint when possible, preventing a palette flash.
if (typeof document !== "undefined") applyTheme(readTheme());

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(storageKey, theme);
  }, [theme]);

  return (
    <div className={`theme-switcher ${expanded ? "is-expanded" : ""}`} aria-label="Choose site theme">
      <button
        type="button"
        className="theme-toggle"
        aria-label={expanded ? "Close theme picker" : "Open theme picker"}
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        <span className="theme-swatch" style={{ backgroundColor: themes.find((option) => option.id === theme)?.color }} />
      </button>
      {themes.map((option) => (
        <button
          key={option.id}
          className="theme-option"
          type="button"
          aria-label={`Use ${option.label} theme`}
          aria-pressed={theme === option.id}
          onClick={() => {
            setTheme(option.id);
            setExpanded(false);
          }}
        >
          <span className="theme-swatch" style={{ backgroundColor: option.color }} />
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
}