import { useState, ReactNode } from "react";
import { DashboardContext } from "./DashboardContext";

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<string[]>([]);

  return (
    <DashboardContext.Provider value={{ filters, setFilters }}>
      {children}
    </DashboardContext.Provider>
  );
};
