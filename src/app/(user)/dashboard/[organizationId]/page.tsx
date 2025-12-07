import DashboardMenu from "@/components/dashboard/dashboard.menu";
import MostPopularTemplate from "@/components/dashboard/mostPopular";
import WorkSpaces from "@/components/dashboard/workspaces";
import "@/components/styles/dashboard.main.scss";
export default async function DashboardPage() {
    return (
        <div className="dashboard-container">
            <div className="dashboard-menu-wrapper">
                <DashboardMenu />
            </div>

            <div className="content-container">
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
