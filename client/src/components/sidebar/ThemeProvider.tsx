import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
type AccentColor = "blue" | "gold" | "purple" | "emerald" | "rose";

interface ThemeContextType {
  theme: Theme;
  accentColor: AccentColor;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const accentColorsConfig: Record<AccentColor, { light: { primary: string; ring: string }; dark: { primary: string; ring: string } }> = {
  blue: { 
    light: { primary: "217 91% 50%", ring: "217 91% 50%" },
    dark: { primary: "217 91% 60%", ring: "217 91% 60%" }
  },
  gold: { 
    light: { primary: "43 96% 45%", ring: "43 96% 45%" },
    dark: { primary: "43 96% 56%", ring: "43 96% 56%" }
  },
  purple: { 
    light: { primary: "262 83% 50%", ring: "262 83% 50%" },
    dark: { primary: "262 83% 58%", ring: "262 83% 58%" }
  },
  emerald: { 
    light: { primary: "160 84% 32%", ring: "160 84% 32%" },
    dark: { primary: "160 84% 39%", ring: "160 84% 39%" }
  },
  rose: { 
    light: { primary: "346 77% 45%", ring: "346 77% 45%" },
    dark: { primary: "346 77% 50%", ring: "346 77% 50%" }
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bossai-theme") as Theme;
      if (stored) return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "dark";
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bossai-accent") as AccentColor;
      if (stored && accentColorsConfig[stored]) return stored;
    }
    return "blue";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("bossai-theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const colors = accentColorsConfig[accentColor][theme];
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--ring", colors.ring);
    localStorage.setItem("bossai-accent", accentColor);
  }, [accentColor, theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, accentColor, setTheme, setAccentColor, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export const ACCENT_COLORS: { id: AccentColor; name: string; color: string }[] = [
  { id: "blue", name: "Blue", color: "hsl(217, 91%, 60%)" },
  { id: "gold", name: "Gold", color: "hsl(43, 96%, 56%)" },
  { id: "purple", name: "Purple", color: "hsl(262, 83%, 58%)" },
  { id: "emerald", name: "Emerald", color: "hsl(160, 84%, 39%)" },
  { id: "rose", name: "Rose", color: "hsl(346, 77%, 50%)" },
];
