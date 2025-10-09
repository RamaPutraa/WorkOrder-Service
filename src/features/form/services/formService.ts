import api from "@/lib/api";

// export const getFormsApi = async () => {
// 	const response = await api.get<GetFormResponse>("/forms");
// 	return response.data;
// };

// export const getFormByIdApi = async (id: string) => {
// 	const response = await api.get<GetFormByIdResponse>(`/forms/${id}`);
// 	return response.data;
// };

export const createFormApi = async (data: CreateFormRequest) => {
	const response = await api.post<FormResponse>("/forms", data);
	return response.data;
};

// Dummy untuk ambil daftar posisi
export const getAllowedPositions = async () => {
	// contoh simulasi API, kamu bisa ganti nanti
	return [
		{ _id: "pos1", name: "Ketua" },
		{ _id: "pos2", name: "Sekretaris" },
		{ _id: "pos3", name: "Bendahara" },
	];
};

// Dummy untuk akses user
export const getAccessTypes = async () => {
	return [
		{ key: "owner", name: "Owner" },
		{ key: "manager", name: "Manager" },
		{ key: "staff", name: "Staff" },
		{ key: "client", name: "Client" },
	];
};
