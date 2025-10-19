import { cardService } from "@/libs/services";
import { useQuery } from "@tanstack/react-query";

export const useCardsByColumnId = (columnId: string) => {
  return useQuery({
    queryKey: ["cards", columnId],
    queryFn: () => cardService.getCard(columnId),
    enabled: !!columnId,
  });
};
