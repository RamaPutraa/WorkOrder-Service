import Welcome from "../components/welcome";
import DsServiceRequest from "../components/ds-service-request";

const DashboardClient = () => {
	return (
		<div className="space-y-8 pb-10">
			<Welcome />
			<DsServiceRequest />
		</div>
	);
};

export default DashboardClient;
