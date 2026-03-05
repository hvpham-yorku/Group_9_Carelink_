/**
 * Listens for supabase auth state changes and broadcasts that info to the app
 */
import { createContext } from "react";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
