import apiClient from "@/lib/api";

// toggle active/inactive FAQ
export const toggleActiveFaqApi = async (isActive: boolean) => {
	const response = await apiClient.put<isActiveFaqResponse>(
		"/faq/toggle-active",
		{
			isActive,
		},
	);
	return response.data;
};

// get all FAQ items
export const getFaqListApi = async () => {
	const response = await apiClient.get<FaqListResponse>("/faq/docs");
	return response.data;
};

// upload text FAQ
export const uploadFaqTextApi = async (data: FaqTextRequest) => {
	const response = await apiClient.post<FaqTextResponse>(
		"/faq/text-docs",
		data,
	);
	return response.data;
};

// upload PDF FAQ
export const uploadFaqPdfApi = async (data: FaqFileRequest) => {
	const formData = new FormData();
	formData.append("title", data.title);
	formData.append("file", data.file);

	const response = await apiClient.post<FaqFileResponse>(
		"/faq/pdf-docs",
		formData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		},
	);
	return response.data;
};

// delete FAQ item by id
export const deleteFaqApi = async (id: number) => {
	const response = await apiClient.delete<FaqDeleteResponse>(`/faq/docs/${id}`);
	return response.data;
};
