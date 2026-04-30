import { create } from "zustand";
import { handleApi } from "@/lib/handle-api";
import {
	getInternalCompanyWorkOrderDetail,
	getWorkOrderReport,
} from "../features/owner/company-wo/services/company-wo-service";
import { getFormByIdApi } from "../features/owner/form/services/formService";

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
	reportData: WorkReport | null;
	formObject: Form | null;
	status: CacheStatus;
	reportStatus: CacheStatus;
	formStatus: CacheStatus;
	lastFetchedAt: number | null;
	reportLastFetchedAt: number | null;
	formLastFetchedAt: number | null;
	error: string | null;
	reportError: string | null;
	formError: string | null;
}

interface WoDetailStoreState {
	cache: Record<string, WoCacheEntry>;

	/**
	 * Fetch WO detail berdasarkan ID.
	 */
	fetchWoDetail: (id: string, force?: boolean) => Promise<void>;

	/**
	 * Fetch report detail berdasarkan ID WO.
	 */
	fetchReport: (id: string, force?: boolean) => Promise<void>;

	/**
	 * Fetch form detail berdasarkan form ID (disimpan per WO ID).
	 */
	fetchReportForm: (woId: string, formId: string, force?: boolean) => Promise<void>;

	/**
	 * Update sebagian data WO di cache secara lokal.
	 */
	updateWoLocal: (
		id: string,
		updatedFields: Partial<WorkOrderDetail & { meta?: WorkOrderMeta }>,
	) => void;

	/**
	 * Update data report di cache secara lokal.
	 */
	updateReportLocal: (id: string, report: WorkReport) => void;

	/**
	 * Update data form di cache secara lokal.
	 */
	updateFormLocal: (id: string, form: Form) => void;

	/**
	 * Hapus cache untuk WO tertentu.
	 */
	invalidateCache: (id: string) => void;

	/**
	 * Getters
	 */
	getWoDetail: (
		id: string,
	) => (WorkOrderDetail & { meta?: WorkOrderMeta }) | null;
	getReportDetail: (id: string) => WorkReport | null;
	getFormObject: (id: string) => Form | null;
	isInitialLoading: (id: string) => boolean;
	isRefreshing: (id: string) => boolean;
	isReportLoading: (id: string) => boolean;
	isFormLoading: (id: string) => boolean;
	isReady: (id: string) => boolean;
	isReportReady: (id: string) => boolean;
	isFormReady: (id: string) => boolean;
	getError: (id: string) => string | null;
	getReportError: (id: string) => string | null;
	getFormError: (id: string) => string | null;
}

const DEFAULT_ENTRY: WoCacheEntry = {
	data: null,
	reportData: null,
	formObject: null,
	status: "idle",
	reportStatus: "idle",
	formStatus: "idle",
	lastFetchedAt: null,
	reportLastFetchedAt: null,
	formLastFetchedAt: null,
	error: null,
	reportError: null,
	formError: null,
};

export const useWoDetailStore = create<WoDetailStoreState>((set, get) => ({
	cache: {},

	fetchWoDetail: async (id, force = false) => {
		const currentEntry = get().cache[id] ?? DEFAULT_ENTRY;
		const hasCache = currentEntry.status === "ready";
		const isAlreadyFetching =
			currentEntry.status === "fetching" ||
			currentEntry.status === "refreshing";

		if (isAlreadyFetching && !force) return;
		if (hasCache && !force) return;

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
					...(state.cache[id] ?? DEFAULT_ENTRY),
					data: woData,
					status: "ready",
					lastFetchedAt: Date.now(),
					error: null,
				},
			},
		}));
	},

	fetchReport: async (id, force = false) => {
		const currentEntry = get().cache[id] ?? DEFAULT_ENTRY;
		const hasCache = currentEntry.reportStatus === "ready";
		const isAlreadyFetching =
			currentEntry.reportStatus === "fetching" ||
			currentEntry.reportStatus === "refreshing";

		if (isAlreadyFetching && !force) return;
		if (hasCache && !force) return;

		const nextStatus: CacheStatus = hasCache ? "refreshing" : "fetching";

		set((state) => ({
			cache: {
				...state.cache,
				[id]: {
					...(state.cache[id] ?? DEFAULT_ENTRY),
					reportStatus: nextStatus,
					reportError: null,
				},
			},
		}));

		const { data: res, error } = await handleApi(() => getWorkOrderReport(id));

		if (error) {
			set((state) => ({
				cache: {
					...state.cache,
					[id]: {
						...(state.cache[id] ?? DEFAULT_ENTRY),
						reportStatus: "error",
						reportError: error.message,
					},
				},
			}));
			return;
		}

		set((state) => ({
			cache: {
				...state.cache,
				[id]: {
					...(state.cache[id] ?? DEFAULT_ENTRY),
					reportData: res?.data ?? null,
					reportStatus: "ready",
					reportLastFetchedAt: Date.now(),
					reportError: null,
				},
			},
		}));
	},

	fetchReportForm: async (woId, formId, force = false) => {
		const currentEntry = get().cache[woId] ?? DEFAULT_ENTRY;
		const hasCache = currentEntry.formStatus === "ready" && currentEntry.formObject?._id === formId;
		const isAlreadyFetching = currentEntry.formStatus === "fetching" || currentEntry.formStatus === "refreshing";

		if (isAlreadyFetching && !force) return;
		if (hasCache && !force) return;

		const nextStatus: CacheStatus = hasCache ? "refreshing" : "fetching";

		set((state) => ({
			cache: {
				...state.cache,
				[woId]: {
					...(state.cache[woId] ?? DEFAULT_ENTRY),
					formStatus: nextStatus,
					formError: null,
				},
			},
		}));

		const { data: res, error } = await handleApi(() => getFormByIdApi(formId));

		if (error) {
			set((state) => ({
				cache: {
					...state.cache,
					[woId]: {
						...(state.cache[woId] ?? DEFAULT_ENTRY),
						formStatus: "error",
						formError: error.message,
					},
				},
			}));
			return;
		}

		set((state) => ({
			cache: {
				...state.cache,
				[woId]: {
					...(state.cache[woId] ?? DEFAULT_ENTRY),
					formObject: res?.data ?? null,
					formStatus: "ready",
					formLastFetchedAt: Date.now(),
					formError: null,
				},
			},
		}));
	},

	updateWoLocal: (id, updatedFields) => {
		set((state) => {
			const existing = state.cache[id];
			if (!existing?.data) return state;

			return {
				cache: {
					...state.cache,
					[id]: {
						...existing,
						data: {
							...existing.data,
							...updatedFields,
							updatedAt: new Date().toISOString(),
						},
					},
				},
			};
		});
	},

	updateReportLocal: (id, report) => {
		set((state) => ({
			cache: {
				...state.cache,
				[id]: {
					...(state.cache[id] ?? DEFAULT_ENTRY),
					reportData: report,
					reportStatus: "ready",
					reportLastFetchedAt: Date.now(),
				},
			},
		}));
	},

	updateFormLocal: (id, form) => {
		set((state) => ({
			cache: {
				...state.cache,
				[id]: {
					...(state.cache[id] ?? DEFAULT_ENTRY),
					formObject: form,
					formStatus: "ready",
					formLastFetchedAt: Date.now(),
				},
			},
		}));
	},

	invalidateCache: (id) => {
		set((state) => {
			const newCache = { ...state.cache };
			delete newCache[id];
			return { cache: newCache };
		});
	},

	getWoDetail: (id) => get().cache[id]?.data ?? null,

	getReportDetail: (id) => get().cache[id]?.reportData ?? null,

	getFormObject: (id) => get().cache[id]?.formObject ?? null,

	isInitialLoading: (id) => {
		const status = get().cache[id]?.status ?? "idle";
		return status === "fetching" || status === "idle";
	},

	isRefreshing: (id) => get().cache[id]?.status === "refreshing",

	isReportLoading: (id) => {
		const status = get().cache[id]?.reportStatus ?? "idle";
		return status === "fetching" || status === "idle";
	},

	isFormLoading: (id) => {
		const status = get().cache[id]?.formStatus ?? "idle";
		return status === "fetching" || status === "idle";
	},

	isReady: (id) => get().cache[id]?.status === "ready",

	isReportReady: (id) => get().cache[id]?.reportStatus === "ready",

	isFormReady: (id) => get().cache[id]?.formStatus === "ready",

	getError: (id) => get().cache[id]?.error ?? null,

	getReportError: (id) => get().cache[id]?.reportError ?? null,

	getFormError: (id) => get().cache[id]?.formError ?? null,
}));
