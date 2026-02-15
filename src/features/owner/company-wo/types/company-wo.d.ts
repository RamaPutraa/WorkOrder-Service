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

type WorkOrderFormItem = {
	order: number;
	form: Form;
	fieldsData?: FieldData[];
};

type DetailInternalWorkOrder = InternalWorkOrder & {
	workorderForms: WorkOrderFormItem[];
	submissions: PublicSubmission[];
};
type DetailInternalWorkOrderResponse = ApiResponse<DetailInternalWorkOrder>;

// wo submit
type AssignStaffToWorkOrder = ApiResponse<StaffItem[]> & {
	meta: {
		count: number;
	};
};

// wo report
type WorkOrderReport = {
	_id: string;
	workOrderId: string;
	companyId: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	startedAt: string | null;
	completedAt: string | null;
	reportForms: {
		order: number;
		form: Form;
	}[];
	submissions: PublicSubmission[];
};

type WorkOrderReportResponse = ApiResponse<WorkOrderReport>;
