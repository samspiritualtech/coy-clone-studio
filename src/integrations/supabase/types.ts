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
      categories: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_zones: {
        Row: {
          city: string | null
          created_at: string | null
          delivery_days: number | null
          express_available: boolean | null
          id: string
          is_deliverable: boolean | null
          pincode: string
          state: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          delivery_days?: number | null
          express_available?: boolean | null
          id?: string
          is_deliverable?: boolean | null
          pincode: string
          state?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          delivery_days?: number | null
          express_available?: boolean | null
          id?: string
          is_deliverable?: boolean | null
          pincode?: string
          state?: string | null
        }
        Relationships: []
      }
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
      order_items: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          order_id: string
          product_id: string
          quantity: number
          size: string | null
          total_price: number
          unit_price: number
          variant_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          order_id: string
          product_id: string
          quantity: number
          size?: string | null
          total_price: number
          unit_price: number
          variant_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          size?: string | null
          total_price?: number
          unit_price?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          accepted_at: string | null
          cancelled_at: string | null
          created_at: string | null
          customer_id: string
          delivered_at: string | null
          discount: number | null
          id: string
          order_number: string
          packed_at: string | null
          seller_id: string
          shipped_at: string | null
          shipping_address: Json
          shipping_carrier: string | null
          shipping_fee: number | null
          status: string
          subtotal: number
          total: number
          tracking_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          customer_id: string
          delivered_at?: string | null
          discount?: number | null
          id?: string
          order_number: string
          packed_at?: string | null
          seller_id: string
          shipped_at?: string | null
          shipping_address: Json
          shipping_carrier?: string | null
          shipping_fee?: number | null
          status?: string
          subtotal: number
          total: number
          tracking_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          customer_id?: string
          delivered_at?: string | null
          discount?: number | null
          id?: string
          order_number?: string
          packed_at?: string | null
          seller_id?: string
          shipped_at?: string | null
          shipping_address?: Json
          shipping_carrier?: string | null
          shipping_fee?: number | null
          status?: string
          subtotal?: number
          total?: number
          tracking_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
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
      payouts: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          order_ids: Json | null
          payout_date: string | null
          processed_at: string | null
          seller_id: string
          settlement_cycle: string | null
          status: string
          transaction_reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          order_ids?: Json | null
          payout_date?: string | null
          processed_at?: string | null
          seller_id: string
          settlement_cycle?: string | null
          status?: string
          transaction_reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          order_ids?: Json | null
          payout_date?: string | null
          processed_at?: string | null
          seller_id?: string
          settlement_cycle?: string | null
          status?: string
          transaction_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          color_hex: string | null
          color_name: string
          created_at: string | null
          id: string
          price_override: number | null
          product_id: string
          size: string
          sku: string | null
          stock_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          color_hex?: string | null
          color_name: string
          created_at?: string | null
          id?: string
          price_override?: number | null
          product_id: string
          size: string
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          color_hex?: string | null
          color_name?: string
          created_at?: string | null
          id?: string
          price_override?: number | null
          product_id?: string
          size?: string
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          care_instructions: string | null
          category: string
          category_id: string | null
          colors: Json | null
          created_at: string | null
          description: string | null
          designer_id: string | null
          dispatch_days: number | null
          fabric: string | null
          id: string
          images: Json | null
          is_available: boolean | null
          is_made_to_order: boolean | null
          is_returnable: boolean | null
          material: string | null
          occasion_tags: Json | null
          original_price: number | null
          price: number
          rejection_reason: string | null
          seller_id: string | null
          short_description: string | null
          sizes: Json | null
          status: string | null
          style_tags: Json | null
          title: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          care_instructions?: string | null
          category: string
          category_id?: string | null
          colors?: Json | null
          created_at?: string | null
          description?: string | null
          designer_id?: string | null
          dispatch_days?: number | null
          fabric?: string | null
          id?: string
          images?: Json | null
          is_available?: boolean | null
          is_made_to_order?: boolean | null
          is_returnable?: boolean | null
          material?: string | null
          occasion_tags?: Json | null
          original_price?: number | null
          price: number
          rejection_reason?: string | null
          seller_id?: string | null
          short_description?: string | null
          sizes?: Json | null
          status?: string | null
          style_tags?: Json | null
          title: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          care_instructions?: string | null
          category?: string
          category_id?: string | null
          colors?: Json | null
          created_at?: string | null
          description?: string | null
          designer_id?: string | null
          dispatch_days?: number | null
          fabric?: string | null
          id?: string
          images?: Json | null
          is_available?: boolean | null
          is_made_to_order?: boolean | null
          is_returnable?: boolean | null
          material?: string | null
          occasion_tags?: Json | null
          original_price?: number | null
          price?: number
          rejection_reason?: string | null
          seller_id?: string | null
          short_description?: string | null
          sizes?: Json | null
          status?: string | null
          style_tags?: Json | null
          title?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "designers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
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
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          is_onboarded: boolean | null
          latitude: number | null
          longitude: number | null
          name: string | null
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          is_onboarded?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_onboarded?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sellers: {
        Row: {
          application_status: string
          bank_account_number: string | null
          bank_ifsc: string | null
          bank_name: string | null
          banner_image: string | null
          brand_name: string
          city: string
          created_at: string | null
          description: string | null
          gstin: string | null
          id: string
          instagram_handle: string | null
          is_active: boolean | null
          is_verified: boolean | null
          pan_number: string | null
          profile_image: string | null
          seller_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          application_status?: string
          bank_account_number?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          banner_image?: string | null
          brand_name: string
          city: string
          created_at?: string | null
          description?: string | null
          gstin?: string | null
          id?: string
          instagram_handle?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          pan_number?: string | null
          profile_image?: string | null
          seller_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          application_status?: string
          bank_account_number?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          banner_image?: string | null
          brand_name?: string
          city?: string
          created_at?: string | null
          description?: string | null
          gstin?: string | null
          id?: string
          instagram_handle?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          pan_number?: string | null
          profile_image?: string | null
          seller_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string | null
          description: string
          id: string
          order_id: string | null
          product_id: string | null
          seller_id: string
          status: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          order_id?: string | null
          product_id?: string | null
          seller_id: string
          status?: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          order_id?: string | null
          product_id?: string | null
          seller_id?: string
          status?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
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
      user_addresses: {
        Row: {
          address_line: string
          address_type: string | null
          city: string
          created_at: string | null
          full_name: string
          id: string
          is_default: boolean | null
          landmark: string | null
          mobile: string
          pincode: string
          state: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_line: string
          address_type?: string | null
          city: string
          created_at?: string | null
          full_name: string
          id?: string
          is_default?: boolean | null
          landmark?: string | null
          mobile: string
          pincode: string
          state: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_line?: string
          address_type?: string | null
          city?: string
          created_at?: string | null
          full_name?: string
          id?: string
          is_default?: boolean | null
          landmark?: string | null
          mobile?: string
          pincode?: string
          state?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "consumer" | "seller" | "admin"
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
      app_role: ["consumer", "seller", "admin"],
    },
  },
} as const
