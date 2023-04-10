import { useFetcher } from "@remix-run/react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

enum Theme {
  DARK = "forest",
  LIGHT = "garden",
}
const themes: Array<Theme> = Object.values(Theme);

type ThemeContextType = [Theme | null, Dispatch<SetStateAction<Theme | null>>];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({
  children,
  specifiedTheme,
}: {
  children: ReactNode;
  specifiedTheme: Theme | null;
}) {
  const [theme, setTheme] = useState<Theme | null>(() => {
    // On the server, if we don't have a specified theme then we should
    // return null and the clientThemeCode will set the theme for us
    // before hydration. Then (during hydration), this code will get the same
    // value that clientThemeCode got so hydration is happy.
    if (specifiedTheme) {
      if (themes.includes(specifiedTheme)) {
        return specifiedTheme;
      } else {
        return null;
      }
    }

    // there's no way for us to know what the theme should be in this context
    // the client will have to figure it out before hydration.
    if (typeof document === "undefined") {
      return null;
    }

    return specifiedTheme;
  });

  const persistTheme = useFetcher();
  // TODO: remove this when persistTheme is memoized properly
  const persistThemeRef = useRef(persistTheme);
  useEffect(() => {
    persistThemeRef.current = persistTheme;
  }, [persistTheme]);

  const mountRun = useRef(false);

  useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true;
      return;
    }
    if (!theme) {
      return;
    }

    persistThemeRef.current.submit(
      { theme },
      { action: "action/set-theme", method: "post" }
    );
  }, [theme]);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && themes.includes(value as Theme);
}

export {
  isTheme,
  Theme,
  ThemeProvider,
  useTheme,
};