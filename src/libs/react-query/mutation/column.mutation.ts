import { boardService, columnService } from "@/libs/services";
import { Mutation, useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateColumn = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (column: Omit<IColumn, "id" | "created_at">) => {
            const data = await columnService.createColumn(column);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["column-id"],
            });
        },
    });
};

export const useDeleteColumn = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: async (columnId) => {
            await columnService.deleteColumn(columnId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["column-id"] });
        },
    });
};
