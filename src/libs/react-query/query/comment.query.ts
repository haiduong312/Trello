import { commentService } from "@/libs/services";
import { useQuery } from "@tanstack/react-query";

export const useCommentsByCardId = (cardId: string) => {
    return useQuery({
        queryKey: ["comments", cardId],
        queryFn: () => commentService.getCommentsByCardId(cardId),
        enabled: !!cardId,
    });
};
