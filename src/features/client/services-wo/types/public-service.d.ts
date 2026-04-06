// TODO:nanti pake ini kalo endpoint get intake udah jadi
// get intake form
type RequesterSRIntakeRequest = ApiResponse<RequesterSR>; //TODO:versi ini belum ada fiturnya di internal (staff yang request)

// get detail service company form client
type PublicDetailService = ApiResponse<
	{
		order: number;
		form: Form;
	}[]
>;

// client submit intake form
type FieldData = {
	order: number;
	value: string | number | string[] | File | null;
};
type PublicSubmitRequest = {
	submissions: {
		formId: string;
		fieldsData: FieldData[];
	}[];
};
type PublicSubmitResponse = ApiResponse<{
	data: PublicServiceSubmited;
}>;

// get requester service request
