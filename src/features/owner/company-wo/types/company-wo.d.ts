type InternalWorkOrder = {
	_id: string;
	clientServiceRequestId: string;
	companyId: string;
	relateWorkOrderId?: string;
	assignedStaffs: User[];
	status: string;
	createdAt: string;
	updatedAt: string;
	startedAt?: string;
	completedAt?: string;
	createdBy: User;
	service: Service;
};
type InternalWorkOrderResponse = ApiResponse<InternalWorkOrder[]>;

type DetailInternalWorkOrder = InternalWorkOrder & {
	workorderForms: OrderForms[];
	submissions: PublicSubmission[];
};
type DetailInternalWorkOrderResponse = ApiResponse<DetailInternalWorkOrder>;
