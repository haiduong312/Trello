"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "antd";
import { motion, Transition } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface EmptyDropZoneProps {
    column: IColumn;
}

// Transition cho animation
const transition: Transition = {
    duration: 4,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
};

// Path SVG gốc nhưng scale nhỏ để vừa card 236x38
const pathD = `M 10 10 C 40 10 70 25 110 25 C 150 25 180 15 225 15`;

export const MotionLottie = () => {
    return (
        <motion.div
            style={{
                width: 36, // nhỏ vừa trong card
                height: 36,
                position: "absolute",
                top: 1,
                left: 0,
                offsetPath: `path("${pathD}")`,
            }}
            initial={{ offsetDistance: "0%", scale: 1 }}
            animate={{ offsetDistance: "100%", scale: 1 }}
            transition={transition}
        >
            <DotLottieReact
                src="https://lottie.host/b939362b-545e-459e-8499-9de87e8788d3/PWDP0qrVy4.lottie"
                loop
                autoplay
                style={{ width: "100%", height: "100%" }}
            />
        </motion.div>
    );
};

const EmptyDropZone = ({ column }: EmptyDropZoneProps) => {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition: t,
    } = useSortable({
        id: `empty-${column.id}`,
        data: { type: "column", data: column },
    });

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition: t,
        position: "relative",
        width: 236,
        height: 38,
    };

    return (
        <Card
            size="small"
            style={{
                ...style,
                padding: 1,
                background: "rgb(0 0 0 / 4%)",
                borderRadius: 8,
                overflow: "hidden",
                marginBottom: 10,
            }}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
        >
            <MotionLottie />
        </Card>
    );
};

export default EmptyDropZone;
