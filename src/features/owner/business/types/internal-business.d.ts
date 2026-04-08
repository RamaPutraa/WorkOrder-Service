// approved response
type SRapproved = {
	serviceRequest: InboxSR;
	workOrder: InternalWorkOrder;
};

type SRapprovedResponse = ApiResponse<SRapproved>;

// reject response
type SRrejectResponse = ApiResponse<InboxSR>;
