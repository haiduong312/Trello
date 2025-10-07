"use client";

import { Card } from "antd";
import "@/components/styles/mostpopular.scss";
import Image from "next/image";
import { boardService } from "@/libs/services";
import { useClerkContext } from "@/libs/context/ClerkProvider";
import { useEffect, useState } from "react";

const RecentView = () => {
    const { Meta } = Card;
    const user = useClerkContext();
    const [boards, setBoards] = useState<IBoard[] | null>(null);
    useEffect(() => {
        if (!user) return;

        const fetchBoards = async () => {
            try {
                const data = await boardService.getBoards(user.id);
                console.log("data", data);
                setBoards(data);
            } catch (error) {
                console.error("Error fetching boards:", error);
            }
        };

        fetchBoards();
    }, [user]);
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <h2 style={{ fontSize: 19, marginBottom: 20 }}>
                    Recently viewed
                </h2>
            </div>
            <div style={{ display: "flex", gap: 50 }}>
                <Card
                    hoverable
                    style={{ height: 113, width: 215, textAlign: "center" }}
                    styles={{
                        body: {
                            padding: 0,
                            paddingTop: 10,
                        },
                    }}
                    cover={
                        <Image
                            draggable={false}
                            alt="example"
                            src="/assets/water.jpg"
                            width={215}
                            height={72}
                        />
                    }
                >
                    <Meta
                        title={
                            <span style={{ fontWeight: 400, fontSize: 15 }}>
                                KanBan Template
                            </span>
                        }
                    />
                </Card>
                <Card
                    hoverable
                    style={{ height: 113, width: 215, textAlign: "center" }}
                    styles={{
                        body: {
                            padding: 0,
                            paddingTop: 10,
                        },
                    }}
                    cover={
                        <Image
                            draggable={false}
                            alt="example"
                            src="/assets/blue-mountain.jpg"
                            width={215}
                            height={72}
                        />
                    }
                >
                    <Meta
                        title={
                            <span style={{ fontWeight: 400, fontSize: 15 }}>
                                WorkSpaces Template
                            </span>
                        }
                    />
                </Card>
                <Card
                    hoverable
                    style={{ height: 113, width: 215, textAlign: "center" }}
                    styles={{
                        body: {
                            padding: 0,
                            paddingTop: 10,
                        },
                    }}
                    cover={
                        <Image
                            draggable={false}
                            alt="example"
                            src="/assets/yel-mountain.jpg"
                            width={215}
                            height={72}
                        />
                    }
                >
                    <Meta
                        title={
                            <span style={{ fontWeight: 400, fontSize: 15 }}>
                                Trello Template
                            </span>
                        }
                    />
                </Card>
                {/* {boards ? (
                    <Card
                        hoverable
                        style={{ height: 113, width: 215, textAlign: "center" }}
                        styles={{
                            body: {
                                padding: 0,
                                paddingTop: 10,
                            },
                        }}
                        // cover={
                        //     <Image
                        //         draggable={false}
                        //         alt="example"
                        //         src={boards[0].backgroundUrl}
                        //         width={215}
                        //         height={72}
                        //     />
                        // }
                    >
                        <Meta
                            title={
                                <span style={{ fontWeight: 400, fontSize: 15 }}>
                                    {boards[0].title} */}
                {/* </span>
                            }
                        />
                    </Card> */}
                {/* ) : (
                    <>dadsa</>
                )} */}
            </div>
        </div>
    );
};
export default RecentView;
