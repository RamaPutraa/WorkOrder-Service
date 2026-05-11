import Welcome from "../components/welcome";
import DsCompany from "../components/ds-company";
import DsServiceRequest from "../components/ds-service-request";
import DsWorkOrder from "../components/ds-work-order";

const DashboardOwner = () => {
	return (
		<div className="space-y-8 pb-8">
			<Welcome />
			<DsCompany />
			<DsServiceRequest />
			<DsWorkOrder />
		</div>
	);
};

export default DashboardOwner;
