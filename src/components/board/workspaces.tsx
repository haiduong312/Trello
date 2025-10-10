"use client";

import { Card, Input, Modal } from "antd";
import "@/components/styles/mostpopular.scss";
import Image from "next/image";
import { boardService } from "@/libs/services";
import { useEffect, useState } from "react";
import { useOrganization, useUser } from "@clerk/nextjs";

const backgrounds = [
    "/assets/background-1.jpg",
    "/assets/background-2.jpg",
    "/assets/background-3.jpg",
    "/assets/background-4.jpg",
    "/assets/background-5.jpg",
    "/assets/background-6.jpg",
    "/assets/background-7.jpg",
    "/assets/background-8.jpg",
];

const WorkSpaces = () => {
    const organization = useOrganization();
    let orgId = organization.organization?.id;
    if (!orgId) orgId = "personal";
    const { Meta } = Card;
    const [createTitle, setCreateTitle] = useState<string>("");
    const [createBg, setCreateBg] = useState<string>(
        "/assets/background-1.jpg"
    );
    const [value, setValue] = useState<string>("/assets/background-1.jpg");
    const { user } = useUser();
    const [boards, setBoards] = useState<IBoard[] | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!user) return;

        const fetchBoards = async () => {
            try {
                const data = await boardService.getBoards(user.id, orgId!);
                setBoards(data);
            } catch (error) {
                console.error("Error fetching boards:", error);
            }
        };

        fetchBoards();
    }, [user, orgId]);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        if (user) {
            const newBoard = await boardService.createBoards({
                title: createTitle,
                backgroundUrl: createBg,
                user_id: user.id,
                orgId: orgId!,
            });
            setBoards((prev) => (prev ? [...prev, newBoard] : [newBoard]));
            setCreateTitle("");
            setCreateBg("/assets/background-1.jpg");
            setIsModalOpen(false);
        }
    };

    const handleCancel = () => {
        setCreateTitle("");
        setCreateBg("/assets/background-1.jpg");
        setIsModalOpen(false);
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <h2 style={{ fontSize: 19, marginBottom: 20 }}>
                    Your Workspaces
                </h2>
            </div>
            <div style={{ display: "flex", gap: 50 }}>
                {boards?.map((item, index) => (
                    <Card
                        key={index}
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
                                <span style={{ fontWeight: 400, fontSize: 15 }}>
                                    {item.title}
                                </span>
                            }
                        />
                    </Card>
                ))}
                <Card
                    onClick={showModal}
                    hoverable
                    style={{
                        height: 113,
                        width: 215,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "#091e420f",
                        textAlign: "center",
                    }}
                >
                    Create new board
                </Card>
            </div>
            <div>
                <Modal
                    closable={{ "aria-label": "Custom Close Button" }}
                    open={isModalOpen}
                    onOk={handleOk}
                    okText="Create"
                    onCancel={handleCancel}
                    destroyOnHidden
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        maxHeight: 300,
                    }}
                >
                    <header
                        style={{
                            textAlign: "center",
                            paddingBottom: 10,
                            fontWeight: 600,
                            fontSize: 16,
                        }}
                    >
                        Create board
                    </header>
                    <div
                        style={{
                            width: 200,
                            height: 120,
                            backgroundImage: `url(${createBg})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            padding: 8,
                            borderRadius: 3,
                            margin: "0 auto",
                        }}
                    >
                        <img
                            src="/assets/create-board-skeleton.svg"
                            alt="create board background"
                        />
                    </div>
                    <div style={{ paddingTop: 20, fontWeight: 600 }}>
                        Background
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 64px)",
                            gridTemplateRows: "repeat(2, 40px)",
                            gap: "10px",
                        }}
                    >
                        {backgrounds.map((bg, i) => (
                            <div
                                key={i}
                                onClick={() => {
                                    setValue(bg);
                                    setCreateBg(bg);
                                }}
                                style={{
                                    width: 64,
                                    height: 40,
                                    borderRadius: 6,
                                    border:
                                        value === bg
                                            ? "2px solid #1677ff"
                                            : "1px solid #ccc",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    transition: "0.2s",
                                    position: "relative",
                                }}
                            >
                                <Image
                                    src={bg}
                                    alt={`background-${i}`}
                                    fill
                                    sizes="64px"
                                    style={{
                                        objectFit: "cover",
                                        objectPosition: "center",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div style={{ paddingTop: 20, fontWeight: 600 }}>
                        Board title
                    </div>
                    <div>
                        <Input
                            placeholder="Please enter board title"
                            value={createTitle}
                            onChange={(e) => {
                                setCreateTitle(e.target.value);
                            }}
                            required
                        />
                    </div>
                </Modal>
            </div>
        </div>
    );
};
export default WorkSpaces;
