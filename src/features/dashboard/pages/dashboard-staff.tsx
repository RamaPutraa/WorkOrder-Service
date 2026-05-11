import Welcome from "../components/welcome";
import DsWorkOrder from "../components/ds-work-order";
import DsServiceRequest from "../components/ds-service-request";

const DashboardStaff = () => {
	return (
		<div className="space-y-8 pb-8">
			<Welcome />
			<DsServiceRequest />
			<DsWorkOrder />
		</div>
	);
};

export default DashboardStaff;
