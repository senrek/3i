export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          school: string | null
          class: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          school?: string | null
          class?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          school?: string | null
          class?: string | null
        }
        Relationships: []
      }
      user_assessments: {
        Row: {
          assessment_id: string
          completed_at: string | null
          id: string
          report_generated_at: string | null
          responses: Json
          scores: Json
          user_id: string
        }
        Insert: {
          assessment_id: string
          completed_at?: string | null
          id?: string
          report_generated_at?: string | null
          responses: Json
          scores: Json
          user_id: string
        }
        Update: {
          assessment_id?: string
          completed_at?: string | null
          id?: string
          report_generated_at?: string | null
          responses?: Json
          scores?: Json
          user_id?: string
        }
        Relationships: []
      }
      user_reports: {
        Row: {
          id: string
          user_name: string
          report_content: Json
          career_clusters: Json
          scores: Json
          responses: Json
          strength_areas: string[]
          development_areas: string[]
          generated_at: string
        }
        Insert: {
          id: string
          user_name: string
          report_content: Json
          career_clusters: Json
          scores: Json
          responses: Json
          strength_areas: string[]
          development_areas: string[]
          generated_at?: string
        }
        Update: {
          id?: string
          user_name?: string
          report_content?: Json
          career_clusters?: Json
          scores?: Json
          responses?: Json
          strength_areas?: string[]
          development_areas?: string[]
          generated_at?: string
        }
        Relationships: []
      }
      skill_assessments: {
        Row: {
          id: string
          assessment_id: string
          user_id: string
          overall_score: number
          numerical_score: number
          logical_score: number
          verbal_score: number
          clerical_score: number
          spatial_score: number
          leadership_score: number
          social_score: number
          mechanical_score: number
          completed_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          user_id: string
          overall_score: number
          numerical_score: number
          logical_score: number
          verbal_score: number
          clerical_score: number
          spatial_score: number
          leadership_score: number
          social_score: number
          mechanical_score: number
          completed_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          user_id?: string
          overall_score?: number
          numerical_score?: number
          logical_score?: number
          verbal_score?: number
          clerical_score?: number
          spatial_score?: number
          leadership_score?: number
          social_score?: number
          mechanical_score?: number
          completed_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_assessment_with_profile: {
        Args: {
          input_assessment_id: string
        }
        Returns: {
          id: string
          user_id: string
          assessment_id: string
          completed_at: string
          responses: Json
          scores: Json
          report_generated_at: string
          first_name: string
          last_name: string
          email: string
        }[]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
