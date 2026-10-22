import { useEffect, useState } from "react";

const themes = [
  { id: "ivory", label: "Ivory" },
  { id: "evening", label: "Evening" },
  { id: "paper", label: "Paper" },
] as const;

type ThemeId = (typeof themes)[number]["id"];

function readTheme(): ThemeId {
  const saved = localStorage.getItem("style-preview");
  if (saved === "evening" || saved === "paper" || saved === "ivory") return saved;
  return "ivory";
}

export function StylePreview() {
  const [theme, setTheme] = useState<ThemeId>(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme === "ivory" ? "" : theme;
    localStorage.setItem("style-preview", theme);
  }, [theme]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-center text-sm text-muted sm:text-left">
          Style preview. This bar goes away once you pick one.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={theme === item.id}
              className={`min-h-11 px-3 text-sm ${
                theme === item.id
                  ? "bg-ink text-ivory"
                  : "border border-line text-ink"
              }`}
              onClick={() => setTheme(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
