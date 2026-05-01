import apiCLient from "@/lib/api";

export interface UploadFileResponse {
	message: string;
	data: {
		url: string;
	};
}

export const uploadFileApi = async (file: File): Promise<UploadFileResponse> => {
	const formData = new FormData();
	formData.append("file", file);

	const response = await apiCLient.post<UploadFileResponse>("/files", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return response.data;
};
