import DashboardMenu from "@/components/dashboard/dashboard.menu";
import MostPopularTemplate from "@/components/dashboard/mostPopular";
import WorkSpaces from "@/components/dashboard/workspaces";

export default async function DashboardPage() {
    return (
        <div
            style={{
                display: "flex",
                width: "100%",
            }}
        >
            <div
                style={{
                    width: "16.6667%",
                    padding: "40px 0 0 32px",
                }}
            >
                <DashboardMenu />
            </div>

            <div
                style={{
                    width: "83.3333%",
                    padding: "48px 56px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflowY: "auto",
                }}
            >
                <div>
                    <div style={{ marginBottom: 48 }}>
                        <MostPopularTemplate />
                    </div>
                    <div>
                        <WorkSpaces />
                    </div>
                </div>
            </div>
        </div>
    );
}
