import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { ApiResponse } from "@/types";
import { GetListing } from "../types";

export const useSearchSuggestions = (query: string) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  return useQuery<GetListing[], Error>({
    queryKey: ["search-suggestions", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) return [];
      const { data } = await api.get<ApiResponse<GetListing[]>>(
        "/marketplace/listings/search-suggestions",
        {
          params: { q: debouncedQuery },
        },
      );
      return data.body;
    },
    enabled: debouncedQuery.trim().length >= 2,
  });
};
