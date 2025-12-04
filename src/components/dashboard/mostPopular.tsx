"use client";

import { Card } from "antd";
import "@/components/styles/mostpopular.scss";
import Image from "next/image";
import { useMostPopularBoard } from "@/libs/react-query/query/board.query";
import Link from "next/link";
const MostPopularTemplate = () => {
    const { Meta } = Card;
    const { data: mostPopularBoards } = useMostPopularBoard();
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <h2 style={{ fontSize: 19, marginBottom: 20 }}>
                    Most Popular Templates
                </h2>
            </div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 40,
                    rowGap: 40,
                }}
            >
                {mostPopularBoards?.map((item, index) => {
                    return (
                        <Link href={`/board/${item.id}`} key={index}>
                            <Card
                                key={index}
                                hoverable
                                style={{
                                    height: 113,
                                    width: "100%",
                                    textAlign: "center",
                                }}
                                styles={{
                                    body: {
                                        padding: 0,
                                        paddingTop: 10,
                                    },
                                }}
                                cover={
                                    <Image
                                        draggable={false}
                                        alt="template's background"
                                        src={item.backgroundUrl}
                                        width={215}
                                        height={72}
                                        priority
                                    />
                                }
                            >
                                <Meta
                                    title={
                                        <span
                                            style={{
                                                fontWeight: 500,
                                                fontSize: 15,
                                            }}
                                        >
                                            {item.title}
                                        </span>
                                    }
                                />
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
export default MostPopularTemplate;
