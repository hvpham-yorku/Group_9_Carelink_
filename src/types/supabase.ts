export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      allergies: {
        Row: {
          allergy_id: number;
          allergy_name: string;
          patient_id: string;
        };
        Insert: {
          allergy_id?: number;
          allergy_name: string;
          patient_id: string;
        };
        Update: {
          allergy_id?: number;
          allergy_name?: string;
          patient_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "allergies_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["patient_id"];
          },
        ];
      };
      appointments: {
        Row: {
          appointment_id: string;
          caregiver_id: string;
          completed_at: string | null;
          created_at: string | null;
          description: string | null;
          is_completed: boolean | null;
          location: string | null;
          patient_id: string;
          scheduled_at: string | null;
          team_id: string;
          title: string | null;
        };
        Insert: {
          appointment_id?: string;
          caregiver_id: string;
          completed_at?: string | null;
          created_at?: string | null;
          description?: string | null;
          is_completed?: boolean | null;
          location?: string | null;
          patient_id: string;
          scheduled_at?: string | null;
          team_id: string;
          title?: string | null;
        };
        Update: {
          appointment_id?: string;
          caregiver_id?: string;
          completed_at?: string | null;
          created_at?: string | null;
          description?: string | null;
          is_completed?: boolean | null;
          location?: string | null;
          patient_id?: string;
          scheduled_at?: string | null;
          team_id?: string;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_caregiver_id_fkey";
            columns: ["caregiver_id"];
            isOneToOne: false;
            referencedRelation: "caregivers";
            referencedColumns: ["caregiver_id"];
          },
          {
            foreignKeyName: "appointments_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["patient_id"];
          },
          {
            foreignKeyName: "appointments_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["team_id"];
          },
        ];
      };
      caregivers: {
        Row: {
          caregiver_id: string;
          email: string;
          first_name: string;
          job_title: string | null;
          last_name: string;
          phone_number: string | null;
        };
        Insert: {
          caregiver_id?: string;
          email: string;
          first_name: string;
          job_title?: string | null;
          last_name: string;
          phone_number?: string | null;
        };
        Update: {
          caregiver_id?: string;
          email?: string;
          first_name?: string;
          job_title?: string | null;
          last_name?: string;
          phone_number?: string | null;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          category_id: string;
          color: string;
          name: string;
          team_id: string;
        };
        Insert: {
          category_id?: string;
          color: string;
          name: string;
          team_id: string;
        };
        Update: {
          category_id?: string;
          color?: string;
          name?: string;
          team_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categories_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["team_id"];
          },
        ];
      };
      emergency_contacts: {
        Row: {
          contact_id: string;
          name: string;
          patient_id: string;
          phone_number: string | null;
          relationship: string | null;
        };
        Insert: {
          contact_id?: string;
          name: string;
          patient_id: string;
          phone_number?: string | null;
          relationship?: string | null;
        };
        Update: {
          contact_id?: string;
          name?: string;
          patient_id?: string;
          phone_number?: string | null;
          relationship?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["patient_id"];
          },
        ];
      };
      medication_logs: {
        Row: {
          caregiver_id: string;
          is_completed: boolean | null;
          medication_id: string;
          medication_log_id: string;
          scheduled_time: string;
          taken_at: string | null;
        };
        Insert: {
          caregiver_id: string;
          is_completed?: boolean | null;
          medication_id: string;
          medication_log_id?: string;
          scheduled_time: string;
          taken_at?: string | null;
        };
        Update: {
          caregiver_id?: string;
          is_completed?: boolean | null;
          medication_id?: string;
          medication_log_id?: string;
          scheduled_time?: string;
          taken_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "medication_logs_caregiver_id_fkey";
            columns: ["caregiver_id"];
            isOneToOne: false;
            referencedRelation: "caregivers";
            referencedColumns: ["caregiver_id"];
          },
          {
            foreignKeyName: "medication_logs_medication_id_fkey";
            columns: ["medication_id"];
            isOneToOne: false;
            referencedRelation: "medications";
            referencedColumns: ["medication_id"];
          },
        ];
      };
      medication_schedule: {
        Row: {
          medication_id: string;
          schedule_id: string;
          scheduled_at: string | null;
        };
        Insert: {
          medication_id: string;
          schedule_id?: string;
          scheduled_at?: string | null;
        };
        Update: {
          medication_id?: string;
          schedule_id?: string;
          scheduled_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "medication_schedule_medication_id_fkey";
            columns: ["medication_id"];
            isOneToOne: false;
            referencedRelation: "medications";
            referencedColumns: ["medication_id"];
          },
        ];
      };
      medications: {
        Row: {
          dosage: string | null;
          frequency: string | null;
          instructions: string | null;
          is_active: boolean | null;
          medication_id: string;
          name: string | null;
          patient_id: string;
          prescribed_by: string | null;
          purpose: string | null;
          team_id: string;
          warnings: string | null;
        };
        Insert: {
          dosage?: string | null;
          frequency?: string | null;
          instructions?: string | null;
          is_active?: boolean | null;
          medication_id?: string;
          name?: string | null;
          patient_id: string;
          prescribed_by?: string | null;
          purpose?: string | null;
          team_id: string;
          warnings?: string | null;
        };
        Update: {
          dosage?: string | null;
          frequency?: string | null;
          instructions?: string | null;
          is_active?: boolean | null;
          medication_id?: string;
          name?: string | null;
          patient_id?: string;
          prescribed_by?: string | null;
          purpose?: string | null;
          team_id?: string;
          warnings?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "medications_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["patient_id"];
          },
          {
            foreignKeyName: "medications_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["team_id"];
          },
        ];
      };
      notes: {
        Row: {
          caregiver_id: string;
          category_id: string;
          created_at: string | null;
          description: string | null;
          is_urgent: boolean | null;
          note_id: string;
          patient_id: string;
          team_id: string;
          title: string | null;
          updated_at: string | null;
        };
        Insert: {
          caregiver_id: string;
          category_id: string;
          created_at?: string | null;
          description?: string | null;
          is_urgent?: boolean | null;
          note_id?: string;
          patient_id: string;
          team_id: string;
          title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          caregiver_id?: string;
          category_id?: string;
          created_at?: string | null;
          description?: string | null;
          is_urgent?: boolean | null;
          note_id?: string;
          patient_id?: string;
          team_id?: string;
          title?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notes_caregiver_id_fkey";
            columns: ["caregiver_id"];
            isOneToOne: false;
            referencedRelation: "caregivers";
            referencedColumns: ["caregiver_id"];
          },
          {
            foreignKeyName: "notes_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["category_id"];
          },
          {
            foreignKeyName: "notes_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["patient_id"];
          },
          {
            foreignKeyName: "notes_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["team_id"];
          },
        ];
      };
      patient_conditions: {
        Row: {
          condition_id: string;
          condition_name: string;
          is_active: boolean | null;
          patient_id: string;
        };
        Insert: {
          condition_id?: string;
          condition_name: string;
          is_active?: boolean | null;
          patient_id: string;
        };
        Update: {
          condition_id?: string;
          condition_name?: string;
          is_active?: boolean | null;
          patient_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "patient_conditions_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["patient_id"];
          },
        ];
      };
      patients: {
        Row: {
          address: string | null;
          blood_type: string | null;
          care_notes: string | null;
          dietary_requirements: string | null;
          dob: string;
          email: string | null;
          first_name: string;
          gender: string;
          group_number: string | null;
          height: string | null;
          insurance_provider: string | null;
          is_active: boolean;
          last_name: string;
          patient_id: string;
          phone_number: string | null;
          phys_address: string | null;
          phys_name: string | null;
          phys_phone: string | null;
          phys_spec: string | null;
          policy_number: string | null;
          weight: string | null;
        };
        Insert: {
          address?: string | null;
          blood_type?: string | null;
          care_notes?: string | null;
          dietary_requirements?: string | null;
          dob: string;
          email?: string | null;
          first_name: string;
          gender: string;
          group_number?: string | null;
          height?: string | null;
          insurance_provider?: string | null;
          is_active?: boolean;
          last_name: string;
          patient_id?: string;
          phone_number?: string | null;
          phys_address?: string | null;
          phys_name?: string | null;
          phys_phone?: string | null;
          phys_spec?: string | null;
          policy_number?: string | null;
          weight?: string | null;
        };
        Update: {
          address?: string | null;
          blood_type?: string | null;
          care_notes?: string | null;
          dietary_requirements?: string | null;
          dob?: string;
          email?: string | null;
          first_name?: string;
          gender?: string;
          group_number?: string | null;
          height?: string | null;
          insurance_provider?: string | null;
          is_active?: boolean;
          last_name?: string;
          patient_id?: string;
          phone_number?: string | null;
          phys_address?: string | null;
          phys_name?: string | null;
          phys_phone?: string | null;
          phys_spec?: string | null;
          policy_number?: string | null;
          weight?: string | null;
        };
        Relationships: [];
      };
      task_logs: {
        Row: {
          caregiver_id: string;
          completed_at: string | null;
          id: string;
          is_completed: boolean | null;
          task_id: string;
        };
        Insert: {
          caregiver_id: string;
          completed_at?: string | null;
          id?: string;
          is_completed?: boolean | null;
          task_id: string;
        };
        Update: {
          caregiver_id?: string;
          completed_at?: string | null;
          id?: string;
          is_completed?: boolean | null;
          task_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "task_logs_caregiver_id_fkey";
            columns: ["caregiver_id"];
            isOneToOne: false;
            referencedRelation: "caregivers";
            referencedColumns: ["caregiver_id"];
          },
          {
            foreignKeyName: "task_logs_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["task_id"];
          },
        ];
      };
      tasks: {
        Row: {
          category_id: string;
          description: string | null;
          patient_id: string;
          scheduled_at: string | null;
          task_id: string;
          team_id: string;
          title: string | null;
        };
        Insert: {
          category_id: string;
          description?: string | null;
          patient_id: string;
          scheduled_at?: string | null;
          task_id?: string;
          team_id: string;
          title?: string | null;
        };
        Update: {
          category_id?: string;
          description?: string | null;
          patient_id?: string;
          scheduled_at?: string | null;
          task_id?: string;
          team_id?: string;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["category_id"];
          },
          {
            foreignKeyName: "tasks_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["patient_id"];
          },
          {
            foreignKeyName: "tasks_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["team_id"];
          },
        ];
      };
      team_members: {
        Row: {
          caregiver_id: string | null;
          date_assigned: string | null;
          member_id: string;
          patient_id: string | null;
          role: string | null;
          team_id: string | null;
        };
        Insert: {
          caregiver_id?: string | null;
          date_assigned?: string | null;
          member_id?: string;
          patient_id?: string | null;
          role?: string | null;
          team_id?: string | null;
        };
        Update: {
          caregiver_id?: string | null;
          date_assigned?: string | null;
          member_id?: string;
          patient_id?: string | null;
          role?: string | null;
          team_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "team_members_caregiver_id_fkey";
            columns: ["caregiver_id"];
            isOneToOne: false;
            referencedRelation: "caregivers";
            referencedColumns: ["caregiver_id"];
          },
          {
            foreignKeyName: "team_members_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["patient_id"];
          },
          {
            foreignKeyName: "team_members_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["team_id"];
          },
        ];
      };
      teams: {
        Row: {
          join_code: string;
          team_id: string;
          team_name: string;
        };
        Insert: {
          join_code: string;
          team_id?: string;
          team_name: string;
        };
        Update: {
          join_code?: string;
          team_id?: string;
          team_name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_patient_to_team: {
        Args: {
          p_dob: string;
          p_first_name: string;
          p_gender: string;
          p_last_name: string;
          p_team_id: string;
        };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
