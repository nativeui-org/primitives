import * as React from "react";

export const ToggleGroupContext = React.createContext<{
  value: string[];
  onValueChange: (value: string[]) => void;
  disabled?: boolean;
} | null>(null);

export const useToggleGroup = () => {
  const context = React.useContext(ToggleGroupContext);
  if (!context) {
    throw new Error("useToggleGroup must be used within a ToggleGroup");
  }
  return context;
};
