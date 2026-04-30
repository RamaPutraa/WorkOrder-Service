import { useEffect } from "react";
import { useWoDetailStore } from "../../../../store/wo-detail-store";

/**
 * Hook utama untuk mengakses dan menjaga sinkronisasi data detail WO.
 *
 * Strategi:
 * 1. Saat pertama kali dipanggil → fetch dari API (initial load).
 * 2. Saat window kembali fokus  → refetch di background (tanpa loading spinner).
 * 3. Saat action mutasi berhasil → caller bisa pilih:
 *    - `refreshBackground()` : refetch dari server di background (aman untuk multi-role).
 *    - `updateLocal(fields)`  : update state lokal saja (cepat, untuk aksi yang user sendiri lakukan).
 *
 * @param woId - ID dari work order yang ingin di-sync
 */
export const useWoDetailSync = (woId: string | undefined) => {
	const {
		fetchWoDetail,
		fetchReport,
		fetchReportForm,
		updateWoLocal,
		updateReportLocal,
		updateFormLocal,
		invalidateCache,
		getWoDetail,
		getReportDetail,
		getFormObject,
		isInitialLoading,
		isRefreshing,
		isReportLoading,
		isFormLoading,
		getError,
		getReportError,
		getFormError,
	} = useWoDetailStore();

	// ─── Initial Fetch ──────────────────────────────────────────────────────────
	// Hanya fetch jika woId tersedia dan belum ada di cache.
	useEffect(() => {
		if (!woId) return;
		void fetchWoDetail(woId);
	}, [woId]);

	// ─── Exposed API ────────────────────────────────────────────────────────────

	/** Data WO dari cache (null jika belum ada). */
	const woDetail = woId ? getWoDetail(woId) : null;

	/** Data Report dari cache (null jika belum ada). */
	const reportData = woId ? getReportDetail(woId) : null;

	/** Data Form dari cache. */
	const formObject = woId ? getFormObject(woId) : null;

	/** True saat loading PERTAMA KALI (belum ada cache) → tampilkan skeleton/loading. */
	const isLoading = woId ? isInitialLoading(woId) : false;

	/** True saat loading report PERTAMA KALI. */
	const isReportFetching = woId ? isReportLoading(woId) : false;

	/** True saat loading form PERTAMA KALI. */
	const isFormFetching = woId ? isFormLoading(woId) : false;

	/** True saat refetch di background → JANGAN tampilkan loading spinner utama. */
	const isBackgroundRefreshing = woId ? isRefreshing(woId) : false;

	/** Error jika fetch WO gagal. */
	const error = woId ? getError(woId) : null;

	/** Error jika fetch report gagal. */
	const reportError = woId ? getReportError(woId) : null;

	/** Error jika fetch form gagal. */
	const formError = woId ? getFormError(woId) : null;

	/**
	 * Trigger refetch WO dari server secara background.
	 */
	const refreshBackground = () => {
		if (!woId) return;
		void fetchWoDetail(woId, true);
	};

	/**
	 * Trigger fetch report dari server.
	 */
	const refreshReport = (force = true) => {
		if (!woId) return;
		void fetchReport(woId, force);
	};

	/**
	 * Trigger fetch form dari server.
	 */
	const refreshFormObject = (formId: string, force = false) => {
		if (!woId) return;
		void fetchReportForm(woId, formId, force);
	};

	/**
	 * Update state lokal WO di cache tanpa hit API.
	 */
	const updateLocal = (
		updatedFields: Partial<WorkOrderDetail & { meta?: WorkOrderMeta }>,
	) => {
		if (!woId) return;
		updateWoLocal(woId, updatedFields);
	};

	/**
	 * Update state lokal report di cache.
	 */
	const updateReport = (report: WorkReport) => {
		if (!woId) return;
		updateReportLocal(woId, report);
	};

	/**
	 * Update state lokal form di cache.
	 */
	const updateForm = (form: Form) => {
		if (!woId) return;
		updateFormLocal(woId, form);
	};

	/**
	 * Hapus cache dan paksa fetch ulang dari server.
	 */
	const forceRefetch = () => {
		if (!woId) return;
		invalidateCache(woId);
		void fetchWoDetail(woId);
	};

	return {
		woDetail,
		reportData,
		formObject,
		isLoading,
		isReportFetching,
		isFormFetching,
		isBackgroundRefreshing,
		error,
		reportError,
		formError,
		refreshBackground,
		refreshReport,
		refreshFormObject,
		updateLocal,
		updateReport,
		updateForm,
		forceRefetch,
	};
};
