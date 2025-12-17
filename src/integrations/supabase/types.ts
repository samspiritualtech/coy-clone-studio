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
      designers: {
        Row: {
          banner_image: string | null
          brand_name: string
          category: string
          city: string
          collection_name: string | null
          contact_number: string | null
          created_at: string
          description: string | null
          email: string | null
          followers: number | null
          id: string
          instagram_link: string | null
          name: string
          price_range: string
          product_images: Json | null
          profile_image: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          banner_image?: string | null
          brand_name: string
          category: string
          city: string
          collection_name?: string | null
          contact_number?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          followers?: number | null
          id?: string
          instagram_link?: string | null
          name: string
          price_range: string
          product_images?: Json | null
          profile_image?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          banner_image?: string | null
          brand_name?: string
          category?: string
          city?: string
          collection_name?: string | null
          contact_number?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          followers?: number | null
          id?: string
          instagram_link?: string | null
          name?: string
          price_range?: string
          product_images?: Json | null
          profile_image?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      influencer_videos: {
        Row: {
          caption: string
          created_at: string
          id: string
          is_active: boolean
          link: string
          poster_url: string | null
          sort_order: number
          updated_at: string
          video_filename: string
        }
        Insert: {
          caption: string
          created_at?: string
          id?: string
          is_active?: boolean
          link?: string
          poster_url?: string | null
          sort_order?: number
          updated_at?: string
          video_filename: string
        }
        Update: {
          caption?: string
          created_at?: string
          id?: string
          is_active?: boolean
          link?: string
          poster_url?: string | null
          sort_order?: number
          updated_at?: string
          video_filename?: string
        }
        Relationships: []
      }
      otp_verifications: {
        Row: {
          attempts: number | null
          created_at: string | null
          expires_at: string
          id: string
          otp_hash: string
          phone: string
          verified: boolean | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          expires_at: string
          id?: string
          otp_hash: string
          phone: string
          verified?: boolean | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          expires_at?: string
          id?: string
          otp_hash?: string
          phone?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          colors: Json | null
          created_at: string | null
          description: string | null
          designer_id: string | null
          id: string
          images: Json | null
          is_available: boolean | null
          material: string | null
          original_price: number | null
          price: number
          sizes: Json | null
          title: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          category: string
          colors?: Json | null
          created_at?: string | null
          description?: string | null
          designer_id?: string | null
          id?: string
          images?: Json | null
          is_available?: boolean | null
          material?: string | null
          original_price?: number | null
          price: number
          sizes?: Json | null
          title: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          category?: string
          colors?: Json | null
          created_at?: string | null
          description?: string | null
          designer_id?: string | null
          id?: string
          images?: Json | null
          is_available?: boolean | null
          material?: string | null
          original_price?: number | null
          price?: number
          sizes?: Json | null
          title?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tryon_history: {
        Row: {
          created_at: string | null
          id: string
          model_image_url: string
          model_name: string | null
          product_image_url: string
          product_name: string | null
          result_image_url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          model_image_url: string
          model_name?: string | null
          product_image_url: string
          product_name?: string | null
          result_image_url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          model_image_url?: string
          model_name?: string | null
          product_image_url?: string
          product_name?: string | null
          result_image_url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          banner_image: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          logo: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          banner_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          banner_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const
