import { columnService } from "@/libs/services";
import { useQuery } from "@tanstack/react-query";

export const useColumnById = (boardId: string) => {
    return useQuery({
        queryKey: ["column-id", boardId],
        queryFn: () => columnService.getColumns(boardId),
        enabled: !!boardId,
    });
};
