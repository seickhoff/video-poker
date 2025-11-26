// src/context/AppProvider.tsx
import { useState, ReactNode } from "react";
import { AppContext } from "./AppContext";

// AppProvider component that provides the context
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<null | { id: string; name: string }>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <AppContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AppContext.Provider>
  );
};
