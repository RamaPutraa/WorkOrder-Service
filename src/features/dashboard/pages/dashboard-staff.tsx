import Welcome from "../components/welcome";
import DsWorkOrder from "../components/ds-work-order";
import DsServiceRequest from "../components/ds-service-request";
import { useAuthStore } from "@/store/authStore";

const DashboardStaff = () => {
	const { user } = useAuthStore();
	const isUnassigned = user?.role === "staff_unassigned";

	return (
		<div className="space-y-8 pb-8">
			<Welcome />
			{!isUnassigned && <DsServiceRequest />}
			<DsWorkOrder />
		</div>
	);
};

export default DashboardStaff;

