import * as React from "react";

export type FieldControlAction = () => void;

export type FieldControlRegistry = {
  [id: string]: FieldControlAction;
};

export const FieldContext = React.createContext<{
  registerControl: (id: string, action: FieldControlAction) => void;
  unregisterControl: (id: string) => void;
  triggerControl: (id: string) => void;
}>({
  registerControl: () => {},
  unregisterControl: () => {},
  triggerControl: () => {},
});

export const useFieldContext = () => React.useContext(FieldContext);

export const FieldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const registryRef = React.useRef<FieldControlRegistry>({});

  const registerControl = React.useCallback((id: string, action: FieldControlAction) => {
    registryRef.current[id] = action;
  }, []);

  const unregisterControl = React.useCallback((id: string) => {
    delete registryRef.current[id];
  }, []);

  const triggerControl = React.useCallback((id: string) => {
    const action = registryRef.current[id];
    if (action) {
      action();
    }
  }, []);

  const value = React.useMemo(
    () => ({
      registerControl,
      unregisterControl,
      triggerControl,
    }),
    [registerControl, unregisterControl, triggerControl]
  );

  return <FieldContext.Provider value={value}>{children}</FieldContext.Provider>;
};

