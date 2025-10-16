import { boardService } from "@/libs/services";
import { useQuery } from "@tanstack/react-query";

export const useMostPopularBoard = () => {
    return useQuery({
        queryKey: ["most-popular-boards"],
        queryFn: boardService.getMostPopularBoard,
    });
};
export const useBoardOrg = (orgId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ["boards", "org-boards", orgId],
        queryFn: () => boardService.getOrgBoards(orgId),
        enabled: enabled,
    });
};

export const useBoardPersonal = (userId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ["boards", "personal-boards", userId],
        queryFn: () => boardService.getPersonalBoards(userId),
        enabled: enabled,
    });
};

export const useBoardId = (id: string) => {
    return useQuery({
        queryKey: ["board-id", id],
        queryFn: () => boardService.getBoardsById(id),
        enabled: !!id,
    });
};
