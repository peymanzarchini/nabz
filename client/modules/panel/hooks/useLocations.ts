import { useQuery } from "@tanstack/react-query";
import { GetLocation } from "../types";
import { getLocations } from "../services/dashboard.service";

export const useLocations = () => {
  return useQuery<GetLocation[], Error>({
    queryKey: ["locations"],
    queryFn: getLocations,
  });
};
