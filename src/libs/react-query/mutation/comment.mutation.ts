import { commentService } from "@/libs/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            card_id,
            content,
            user_id,
        }: {
            card_id: string;
            content: string;
            user_id: string;
        }) => commentService.createComment({ card_id, content, user_id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        },
    });
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => commentService.deleteComment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        },
    });
};

export const useUpdateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, content }: { id: string; content: string }) =>
            commentService.updateComment(id, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        },
    });
};
