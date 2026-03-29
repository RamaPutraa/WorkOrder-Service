import { create } from "zustand";

const CACHE_TTL = 5 * 60 * 1000; // 5 menit dalam milidetik

type ServiceCacheState = {
	// ── List Services ──
	services: Service[];
	servicesFetchedAt: number | null; // timestamp epoch (ms)

	// ── Detail Service (per ID) ──
	detailCache: Record<string, { data: Service; fetchedAt: number }>;

	// ── Helpers ──
	isServicesStale: () => boolean;
	isDetailStale: (id: string) => boolean;

	// ── Setters ──
	setServices: (services: Service[]) => void;
	setDetailService: (id: string, service: Service) => void;
	clearCache: () => void;
};

export const useServiceStore = create<ServiceCacheState>()((set, get) => ({
	services: [],
	servicesFetchedAt: null,
	detailCache: {},

	// Cek apakah cache list sudah kedaluwarsa (lebih dari 5 menit)
	isServicesStale: () => {
		const { servicesFetchedAt } = get();
		if (!servicesFetchedAt) return true;
		return Date.now() - servicesFetchedAt > CACHE_TTL;
	},

	// Cek apakah cache detail untuk ID tertentu sudah kedaluwarsa
	isDetailStale: (id: string) => {
		const { detailCache } = get();
		const cached = detailCache[id];
		if (!cached) return true;
		return Date.now() - cached.fetchedAt > CACHE_TTL;
	},

	// Simpan list services beserta timestamp saat ini
	setServices: (services) => {
		set({ services, servicesFetchedAt: Date.now() });
	},

	// Simpan detail service per ID beserta timestamp
	setDetailService: (id, service) => {
		set((state) => ({
			detailCache: {
				...state.detailCache,
				[id]: { data: service, fetchedAt: Date.now() },
			},
		}));
	},

	// Hapus seluruh cache (berguna setelah create/edit/delete)
	clearCache: () => {
		set({ services: [], servicesFetchedAt: null, detailCache: {} });
	},
}));
