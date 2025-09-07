import type { Tables, Enums } from "@/types/supabase";

export type SearchResult = Tables<"oier"> & {
  record?: Array<
    Pick<Tables<"record">, "id" | "province"> & {
      contest?: Pick<Tables<"contest">, "year" | "fall_semester">;
    }
  >;
};

export type SearchParams = {
  query?: string;
  gender?: Enums<"gender_enum"> | "all";
  enroll_middle?: number;
  school?: number | string;
  province?: Enums<"province_enum"> | "all";
  grade?:
    | "all"
    | "初一"
    | "初二"
    | "初三"
    | "高一"
    | "高二"
    | "高三"
    | "高中毕业";
  page?: number;
  pageSize?: number;
};


