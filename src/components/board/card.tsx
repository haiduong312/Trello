"use client";

import { Card, Typography } from "antd";
import "@/components/styles/board.style.scss";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
interface IProps {
  card: ICard;
}

const CardItem = ({ card }: IProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { id: card.id, data: { ...card }, type: "Card" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
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
    >
      <Text>{card.title}</Text>
    </Card>
  );
};

export default CardItem;
