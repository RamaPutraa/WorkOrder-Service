import Welcome from "@/shared/components/welcome";
import DsCompanyList from "../components/ds-company-list";
import DsSummaryCards from "../components/ds-summary-cards";
import DsQuickActions from "../components/ds-quick-actions";
import DsRecentActivities from "../components/ds-recent-activities";

const DashboardClient = () => {
	return (
		<>
			<div className="space-y-6">
				{/* Header with Blue Gradient */}
				<Welcome />

				{/* Summary Cards */}
				<DsSummaryCards />

				{/* Two Column Layout for Quick Actions & Recent Activities */}
				<div className="grid gap-6 md:grid-cols-1 xl:grid-cols-3">
					<div className="xl:col-span-2 space-y-6">
						<DsRecentActivities />
						<DsCompanyList />
					</div>
					<div className="space-y-6">
						<DsQuickActions />
					</div>
				</div>
			</div>
		</>
	);
};

export default DashboardClient;
