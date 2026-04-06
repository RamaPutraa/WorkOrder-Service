// TODO:nanti pake ini kalo endpoint get intake udah jadi
// get intake form
type RequesterSRIntakeFormResponse = ApiResponse<{
	form: Form;
}>; //TODO:versi ini belum ada fiturnya di internal (staff yang request)

// get detail service company form client
// type PublicDetailService = ApiResponse<
// 	{
// 		order: number;
// 		form: Form;
// 	}[]
// >;

// client submit intake form
type FieldData = {
	order: number;
	value: string | number | string[] | File | null;
};
// TODO:bisa jadi global
type RequesterSubmitRequest = {
	submissions: {
		formId: string;
		fieldsData: FieldData[];
	}[];
};
type RequesterSubmitResponse = ApiResponse<{
	data: RequesterSR;
}>;

// get requester service request
