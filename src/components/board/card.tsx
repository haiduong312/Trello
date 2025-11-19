"use client";

import { Card, Typography } from "antd";
import "@/components/styles/board.style.scss";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
interface IProps {
    card: ICard;
    activeDragType: "column" | "card" | null;
    isCardModalOpen: boolean;
    setIsCardModalOpen: (v: boolean) => void;
    setSelectedCard: (v: ICard) => void;
}

const CardItem = ({
    card,
    activeDragType,
    setIsCardModalOpen,
    setSelectedCard,
}: IProps) => {
    if (!card) return null;
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
        data: { data: { ...card }, type: "card" },
        disabled: activeDragType === "column",
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: "none",
        opacity: isDragging ? 0.5 : undefined,
    };
    const { Text } = Typography;
    return (
        <Card
            key={card.id}
            size="small"
            styles={{
                body: {
                    padding: 8,
                    background: "rgb(0 0 0 / 4%)",
                    borderRadius: 8,
                },
            }}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="card"
            onClick={() => {
                setIsCardModalOpen(true);
                setSelectedCard(card);
            }}
        >
            <Text>{card.title}</Text>
        </Card>
    );
};

export default CardItem;
