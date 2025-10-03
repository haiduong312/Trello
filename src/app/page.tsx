import HomeMain from "@/components/main/home.main";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Capture, organize, and tackle your to-dos from anywhere | Trello",
    description:
        "Capture, organize, and tackle your to-dos from anywhere | Trello",
};

export default function HomePage() {
    return <HomeMain />;
}
