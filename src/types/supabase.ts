export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointmentId: string
          caregiverId: string
          careTeamId: string
          completedTime: string | null
          description: string | null
          patientId: string
          scheduledAt: string
        }
        Insert: {
          appointmentId?: string
          caregiverId: string
          careTeamId: string
          completedTime?: string | null
          description?: string | null
          patientId: string
          scheduledAt: string
        }
        Update: {
          appointmentId?: string
          caregiverId?: string
          careTeamId?: string
          completedTime?: string | null
          description?: string | null
          patientId?: string
          scheduledAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_caregiverId_fkey"
            columns: ["caregiverId"]
            isOneToOne: false
            referencedRelation: "caregivers"
            referencedColumns: ["caregiverId"]
          },
          {
            foreignKeyName: "appointments_careTeamId_fkey"
            columns: ["careTeamId"]
            isOneToOne: false
            referencedRelation: "careTeams"
            referencedColumns: ["careTeamId"]
          },
          {
            foreignKeyName: "appointments_patientId_fkey"
            columns: ["patientId"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["patientId"]
          },
        ]
      }
      caregivers: {
        Row: {
          caregiverId: string
          email: string
          firstName: string | null
          jobTitle: string | null
          lastName: string | null
          phoneNumber: string | null
        }
        Insert: {
          caregiverId?: string
          email: string
          firstName?: string | null
          jobTitle?: string | null
          lastName?: string | null
          phoneNumber?: string | null
        }
        Update: {
          caregiverId?: string
          email?: string
          firstName?: string | null
          jobTitle?: string | null
          lastName?: string | null
          phoneNumber?: string | null
        }
        Relationships: []
      }
      careTeamMembers: {
        Row: {
          caregiverId: string | null
          careTeamId: string
          dateAssigned: string | null
          membershipId: string
          patientId: string | null
          role: string | null
        }
        Insert: {
          caregiverId?: string | null
          careTeamId: string
          dateAssigned?: string | null
          membershipId?: string
          patientId?: string | null
          role?: string | null
        }
        Update: {
          caregiverId?: string | null
          careTeamId?: string
          dateAssigned?: string | null
          membershipId?: string
          patientId?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "careteammembers_caregiverid_fkey"
            columns: ["caregiverId"]
            isOneToOne: false
            referencedRelation: "caregivers"
            referencedColumns: ["caregiverId"]
          },
          {
            foreignKeyName: "careteammembers_careteamid_fkey"
            columns: ["careTeamId"]
            isOneToOne: false
            referencedRelation: "careTeams"
            referencedColumns: ["careTeamId"]
          },
          {
            foreignKeyName: "careteammembers_patientid_fkey"
            columns: ["patientId"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["patientId"]
          },
        ]
      }
      careTeams: {
        Row: {
          careTeamId: string
          joinCode: string | null
          teamName: string | null
        }
        Insert: {
          careTeamId?: string
          joinCode?: string | null
          teamName?: string | null
        }
        Update: {
          careTeamId?: string
          joinCode?: string | null
          teamName?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          careTeamId: string
          categoryId: string
          name: string
        }
        Insert: {
          careTeamId: string
          categoryId?: string
          name: string
        }
        Update: {
          careTeamId?: string
          categoryId?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_careTeamId_fkey"
            columns: ["careTeamId"]
            isOneToOne: false
            referencedRelation: "careTeams"
            referencedColumns: ["careTeamId"]
          },
        ]
      }
      medicationLogs: {
        Row: {
          caregiverId: string | null
          isCompleted: boolean
          medicationLogId: string
          prescriptionId: string | null
          takenAt: string | null
        }
        Insert: {
          caregiverId?: string | null
          isCompleted?: boolean
          medicationLogId?: string
          prescriptionId?: string | null
          takenAt?: string | null
        }
        Update: {
          caregiverId?: string | null
          isCompleted?: boolean
          medicationLogId?: string
          prescriptionId?: string | null
          takenAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medicationLogs_caregiverId_fkey"
            columns: ["caregiverId"]
            isOneToOne: false
            referencedRelation: "caregivers"
            referencedColumns: ["caregiverId"]
          },
          {
            foreignKeyName: "medicationLogs_prescriptionId_fkey"
            columns: ["prescriptionId"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["prescriptionId"]
          },
        ]
      }
      notes: {
        Row: {
          caregiverId: string
          careTeamId: string
          categoryId: string
          createdAt: string | null
          description: string | null
          noteId: string
          patientId: string
          title: string | null
          updatedAt: string | null
        }
        Insert: {
          caregiverId: string
          careTeamId: string
          categoryId: string
          createdAt?: string | null
          description?: string | null
          noteId?: string
          patientId: string
          title?: string | null
          updatedAt?: string | null
        }
        Update: {
          caregiverId?: string
          careTeamId?: string
          categoryId?: string
          createdAt?: string | null
          description?: string | null
          noteId?: string
          patientId?: string
          title?: string | null
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_caregiverId_fkey"
            columns: ["caregiverId"]
            isOneToOne: false
            referencedRelation: "caregivers"
            referencedColumns: ["caregiverId"]
          },
          {
            foreignKeyName: "notes_careTeamId_fkey"
            columns: ["careTeamId"]
            isOneToOne: false
            referencedRelation: "careTeams"
            referencedColumns: ["careTeamId"]
          },
          {
            foreignKeyName: "notes_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["categoryId"]
          },
          {
            foreignKeyName: "notes_patientId_fkey"
            columns: ["patientId"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["patientId"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          dob: string
          firstName: string
          lastName: string
          patientId: string
          phoneNumber: string | null
        }
        Insert: {
          address?: string | null
          dob: string
          firstName: string
          lastName: string
          patientId?: string
          phoneNumber?: string | null
        }
        Update: {
          address?: string | null
          dob?: string
          firstName?: string
          lastName?: string
          patientId?: string
          phoneNumber?: string | null
        }
        Relationships: []
      }
      prescriptions: {
        Row: {
          careTeamId: string
          dosage: string
          frequency: string | null
          isActive: boolean
          name: string
          patientId: string
          prescriptionId: string
          scheduledAt: string | null
        }
        Insert: {
          careTeamId: string
          dosage: string
          frequency?: string | null
          isActive?: boolean
          name: string
          patientId: string
          prescriptionId?: string
          scheduledAt?: string | null
        }
        Update: {
          careTeamId?: string
          dosage?: string
          frequency?: string | null
          isActive?: boolean
          name?: string
          patientId?: string
          prescriptionId?: string
          scheduledAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_careTeamId_fkey"
            columns: ["careTeamId"]
            isOneToOne: false
            referencedRelation: "careTeams"
            referencedColumns: ["careTeamId"]
          },
          {
            foreignKeyName: "prescriptions_patientId_fkey"
            columns: ["patientId"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["patientId"]
          },
        ]
      }
      taskLogs: {
        Row: {
          caregiverId: string | null
          completedAt: string | null
          isCompleted: boolean
          taskId: string | null
          taskLogId: string
        }
        Insert: {
          caregiverId?: string | null
          completedAt?: string | null
          isCompleted?: boolean
          taskId?: string | null
          taskLogId?: string
        }
        Update: {
          caregiverId?: string | null
          completedAt?: string | null
          isCompleted?: boolean
          taskId?: string | null
          taskLogId?: string
        }
        Relationships: [
          {
            foreignKeyName: "taskLogs_caregiverId_fkey"
            columns: ["caregiverId"]
            isOneToOne: false
            referencedRelation: "caregivers"
            referencedColumns: ["caregiverId"]
          },
          {
            foreignKeyName: "taskLogs_taskId_fkey"
            columns: ["taskId"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["taskId"]
          },
        ]
      }
      tasks: {
        Row: {
          careTeamId: string
          categoryId: string | null
          description: string | null
          patientId: string
          scheduledAt: string | null
          taskId: string
          title: string | null
        }
        Insert: {
          careTeamId: string
          categoryId?: string | null
          description?: string | null
          patientId: string
          scheduledAt?: string | null
          taskId?: string
          title?: string | null
        }
        Update: {
          careTeamId?: string
          categoryId?: string | null
          description?: string | null
          patientId?: string
          scheduledAt?: string | null
          taskId?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_careTeamId_fkey"
            columns: ["careTeamId"]
            isOneToOne: false
            referencedRelation: "careTeams"
            referencedColumns: ["careTeamId"]
          },
          {
            foreignKeyName: "tasks_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["categoryId"]
          },
          {
            foreignKeyName: "tasks_patientId_fkey"
            columns: ["patientId"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["patientId"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_patient_to_team:
        | {
            Args: {
              p_dob: string
              p_first_name: string
              p_last_name: string
              p_team_id: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_address?: string
              p_dob: string
              p_first_name: string
              p_last_name: string
              p_phone_number?: string
              p_team_id: string
            }
            Returns: Json
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
