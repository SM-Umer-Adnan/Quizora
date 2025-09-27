import {
  ReactNode,
  useContext,
  useEffect,
  useState,
  createContext,
} from "react";

type ThemeType = "dark" | "light";

interface ThemeContextInterface {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeProviderContext = createContext<ThemeContextInterface | undefined>(
  undefined,
);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {

  const storedTheme = localStorage.getItem("askme-ui-theme") as ThemeType | null;
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [theme, setTheme] = useState<ThemeType>(
    storedTheme ?? (prefersDark ? "dark" : "light"),
  );

  useEffect(() => {
    localStorage.setItem("askme-ui-theme", theme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const syncTheme = (e: StorageEvent) => {
      if (e.key === "askme-ui-theme" && e.newValue) {
        setTheme(e.newValue as ThemeType);
      }
    };
    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, []);

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {}
      <div className="transition-colors duration-300 ease-in-out">
        {children}
      </div>
    </ThemeProviderContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context)
    throw new Error("useTheme must be used within the boundary of ThemeProvider!");
  return context;
};