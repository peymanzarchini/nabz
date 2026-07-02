import { useQuery } from "@tanstack/react-query";
import { GetListing } from "../types";
import { getAmazingOfferListing } from "../services/home.service";

export const useAmazingOffers = () => {
  return useQuery<GetListing[], Error>({
    queryKey: ["listings", "amazing"],
    queryFn: getAmazingOfferListing,
  });
};
