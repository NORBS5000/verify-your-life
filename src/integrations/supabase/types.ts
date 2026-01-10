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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      loan_applications: {
        Row: {
          age: number | null
          asset_pictures_urls: string[] | null
          asset_valuation_score: number | null
          bank_statement_url: string | null
          behavior_risk_score: number | null
          business_photo_url: string | null
          call_log_url: string | null
          composite_score: number | null
          cova_cost: number | null
          created_at: string
          date_of_birth: string | null
          drug_image_url: string | null
          full_name: string | null
          guarantor1_id_url: string | null
          guarantor1_phone: string | null
          guarantor2_id_url: string | null
          guarantor2_phone: string | null
          has_business: boolean | null
          home_photo_url: string | null
          id: string
          id_number: string | null
          logbook_url: string | null
          medical_needs_score: number | null
          medical_prescription_url: string | null
          mpesa_statement_url: string | null
          phone_number: string | null
          profession: string | null
          retail_cost: number | null
          selected_collateral: string[] | null
          sex: string | null
          status: string | null
          tin_number: string | null
          title_deed_url: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          age?: number | null
          asset_pictures_urls?: string[] | null
          asset_valuation_score?: number | null
          bank_statement_url?: string | null
          behavior_risk_score?: number | null
          business_photo_url?: string | null
          call_log_url?: string | null
          composite_score?: number | null
          cova_cost?: number | null
          created_at?: string
          date_of_birth?: string | null
          drug_image_url?: string | null
          full_name?: string | null
          guarantor1_id_url?: string | null
          guarantor1_phone?: string | null
          guarantor2_id_url?: string | null
          guarantor2_phone?: string | null
          has_business?: boolean | null
          home_photo_url?: string | null
          id?: string
          id_number?: string | null
          logbook_url?: string | null
          medical_needs_score?: number | null
          medical_prescription_url?: string | null
          mpesa_statement_url?: string | null
          phone_number?: string | null
          profession?: string | null
          retail_cost?: number | null
          selected_collateral?: string[] | null
          sex?: string | null
          status?: string | null
          tin_number?: string | null
          title_deed_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          age?: number | null
          asset_pictures_urls?: string[] | null
          asset_valuation_score?: number | null
          bank_statement_url?: string | null
          behavior_risk_score?: number | null
          business_photo_url?: string | null
          call_log_url?: string | null
          composite_score?: number | null
          cova_cost?: number | null
          created_at?: string
          date_of_birth?: string | null
          drug_image_url?: string | null
          full_name?: string | null
          guarantor1_id_url?: string | null
          guarantor1_phone?: string | null
          guarantor2_id_url?: string | null
          guarantor2_phone?: string | null
          has_business?: boolean | null
          home_photo_url?: string | null
          id?: string
          id_number?: string | null
          logbook_url?: string | null
          medical_needs_score?: number | null
          medical_prescription_url?: string | null
          mpesa_statement_url?: string | null
          phone_number?: string | null
          profession?: string | null
          retail_cost?: number | null
          selected_collateral?: string[] | null
          sex?: string | null
          status?: string | null
          tin_number?: string | null
          title_deed_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
