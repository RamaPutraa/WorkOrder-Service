import Welcome from "../components/welcome";
import DsServiceRequest from "../components/ds-service-request";
import DsWorkOrder from "../components/ds-work-order";

const DashboardManager = () => {
	return (
		<div className="space-y-8 pb-8">
			<Welcome />
			<DsServiceRequest />
			<DsWorkOrder />
		</div>
	);
};

export default DashboardManager;
