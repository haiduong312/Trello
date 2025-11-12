import { columnService } from "@/libs/services";
import { useQuery } from "@tanstack/react-query";

export const useColumnByBoardId = (boardId: string) => {
    return useQuery({
        queryKey: ["column-id", boardId],
        queryFn: () => columnService.getColumnsByBoardId(boardId),
        enabled: !!boardId,
    });
};

export const useColumnByColumnId = (columnId: string) => {
    return useQuery({
        queryKey: ["columns", columnId],
        queryFn: () => columnService.getColumnsByColumnId(columnId),
        enabled: !!columnId,
    });
};
