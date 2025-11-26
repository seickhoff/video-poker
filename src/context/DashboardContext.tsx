import { createContext } from "react";

export type DashboardState = {
  filters: string[];
  setFilters: (filters: string[]) => void;
};

export const DashboardContext = createContext<DashboardState | undefined>(
  undefined
);
