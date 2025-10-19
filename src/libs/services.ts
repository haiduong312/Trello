import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export const userService = {
  async syncUser(
    id: string,
    full_name: string,
    avatar_url: string,
    email: string
  ) {
    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          id,
          full_name: full_name,
          avatar_url: avatar_url,
          email: email,
        },
        { onConflict: "id" } // nếu đã có thì update
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },
};

export const boardService = {
  async getMostPopularBoard() {
    const { data, error } = await supabase
      .from("most_popular_board")
      .select("*");

    if (error) {
      throw error;
    }
    return data || [];
  },

  async getPersonalBoards(userId: string): Promise<IBoard[]> {
    let query = supabase
      .from("boards")
      .select("*")
      .eq("user_id", userId)
      .eq("orgId", "personal")
      .order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) {
      throw error;
    }
    return data || [];
  },

  async getOrgBoards(orgId: string): Promise<IBoard[]> {
    let query = supabase
      .from("boards")
      .select("*")
      .eq("orgId", orgId)
      .order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) {
      throw error;
    }
    return data || [];
  },
  async getBoardsById(id: string): Promise<IBoard> {
    let { data: board, error } = await supabase
      .from("boards")
      .select("*")
      .eq("id", id)
      .single();
    if (!error && board) return board;

    // Nếu không có, thử trong bảng mostpopularboard
    let { data: popularBoard, error: popularError } = await supabase
      .from("most_popular_board")
      .select("*")
      .eq("id", id)
      .single();

    if (popularError) throw popularError;
    return popularBoard;
  },

  async createBoards(
    board: Omit<IBoard, "id" | "created_at" | "updated_at">
  ): Promise<IBoard> {
    const { data, error } = await supabase
      .from("boards")
      .insert({
        user_id: board.user_id,
        title: board.title,
        backgroundUrl: board.backgroundUrl,
        orgId: board.orgId,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }
    return data;
  },

  //   async updateBoard(
  //     boardId: string,
  //     updates: Partial<IBoard>
  //   ): Promise<IBoard> {
  //     const { data, error } = await supabase
  //       .from("boards")
  //       .update({ ...updates })
  //       .eq("id", boardId)
  //       .select()
  //       .single();

  //     if (error) throw error;
  //     return data;
  //   },
};

export const columnService = {
  async getColumns(boardId: string): Promise<IColumn[]> {
    const { data, error } = await supabase
      .from("columns")
      .select("*")
      .eq("board_id", boardId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }
    return data || [];
  },

  async createColumn(
    column: Omit<IColumn, "id" | "created_at">
  ): Promise<IColumn> {
    const { data, error } = await supabase
      .from("columns")
      .insert({
        board_id: column.board_id,
        title: column.title,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }
    return data;
  },

  async deleteColumn(columnId: string): Promise<void> {
    const { error } = await supabase
      .from("columns")
      .delete()
      .eq("id", columnId);

    if (error) {
      throw error;
    }
  },
};

export const cardService = {
  async getCard(columnId: string): Promise<ICard[]> {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("column_id", columnId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }
    return data || [];
  },

  async createCard(
    card: Omit<ICard, "id" | "created_at" | "updated_at" | "description">
  ): Promise<ICard> {
    const { data, error } = await supabase
      .from("cards")
      .insert({
        column_id: card.column_id,
        title: card.title,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }
    return data;
  },

  async deleteColumn(columnId: string): Promise<void> {
    const { error } = await supabase
      .from("columns")
      .delete()
      .eq("id", columnId);

    if (error) {
      throw error;
    }
  },
};
