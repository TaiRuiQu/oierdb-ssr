import type { Tables } from "@/types/supabase";

export type SearchResult = Tables<"oier"> & {
  record?: Array<
    Pick<Tables<"record">, "id" | "province"> & {
      contest?: Pick<Tables<"contest">, "year" | "fall_semester">;
    }
  >;
};

export type SearchParams = {
  query?: string;
};


