import * as React from "react";

export const SwitchGroupContext = React.createContext<{
  value: string[];
  onValueChange: (value: string[]) => void;
  disabled?: boolean;
} | null>(null);

export const useSwitchGroup = () => {
  const context = React.useContext(SwitchGroupContext);
  if (!context) {
    throw new Error("useSwitchGroup must be used within a SwitchGroup");
  }
  return context;
};