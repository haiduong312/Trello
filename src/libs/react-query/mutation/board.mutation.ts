import { boardService } from "@/libs/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateBoards = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      board: Omit<IBoard, "id" | "created_at" | "updated_at">
    ) => {
      const data = await boardService.createBoards(board);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });
    },
  });
};
