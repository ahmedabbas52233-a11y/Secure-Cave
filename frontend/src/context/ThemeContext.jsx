import { createContext, useContext, useState, useEffect } from "react";

export const DARK = {
  bgVoid:    "#060504", bgCave:    "#0a0807", bgStone:   "#0d0b09",
  bgRaised:  "#130f0c", bgElevated:"#1e1610",
  border:    "#2a1f17", borderDim: "#1e1610",
  ember:     "#f97316", emberDim:  "rgba(249,115,22,0.15)",
  textBone:  "#f5ede4", textStone: "#c8b8a8", textAsh:   "#a89880",
  textDust:  "#7a6050", textDark:  "#4a3f35",
};

export const LIGHT = {
  bgVoid:    "#f5f0eb", bgCave:    "#ede6de", bgStone:   "#e4dbd0",
  bgRaised:  "#d9cec1", bgElevated:"#ccc0b0",
  border:    "#b8a898", borderDim: "#ccc0b0",
  ember:     "#c2440a", emberDim:  "rgba(194,68,10,0.1)",
  textBone:  "#1a1208", textStone: "#2e2010", textAsh:   "#4a3420",
  textDust:  "#6a5040", textDark:  "#8a7060",
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("sc_theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sc_theme", theme);
  }, [theme]);

  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");
  const C = theme === "dark" ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={{ theme, toggle, C }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
