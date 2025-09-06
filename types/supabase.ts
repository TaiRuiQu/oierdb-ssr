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
    PostgrestVersion: "13.0.4";
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
      contest: {
        Row: {
          capacity: number | null;
          created_at: string;
          fall_semester: boolean;
          full_score: number;
          id: number;
          name: string;
          type: Database["public"]["Enums"]["contest_type_enum"];
          updated_at: string;
          year: number;
        };
        Insert: {
          capacity?: number | null;
          created_at?: string;
          fall_semester: boolean;
          full_score: number;
          id: number;
          name: string;
          type: Database["public"]["Enums"]["contest_type_enum"];
          updated_at?: string;
          year: number;
        };
        Update: {
          capacity?: number | null;
          created_at?: string;
          fall_semester?: boolean;
          full_score?: number;
          id?: number;
          name?: string;
          type?: Database["public"]["Enums"]["contest_type_enum"];
          updated_at?: string;
          year?: number;
        };
        Relationships: [];
      };
      oier: {
        Row: {
          ccf_level: number | null;
          ccf_score: number | null;
          created_at: string;
          enroll_middle: number | null;
          gender: Database["public"]["Enums"]["gender_enum"];
          id: number;
          identifier: string;
          initials: string | null;
          name: string;
          oierdb_score: number | null;
          uid: number;
          updated_at: string;
        };
        Insert: {
          ccf_level?: number | null;
          ccf_score?: number | null;
          created_at?: string;
          enroll_middle?: number | null;
          gender?: Database["public"]["Enums"]["gender_enum"];
          id?: number;
          identifier: string;
          initials?: string | null;
          name: string;
          oierdb_score?: number | null;
          uid: number;
          updated_at?: string;
        };
        Update: {
          ccf_level?: number | null;
          ccf_score?: number | null;
          created_at?: string;
          enroll_middle?: number | null;
          gender?: Database["public"]["Enums"]["gender_enum"];
          id?: number;
          identifier?: string;
          initials?: string | null;
          name?: string;
          oierdb_score?: number | null;
          uid?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      record: {
        Row: {
          contest_id: number;
          created_at: string;
          em_override_year: number | null;
          gender: Database["public"]["Enums"]["gender_enum"];
          grades_mask: number;
          id: number;
          keep_grade_flag: boolean;
          level: Database["public"]["Enums"]["award_level_enum"] | null;
          oier_id: number;
          province: Database["public"]["Enums"]["province_enum"];
          rank: number;
          school_id: number;
          score: number | null;
          updated_at: string;
        };
        Insert: {
          contest_id: number;
          created_at?: string;
          em_override_year?: number | null;
          gender: Database["public"]["Enums"]["gender_enum"];
          grades_mask: number;
          id?: number;
          keep_grade_flag?: boolean;
          level?: Database["public"]["Enums"]["award_level_enum"] | null;
          oier_id: number;
          province: Database["public"]["Enums"]["province_enum"];
          rank: number;
          school_id: number;
          score?: number | null;
          updated_at?: string;
        };
        Update: {
          contest_id?: number;
          created_at?: string;
          em_override_year?: number | null;
          gender?: Database["public"]["Enums"]["gender_enum"];
          grades_mask?: number;
          id?: number;
          keep_grade_flag?: boolean;
          level?: Database["public"]["Enums"]["award_level_enum"] | null;
          oier_id?: number;
          province?: Database["public"]["Enums"]["province_enum"];
          rank?: number;
          school_id?: number;
          score?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "record_contest_id_fkey";
            columns: ["contest_id"];
            isOneToOne: false;
            referencedRelation: "contest";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "record_oier_id_fkey";
            columns: ["oier_id"];
            isOneToOne: false;
            referencedRelation: "oier";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "record_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "school";
            referencedColumns: ["id"];
          }
        ];
      };
      school: {
        Row: {
          aliases: string[];
          city: string | null;
          created_at: string;
          id: number;
          name: string;
          province: Database["public"]["Enums"]["province_enum"];
          score: number;
          updated_at: string;
        };
        Insert: {
          aliases?: string[];
          city?: string | null;
          created_at?: string;
          id?: number;
          name: string;
          province: Database["public"]["Enums"]["province_enum"];
          score?: number;
          updated_at?: string;
        };
        Update: {
          aliases?: string[];
          city?: string | null;
          created_at?: string;
          id?: number;
          name?: string;
          province?: Database["public"]["Enums"]["province_enum"];
          score?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      award_level_enum:
        | "金牌"
        | "银牌"
        | "铜牌"
        | "一等奖"
        | "二等奖"
        | "三等奖"
        | "国际金牌"
        | "国际银牌"
        | "国际铜牌"
        | "前5%"
        | "前15%"
        | "前25%";
      contest_type_enum:
        | "APIO"
        | "CSP入门"
        | "CSP提高"
        | "CTSC"
        | "IOI"
        | "NGOI"
        | "NOI"
        | "NOID类"
        | "NOIP"
        | "NOIP提高"
        | "NOIP普及"
        | "NOIST"
        | "WC";
      gender_enum: "unknown" | "male" | "female";
      province_enum:
        | "安徽"
        | "北京"
        | "福建"
        | "甘肃"
        | "广东"
        | "广西"
        | "贵州"
        | "海南"
        | "河北"
        | "河南"
        | "黑龙江"
        | "湖北"
        | "湖南"
        | "吉林"
        | "江苏"
        | "江西"
        | "辽宁"
        | "内蒙古"
        | "山东"
        | "山西"
        | "陕西"
        | "上海"
        | "四川"
        | "天津"
        | "新疆"
        | "浙江"
        | "重庆"
        | "宁夏"
        | "云南"
        | "澳门"
        | "香港"
        | "青海"
        | "西藏"
        | "台湾";
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
    : never = never
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
    : never = never
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
    : never = never
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
    : never = never
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
    : never = never
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
      award_level_enum: [
        "金牌",
        "银牌",
        "铜牌",
        "一等奖",
        "二等奖",
        "三等奖",
        "国际金牌",
        "国际银牌",
        "国际铜牌",
        "前5%",
        "前15%",
        "前25%",
      ],
      contest_type_enum: [
        "APIO",
        "CSP入门",
        "CSP提高",
        "CTSC",
        "IOI",
        "NGOI",
        "NOI",
        "NOID类",
        "NOIP",
        "NOIP提高",
        "NOIP普及",
        "NOIST",
        "WC",
      ],
      gender_enum: ["unknown", "male", "female"],
      province_enum: [
        "安徽",
        "北京",
        "福建",
        "甘肃",
        "广东",
        "广西",
        "贵州",
        "海南",
        "河北",
        "河南",
        "黑龙江",
        "湖北",
        "湖南",
        "吉林",
        "江苏",
        "江西",
        "辽宁",
        "内蒙古",
        "山东",
        "山西",
        "陕西",
        "上海",
        "四川",
        "天津",
        "新疆",
        "浙江",
        "重庆",
        "宁夏",
        "云南",
        "澳门",
        "香港",
        "青海",
        "西藏",
        "台湾",
      ],
    },
  },
} as const;
