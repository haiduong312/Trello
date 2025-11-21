import { cardService } from "@/libs/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCards = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (
            card: Omit<
                ICard,
                | "id"
                | "created_at"
                | "updated_at"
                | "description"
                | "position"
                | "comment"
            >
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
export const useUpdateCardDescription = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            cardId,
            description,
        }: {
            cardId: string;
            description: string;
        }) => {
            return await cardService.updateCardDescription(cardId, description);
        },

        // (1) User bấm Save

        // (2) UI ngay lập tức đổi description (trước khi server trả về) ← điểm chính

        // (3) Gửi request ngầm

        // (4) Nếu server trả về OK → giữ nguyên

        // (5) Nếu thất bại → rollback lại giá trị cũ

        // Optimistic Update
        onMutate: async ({ cardId, description }) => {
            await queryClient.cancelQueries({ queryKey: ["cards"] });

            const previousCards = queryClient.getQueryData<any>(["cards"]);

            queryClient.setQueryData(["cards"], (old: any) => {
                if (!old) return old;

                return old.map((card: any) =>
                    card.id === cardId ? { ...card, description } : card
                );
            });

            return { previousCards };
        },

        // Rollback nếu lỗi
        onError: (_error, _vars, context) => {
            if (context?.previousCards) {
                queryClient.setQueryData(["cards"], context.previousCards);
            }
        },

        // Refetch để đảm bảo đồng bộ DB
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["cards"] });
        },
    });
};
