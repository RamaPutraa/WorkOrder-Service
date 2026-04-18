// get all work order
type GetAllWorkOrderResponse = ApiResponse<WorkOrder[]>;

// create rejected work order
// request id from sr id
type CreateRejectedWorkOrderResponse = ApiResponse<WorkOrder>;

// assigned staff
// get employee
type AssignStaffToWorkOrder = ApiResponse<StaffItem[]> & {
	meta: {
		count: number;
	};
};
// assign staff to wo
type AssignStaffToWorkOrderRequest = {
	staff_pic?: string | null;
	assign_staffs: string[];
};
type AssignStaffToWorkOrderResponse = ApiResponse<WorkOrder>;

// submit wo
type SubmitWorkOrderResponse = ApiResponse<WorkOrder>;

// completed wo
type CompleteWorkOrderRequest = {
	issue: string;
};
type CompleteWorkOrderResponse = ApiResponse<WorkOrder>;

// fail wo
type FailWorkOrderRequest = {
	issue: string;
};
type FailWorkOrderResponse = ApiResponse<WorkOrder>;

// get wo report
