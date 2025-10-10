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

    async getBoards(userId: string, orgId: string): Promise<IBoard[]> {
        let query = supabase
            .from("boards")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (orgId !== "personal") {
            // Nếu có orgId thì lấy bảng organization
            query = query.eq("orgId", orgId);
        } else {
            query = query.eq("orgId", "personal");
        }
        const { data, error } = await query;
        if (error) {
            throw error;
        }
        return data || [];
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
};

export const columnService = {
    // async getBoards(userId: string): Promise<Board[]> {
    //     const { data, error } = await supabase
    //         .from("boards")
    //         .select("*")
    //         .eq("user_id", userId)
    //         .order("created_at", { ascending: false });

    //     if (error) {
    //         throw error;
    //     }
    //     return data || [];
    // },

    async createColumn(
        column: Omit<IColumn, "id" | "created_at">
    ): Promise<IColumn> {
        const { data, error } = await supabase
            .from("columns")
            .insert(column)
            .select()
            .single();

        if (error) {
            throw error;
        }
        return data;
    },
};
