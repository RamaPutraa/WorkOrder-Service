type InternalWorkOrder = {
	_id: string;
	clientServiceRequestId: string;
	companyId: string;
	relateWorkOrderId?: string;
	assignedStaff: Staff[];
	status: string;
	createdAt: string;
	updatedAt: string;
	startAt?: string;
	completedAt?: string;
	createdBy: User;
	service: Service;
};
type InternalWorkOrderResponse = ApiResponse<InternalWorkOrder[]>;
