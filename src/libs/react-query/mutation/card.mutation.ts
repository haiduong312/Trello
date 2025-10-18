import { cardService } from "@/libs/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCards = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      card: Omit<ICard, "id" | "created_at" | "updated_at">
    ) => {
      const data = await cardService.createCard(card);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cards"],
      });
    },
  });
};
