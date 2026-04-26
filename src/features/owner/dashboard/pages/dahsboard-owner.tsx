import DsServiceRequest from "@/features/owner/dashboard/components/ds-service-request";
import Welcome from "@/shared/components/welcome";
import DsStaffDepartement from "@/features/owner/dashboard/components/ds-staff-departement";
import DsWorkOrder from "@/features/owner/dashboard/components/ds-work-order";

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
