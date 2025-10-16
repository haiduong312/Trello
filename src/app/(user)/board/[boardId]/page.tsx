import BoardTemplate from "@/components/board/board.template";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Board | Trello",
    description: "Trello's Board Page",
};
const BoardPage = () => {
    return <BoardTemplate />;
};

export default BoardPage;
