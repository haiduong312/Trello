export {};
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
    interface IUser {
        id: string;
        full_name: string;
        avatar_url: string;
        email: string;
        created_at?: Date;
        updated_at?: Date;
    }

    interface IBoard {
        id: string;
        title: string;
        backgroundUrl: string;
        user_id: string;
        created_at?: string;
        updated_at?: string;
        orgId: string;
    }

    interface IColumn {
        id: string;
        board_id: string;
        title: string;
        created_at: string;
    }
    interface IComment {
        id: string;
        card_id: string;
        content: string;
        created_at: Date;
        user_id?: string;
    }

    interface ICard {
        id: string;
        column_id: string;
        title: string;
        description: string;
        created_at: Date;
        updated_at: Date;
        position: number;
        comment: IComment[];
    }
}
