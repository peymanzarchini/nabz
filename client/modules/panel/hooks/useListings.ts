import { useAuth } from "@/lib/providers/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteListing, getListings } from "../services/dashboard.service";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export const useGetListings = () => {
  const { user } = useAuth();
  const { data: listings, isLoading } = useQuery({
    queryKey: ["my-listings", user?.id],
    queryFn: () => getListings(user!.id),
    enabled: !!user?.id,
  });

  return {
    listings,
    isLoading,
  };
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (id: string) => deleteListing(id),
    onSuccess: () => {
      toast.success("آگهی با موفقیت حذف شد.");
      queryClient.invalidateQueries({ queryKey: ["my-listings", user?.id] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
};
