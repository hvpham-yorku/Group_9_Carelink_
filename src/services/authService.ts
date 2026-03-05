/**
 * Business logic for authentication and user management.
 * signIn, signOut, signUp, getCurrentUser
 */

import { supabase } from "../lib/supabase";
import type { AuthCredentials } from "../types/auth";

export const authService = {
  async signIn({ email, password }: AuthCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },
};
