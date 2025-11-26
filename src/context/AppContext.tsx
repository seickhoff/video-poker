// src/context/AppContext.tsx
import { createContext } from "react";

// Type for User
export type User = { id: string; name: string } | null;

// Type for the state
export type AppState = {
  user: User;
  setUser: (user: User) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

// Context declaration
export const AppContext = createContext<AppState | undefined>(undefined);
