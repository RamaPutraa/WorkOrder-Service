import { useState } from "react";
import { handleApi } from "@/lib/handle-api";
import { createMembercodeApi } from "../services/membercodeService";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useNavigate } from "react-router-dom";
import type { CreateMembercodeRequest } from "../types/membercode";
import { useMembercodeStore } from "@/store/membercodeStore";

export const useCreateMembercode = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const { clearCache } = useMembercodeStore();

	const createMembercode = async (data: CreateMembercodeRequest) => {
		setLoading(true);

		const { error } = await handleApi(() => createMembercodeApi(data));
		setLoading(false);

		if (error) {
			notifyError("Gagal membuat kode berlangganan", error.message);
			return false;
		}

		clearCache();
		notifySuccess("Kode berlangganan berhasil dibuat!");
		navigate(-1);
		return true;
	};

	return {
		createMembercode,
		loading,
	};
};
