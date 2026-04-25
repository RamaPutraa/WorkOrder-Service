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
		updateWoLocal,
		invalidateCache,
		getWoDetail,
		isInitialLoading,
		isRefreshing,
		isReady,
		getError,
	} = useWoDetailStore();

	// ─── Initial Fetch ──────────────────────────────────────────────────────────
	// Hanya fetch jika woId tersedia dan belum ada di cache.
	useEffect(() => {
		if (!woId) return;
		void fetchWoDetail(woId);
	}, [woId]);

	// ─── Window Focus Refetch ───────────────────────────────────────────────────
	// Ketika tab kembali aktif (user kembali ke browser/tab ini),
	// lakukan refetch di background untuk menangkap perubahan dari user lain (multi-role).
	useEffect(() => {
		if (!woId) return;

		const handleFocus = () => {
			// Hanya refetch jika data sudah pernah berhasil di-fetch sebelumnya.
			// Ini mencegah double-fetch saat halaman pertama kali dimuat.
			if (isReady(woId)) {
				void fetchWoDetail(woId, true); // force = true → background refresh
			}
		};

		window.addEventListener("focus", handleFocus);
		return () => window.removeEventListener("focus", handleFocus);
	}, [woId]);

	// ─── Exposed API ────────────────────────────────────────────────────────────

	/** Data WO dari cache (null jika belum ada). */
	const woDetail = woId ? getWoDetail(woId) : null;

	/** True saat loading PERTAMA KALI (belum ada cache) → tampilkan skeleton/loading. */
	const isLoading = woId ? isInitialLoading(woId) : false;

	/** True saat refetch di background → JANGAN tampilkan loading spinner utama. */
	const isBackgroundRefreshing = woId ? isRefreshing(woId) : false;

	/** Error jika fetch gagal. */
	const error = woId ? getError(woId) : null;

	/**
	 * Trigger refetch dari server secara background.
	 * Gunakan setelah mutasi yang dampaknya tidak dapat diprediksi secara lokal
	 * (misal: `approveWorkOrderApi` yang mengubah `meta.workOrderCapabilities`).
	 */
	const refreshBackground = () => {
		if (!woId) return;
		void fetchWoDetail(woId, true);
	};

	/**
	 * Update state lokal di cache tanpa hit API.
	 * Gunakan setelah mutasi yang dampaknya sudah diketahui pasti
	 * (misal: `assignStaffToWorkOrderApi` → update `assignedStaff` & `staffPIC`).
	 *
	 * CATATAN: Setelah ini, background refresh tetap akan terjadi saat
	 * window kembali fokus, jadi data tidak akan basi untuk waktu yang lama.
	 */
	const updateLocal = (
		updatedFields: Partial<WorkOrderDetail & { meta?: WorkOrderMeta }>,
	) => {
		if (!woId) return;
		updateWoLocal(woId, updatedFields);
	};

	/**
	 * Hapus cache dan paksa fetch ulang dari server.
	 * Gunakan untuk kasus yang benar-benar perlu data fresh (jarang digunakan).
	 */
	const forceRefetch = () => {
		if (!woId) return;
		invalidateCache(woId);
		void fetchWoDetail(woId);
	};

	return {
		woDetail,
		isLoading,
		isBackgroundRefreshing,
		error,
		refreshBackground,
		updateLocal,
		forceRefetch,
	};
};
