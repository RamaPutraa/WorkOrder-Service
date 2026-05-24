import { useState } from "react";
import { handleApi } from "@/lib/handle-api";
import { uploadMembercodeApi } from "../services/membercodeService";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useMembercodeStore } from "@/store/membercodeStore";

export const useCreateMembercode = () => {
	const [loading, setLoading] = useState(false);
	const { clearCache } = useMembercodeStore();

	const createMembercode = async (data: createMemberCodeRequest) => {
		setLoading(true);

		// Gunakan FormData secara manual jika diperlukan oleh backend (opsional, tergantung implementasi Axios)
		const formData = new FormData();
		formData.append("file", data.file);

		// Atur request format
		const requestData = { file: data.file };

		const { error } = await handleApi(() => uploadMembercodeApi(requestData));
		setLoading(false);

		if (error) {
			notifyError("Gagal mengunggah kode berlangganan", error.message);
			return false;
		}

		clearCache();
		notifySuccess("Kode berlangganan berhasil diunggah!");
		return true;
	};

	return {
		createMembercode,
		loading,
	};
};
