/**
 * Business logic for authentication and user management.
 * signIn, signOut, signUp, getCurrentUser
 */

import type { SignUpWithPasswordCredentials } from "@supabase/supabase-js";
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

  async signUp({
    email,
    password,
    firstName,
    lastName,
  }: SignUpWithPasswordCredentials & {
    email: string;
    firstName: string;
    lastName: string;
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from("caregivers")
      .select("*")
      .eq("caregiver_id", userId)
      .single();

    if (error) throw error;
    return data;
  },
};
