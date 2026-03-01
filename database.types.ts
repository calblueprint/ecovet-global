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
    PostgrestVersion: "13.0.5";
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
      invite: {
        Row: {
          email: string | null;
          invite_id: string;
          status: string | null;
          user_group_id: string;
          user_type: string | null;
        };
        Insert: {
          email?: string | null;
          invite_id?: string;
          status?: string | null;
          user_group_id: string;
          user_type?: string | null;
        };
        Update: {
          email?: string | null;
          invite_id?: string;
          status?: string | null;
          user_group_id?: string;
          user_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "invite_user_group_id_fkey";
            columns: ["user_group_id"];
            isOneToOne: false;
            referencedRelation: "user_group";
            referencedColumns: ["user_group_id"];
          },
        ];
      };
      participant_session: {
        Row: {
          created_at: string | null;
          is_finished: boolean | null;
          phase_index: number | null;
          role_id: string | null;
          session_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          is_finished?: boolean | null;
          phase_index?: number | null;
          role_id?: string | null;
          session_id: string;
          user_id?: string;
        };
        Update: {
          created_at?: string | null;
          is_finished?: boolean | null;
          phase_index?: number | null;
          role_id?: string | null;
          session_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "participant_session_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "role";
            referencedColumns: ["role_id"];
          },
          {
            foreignKeyName: "participant_session_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "session";
            referencedColumns: ["session_id"];
          },
          {
            foreignKeyName: "participant_session_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
        ];
      };
      phase: {
        Row: {
          is_finished: boolean | null;
          phase_description: string | null;
          phase_id: string;
          phase_name: string | null;
          phase_number: number | null;
          session_id: string | null;
          template_id: string | null;
        };
        Insert: {
          is_finished?: boolean | null;
          phase_description?: string | null;
          phase_id?: string;
          phase_name?: string | null;
          phase_number?: number | null;
          session_id?: string | null;
          template_id?: string | null;
        };
        Update: {
          is_finished?: boolean | null;
          phase_description?: string | null;
          phase_id?: string;
          phase_name?: string | null;
          phase_number?: number | null;
          session_id?: string | null;
          template_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "phase_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "session";
            referencedColumns: ["session_id"];
          },
          {
            foreignKeyName: "phase_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "template";
            referencedColumns: ["template_id"];
          },
        ];
      };
      profile: {
        Row: {
          country: string | null;
          email: string | null;
          first_name: string | null;
          id: string;
          is_finished: string | null;
          last_name: string | null;
          org_role: string | null;
          phase_id: string | null;
          role_id: string | null;
          session_id: string | null;
          user_group_id: string | null;
          user_type: string | null;
        };
        Insert: {
          country?: string | null;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          is_finished?: string | null;
          last_name?: string | null;
          org_role?: string | null;
          phase_id?: string | null;
          role_id?: string | null;
          session_id?: string | null;
          user_group_id?: string | null;
          user_type?: string | null;
        };
        Update: {
          country?: string | null;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          is_finished?: string | null;
          last_name?: string | null;
          org_role?: string | null;
          phase_id?: string | null;
          role_id?: string | null;
          session_id?: string | null;
          user_group_id?: string | null;
          user_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profile_phase_id_fkey";
            columns: ["phase_id"];
            isOneToOne: false;
            referencedRelation: "phase";
            referencedColumns: ["phase_id"];
          },
          {
            foreignKeyName: "profile_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "role";
            referencedColumns: ["role_id"];
          },
          {
            foreignKeyName: "profile_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "session";
            referencedColumns: ["session_id"];
          },
          {
            foreignKeyName: "profile_user_group_id_fkey";
            columns: ["user_group_id"];
            isOneToOne: false;
            referencedRelation: "user_group";
            referencedColumns: ["user_group_id"];
          },
        ];
      };
      prompt: {
        Row: {
          prompt_id: string;
          prompt_text: string | null;
          prompt_type: Database["public"]["Enums"]["prompt_type"] | null;
          role_phase_id: string | null;
          user_id: string | null;
        };
        Insert: {
          prompt_id?: string;
          prompt_text?: string | null;
          prompt_type?: Database["public"]["Enums"]["prompt_type"] | null;
          role_phase_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          prompt_id?: string;
          prompt_text?: string | null;
          prompt_type?: Database["public"]["Enums"]["prompt_type"] | null;
          role_phase_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "prompt_role_phase_id_fkey";
            columns: ["role_phase_id"];
            isOneToOne: false;
            referencedRelation: "role_phase";
            referencedColumns: ["role_phase_id"];
          },
          {
            foreignKeyName: "prompt_user_id_fkey1";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
        ];
      };
      prompt_option: {
        Row: {
          option_id: string;
          option_text: string | null;
          prompt_id: string;
        };
        Insert: {
          option_id?: string;
          option_text?: string | null;
          prompt_id: string;
        };
        Update: {
          option_id?: string;
          option_text?: string | null;
          prompt_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "prompt_option_prompt_id_fkey";
            columns: ["prompt_id"];
            isOneToOne: false;
            referencedRelation: "prompt";
            referencedColumns: ["prompt_id"];
          },
        ];
      };
      prompt_response: {
        Row: {
          phase_id: string | null;
          prompt_answer: string | null;
          prompt_id: string | null;
          prompt_option_id: string | null;
          prompt_response_id: string;
          session_id: string | null;
          user_id: string;
        };
        Insert: {
          phase_id?: string | null;
          prompt_answer?: string | null;
          prompt_id?: string | null;
          prompt_option_id?: string | null;
          prompt_response_id: string;
          session_id?: string | null;
          user_id?: string;
        };
        Update: {
          phase_id?: string | null;
          prompt_answer?: string | null;
          prompt_id?: string | null;
          prompt_option_id?: string | null;
          prompt_response_id?: string;
          session_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "prompt_response_phase_id_fkey";
            columns: ["phase_id"];
            isOneToOne: false;
            referencedRelation: "phase";
            referencedColumns: ["phase_id"];
          },
          {
            foreignKeyName: "prompt_response_prompt_id_fkey";
            columns: ["prompt_id"];
            isOneToOne: false;
            referencedRelation: "prompt";
            referencedColumns: ["prompt_id"];
          },
          {
            foreignKeyName: "prompt_response_prompt_option_id_fkey";
            columns: ["prompt_option_id"];
            isOneToOne: false;
            referencedRelation: "prompt_option";
            referencedColumns: ["option_id"];
          },
          {
            foreignKeyName: "prompt_response_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "session";
            referencedColumns: ["session_id"];
          },
        ];
      };
      role: {
        Row: {
          role_description: string | null;
          role_id: string;
          role_name: string | null;
          template_id: string;
        };
        Insert: {
          role_description?: string | null;
          role_id?: string;
          role_name?: string | null;
          template_id: string;
        };
        Update: {
          role_description?: string | null;
          role_id?: string;
          role_name?: string | null;
          template_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "roles_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "template";
            referencedColumns: ["template_id"];
          },
        ];
      };
      role_phase: {
        Row: {
          description: string | null;
          phase_id: string;
          role_id: string;
          role_phase_id: string;
        };
        Insert: {
          description?: string | null;
          phase_id: string;
          role_id: string;
          role_phase_id?: string;
        };
        Update: {
          description?: string | null;
          phase_id?: string;
          role_id?: string;
          role_phase_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "role_phase_phase_id_fkey";
            columns: ["phase_id"];
            isOneToOne: false;
            referencedRelation: "phase";
            referencedColumns: ["phase_id"];
          },
          {
            foreignKeyName: "role_phase_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "role";
            referencedColumns: ["role_id"];
          },
        ];
      };
      session: {
        Row: {
          after_action_report_id: string | null;
          is_async: boolean;
          is_finished: boolean | null;
          phase_id: string | null;
          session_id: string;
          session_name: string | null;
          template_id: string | null;
          user_group_id: string | null;
        };
        Insert: {
          after_action_report_id?: string | null;
          is_async?: boolean;
          is_finished?: boolean | null;
          phase_id?: string | null;
          session_id?: string;
          session_name?: string | null;
          template_id?: string | null;
          user_group_id?: string | null;
        };
        Update: {
          after_action_report_id?: string | null;
          is_async?: boolean;
          is_finished?: boolean | null;
          phase_id?: string | null;
          session_id?: string;
          session_name?: string | null;
          template_id?: string | null;
          user_group_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "session_phase_id_fkey";
            columns: ["phase_id"];
            isOneToOne: false;
            referencedRelation: "phase";
            referencedColumns: ["phase_id"];
          },
          {
            foreignKeyName: "session_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "template";
            referencedColumns: ["template_id"];
          },
          {
            foreignKeyName: "session_user_group_id_fkey";
            columns: ["user_group_id"];
            isOneToOne: false;
            referencedRelation: "user_group";
            referencedColumns: ["user_group_id"];
          },
        ];
      };
      tag: {
        Row: {
          color: string | null;
          name: string | null;
          number: number | null;
          tag_id: string;
          user_group_id: string;
        };
        Insert: {
          color?: string | null;
          name?: string | null;
          number?: number | null;
          tag_id?: string;
          user_group_id: string;
        };
        Update: {
          color?: string | null;
          name?: string | null;
          number?: number | null;
          tag_id?: string;
          user_group_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tag_user_group_id_fkey";
            columns: ["user_group_id"];
            isOneToOne: false;
            referencedRelation: "user_group";
            referencedColumns: ["user_group_id"];
          },
        ];
      };
      template: {
        Row: {
          accessible_to_all: boolean | null;
          current_activity: string | null;
          objective: string | null;
          setting: string | null;
          summary: string | null;
          template_id: string;
          template_name: string | null;
          timestamp: string | null;
          user_group_id: string | null;
        };
        Insert: {
          accessible_to_all?: boolean | null;
          current_activity?: string | null;
          objective?: string | null;
          setting?: string | null;
          summary?: string | null;
          template_id?: string;
          template_name?: string | null;
          timestamp?: string | null;
          user_group_id?: string | null;
        };
        Update: {
          accessible_to_all?: boolean | null;
          current_activity?: string | null;
          objective?: string | null;
          setting?: string | null;
          summary?: string | null;
          template_id?: string;
          template_name?: string | null;
          timestamp?: string | null;
          user_group_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "template_user_group_id_fkey";
            columns: ["user_group_id"];
            isOneToOne: false;
            referencedRelation: "user_group";
            referencedColumns: ["user_group_id"];
          },
        ];
      };
      template_tag: {
        Row: {
          tag_id: string;
          template_id: string;
        };
        Insert: {
          tag_id: string;
          template_id: string;
        };
        Update: {
          tag_id?: string;
          template_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "template_tag_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tag";
            referencedColumns: ["tag_id"];
          },
          {
            foreignKeyName: "template_tag_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "template";
            referencedColumns: ["template_id"];
          },
        ];
      };
      user_group: {
        Row: {
          num_users: number | null;
          user_group_id: string;
          user_group_name: string | null;
        };
        Insert: {
          num_users?: number | null;
          user_group_id: string;
          user_group_name?: string | null;
        };
        Update: {
          num_users?: number | null;
          user_group_id?: string;
          user_group_name?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      advance_phase: {
        Args: { p_current_phase_num: number; p_session_id: string };
        Returns: number;
      };
    };
    Enums: {
      prompt_type: "text" | "multiple_choice" | "checkbox";
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
    Enums: {
      prompt_type: ["text", "multiple_choice", "checkbox"],
    },
  },
} as const;
