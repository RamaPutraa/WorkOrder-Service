import { useState, useEffect } from "react";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { handleApi } from "@/lib/handle-api";
import { useServiceStore } from "@/store/serviceStore";
import { usePricingStore } from "@/store/pricingStore";
import {
	getAllServicePricingApi,
	createServicePricingApi,
	updateServicePricingApi,
	deleteServicePricingApi,
} from "../services/pricing";

export const usePricing = () => {
	// === Loading / Error ===
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	// === Data ===
	const { pricingList, isPricingStale, setPricingList, clearCache: clearPricingCache } = usePricingStore();

	// === Service Cache ===
	const clearServiceCache = useServiceStore((state) => state.clearCache);

	// === Fetch All ===
	const fetchPricing = async (force: boolean = false) => {
		if (!force && !isPricingStale()) {
			return; // use cache
		}

		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getAllServicePricingApi());
		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data harga", error.message);
			return;
		}
		setPricingList(res?.data ?? []);
	};

	// === Create ===
	const createPricing = async (data: createServicePricingRequest) => {
		setSubmitting(true);
		setError(null);

		const { error } = await handleApi(() => createServicePricingApi(data));
		setSubmitting(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal menambahkan harga", error.message);
			return false;
		}

		notifySuccess("Harga layanan berhasil ditambahkan");
		clearServiceCache(); // invalidate service cache
		clearPricingCache(); // invalidate pricing cache
		await fetchPricing(true);
		return true;
	};

	// === Update ===
	const updatePricing = async (
		id: string,
		data: updateServicePricingRequest,
	) => {
		setSubmitting(true);
		setError(null);

		const { error } = await handleApi(() => updateServicePricingApi(id, data));
		setSubmitting(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memperbarui harga", error.message);
			return false;
		}

		notifySuccess("Harga layanan berhasil diperbarui");
		clearServiceCache(); // invalidate service cache
		clearPricingCache(); // invalidate pricing cache
		await fetchPricing(true);
		return true;
	};

	// === Delete ===
	const deletePricing = async (id: string) => {
		setSubmitting(true);
		setError(null);

		const { error } = await handleApi(() => deleteServicePricingApi(id));
		setSubmitting(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal menghapus harga", error.message);
			return false;
		}

		notifySuccess("Harga layanan berhasil dihapus");
		clearServiceCache(); // invalidate service cache
		clearPricingCache(); // invalidate pricing cache
		await fetchPricing(true);
		return true;
	};

	useEffect(() => {
		void fetchPricing();
	}, []);

	return {
		// === STATE ===
		loading,
		error,
		submitting,
		pricingList,

		// === HANDLERS ===
		fetchPricing,
		createPricing,
		updatePricing,
		deletePricing,
	};
};
