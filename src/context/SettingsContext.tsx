import { createContext, useContext, useState, ReactNode } from "react";

export interface HighlightRule {
  id: string;
  days: number;
  color: string;
  label: string;
}

interface SettingsContextValue {
  rules: HighlightRule[];
  setRules: (rules: HighlightRule[]) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  rules: [],
  setRules: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [rules, setRules] = useState<HighlightRule[]>([
    { id: "1", days: 3, color: "#fef08a", label: "Скоро поставка" },
    { id: "2", days: 1, color: "#fca5a5", label: "Срочно" },
  ]);

  return (
    <SettingsContext.Provider value={{ rules, setRules }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
