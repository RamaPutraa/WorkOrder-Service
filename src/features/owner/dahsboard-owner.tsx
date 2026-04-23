import DsServiceRequest from "@/shared/components/ds-service-request";
import Welcome from "@/shared/components/welcome";
import DsStaffDepartement from "@/shared/components/ds-staff-departement";
import DsWorkOrder from "@/shared/components/ds-work-order";

const DashboardOwner = () => {
	return (
		<div className="space-y-10">
			<Welcome />
			<DsServiceRequest />
			<DsWorkOrder />
			<DsStaffDepartement />
		</div>
	);
};

export default DashboardOwner;
