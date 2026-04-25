import { create } from "zustand";
import { handleApi } from "@/lib/handle-api";
import { getInternalCompanyWorkOrderDetail } from "../features/owner/company-wo/services/company-wo-service";

/**
 * Status cache per WO ID:
 * - "idle"       : belum pernah di-fetch
 * - "fetching"   : sedang fetch pertama kali (tampilkan loading)
 * - "refreshing" : sedang refetch di background (sudah ada cache, tidak tampilkan loading)
 * - "ready"      : data tersedia di cache
 * - "error"      : fetch gagal
 */
type CacheStatus = "idle" | "fetching" | "refreshing" | "ready" | "error";

interface WoCacheEntry {
	data: (WorkOrderDetail & { meta?: WorkOrderMeta }) | null;
	status: CacheStatus;
	lastFetchedAt: number | null; // epoch ms, untuk mendeteksi staleness
	error: string | null;
}

interface WoDetailStoreState {
	cache: Record<string, WoCacheEntry>;

	/**
	 * Fetch WO detail berdasarkan ID.
	 * - Jika belum ada di cache → fetch biasa (tampilkan loading).
	 * - Jika sudah ada di cache → fetch di background (tidak tampilkan loading).
	 * - Paksa refetch dengan force = true.
	 */
	fetchWoDetail: (id: string, force?: boolean) => Promise<void>;

	/**
	 * Update sebagian data WO di cache secara lokal tanpa hit API.
	 * Gunakan setelah aksi mutasi berhasil jika data yang berubah sudah pasti.
	 */
	updateWoLocal: (
		id: string,
		updatedFields: Partial<WorkOrderDetail & { meta?: WorkOrderMeta }>,
	) => void;

	/**
	 * Hapus cache untuk WO tertentu, memaksanya refetch dari server saat diakses lagi.
	 */
	invalidateCache: (id: string) => void;

	/**
	 * Getter: ambil data WO dari cache (atau null jika belum ada).
	 */
	getWoDetail: (
		id: string,
	) => (WorkOrderDetail & { meta?: WorkOrderMeta }) | null;

	/**
	 * Getter: apakah sedang loading awal (bukan background refresh)?
	 */
	isInitialLoading: (id: string) => boolean;

	/**
	 * Getter: apakah sedang background refresh?
	 */
	isRefreshing: (id: string) => boolean;

	/**
	 * Getter: apakah data cache sudah ada (ready)?
	 */
	isReady: (id: string) => boolean;

	/**
	 * Getter: error untuk WO tertentu.
	 */
	getError: (id: string) => string | null;
}

const DEFAULT_ENTRY: WoCacheEntry = {
	data: null,
	status: "idle",
	lastFetchedAt: null,
	error: null,
};

export const useWoDetailStore = create<WoDetailStoreState>((set, get) => ({
	cache: {},

	fetchWoDetail: async (id, force = false) => {
		const currentEntry = get().cache[id] ?? DEFAULT_ENTRY;

		// Jika sudah ada data di cache dan tidak dipaksa, jalankan sebagai background refresh.
		// Jika belum ada sama sekali, jalankan sebagai initial fetch (status "fetching").
		const hasCache = currentEntry.status === "ready";
		const isAlreadyFetching =
			currentEntry.status === "fetching" ||
			currentEntry.status === "refreshing";

		// Hindari request ganda yang berjalan bersamaan untuk ID yang sama.
		if (isAlreadyFetching && !force) return;

		// Skip jika sudah ada cache dan tidak dipaksa.
		if (hasCache && !force) return;

		// Tentukan mode: initial load atau background refresh.
		const nextStatus: CacheStatus = hasCache ? "refreshing" : "fetching";

		set((state) => ({
			cache: {
				...state.cache,
				[id]: {
					...(state.cache[id] ?? DEFAULT_ENTRY),
					status: nextStatus,
					error: null,
				},
			},
		}));

		const { data: res, error } = await handleApi(() =>
			getInternalCompanyWorkOrderDetail(id),
		);

		if (error) {
			set((state) => ({
				cache: {
					...state.cache,
					[id]: {
						...(state.cache[id] ?? DEFAULT_ENTRY),
						status: "error",
						error: error.message,
					},
				},
			}));
			return;
		}

		const woData =
			res?.data ?
				{
					...res.data,
					...(res.meta ? { meta: res.meta } : {}),
				}
			:	null;

		set((state) => ({
			cache: {
				...state.cache,
				[id]: {
					data: woData,
					status: "ready",
					lastFetchedAt: Date.now(),
					error: null,
				},
			},
		}));
	},

	updateWoLocal: (id, updatedFields) => {
		set((state) => {
			const existing = state.cache[id];
			if (!existing?.data) return state; // jika tidak ada di cache, abaikan

			return {
				cache: {
					...state.cache,
					[id]: {
						...existing,
						data: {
							...existing.data,
							...updatedFields,
							updatedAt: new Date().toISOString(), // selalu update timestamp
						},
					},
				},
			};
		});
	},

	invalidateCache: (id) => {
		set((state) => {
			const newCache = { ...state.cache };
			delete newCache[id];
			return { cache: newCache };
		});
	},

	getWoDetail: (id) => get().cache[id]?.data ?? null,

	isInitialLoading: (id) => {
		const status = get().cache[id]?.status ?? "idle";
		return status === "fetching" || status === "idle";
	},

	isRefreshing: (id) => get().cache[id]?.status === "refreshing",

	isReady: (id) => get().cache[id]?.status === "ready",

	getError: (id) => get().cache[id]?.error ?? null,
}));
