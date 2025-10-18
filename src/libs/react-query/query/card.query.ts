import { cardService } from "@/libs/services";
import { useQuery } from "@tanstack/react-query";

export const useCardByColumnId = (columnId: string) => {
  return useQuery({
    queryKey: ["cards", columnId],
    queryFn: () => cardService.getCard(columnId),
    enabled: !!columnId,
  });
};
