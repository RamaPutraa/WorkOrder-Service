import { useState, useCallback } from "react";
import { handleApi } from "@/lib/handle-api";
import { getAllMembership } from "../services/pairing-company";

export const useMembership = () => {
	const [memberships, setMemberships] = useState<GetAllMember[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchMemberships = useCallback(async () => {
		setLoading(true);
		setError(null);

		const { data, error: apiError } = await handleApi(() => getAllMembership());
		setLoading(false);

		if (apiError) {
			setError(apiError.message);
			return;
		}

		setMemberships(data?.data ?? []);
	}, []);

	return {
		memberships,
		loading,
		error,
		fetchMemberships,
	};
};
