import { create } from "zustand";

const CACHE_TTL = 5 * 60 * 1000; // 5 menit dalam milidetik

type PricingCacheState = {
	// ── List Pricing ──
	pricingList: pricing[];
	pricingFetchedAt: number | null; // timestamp epoch (ms)

	// ── Helpers ──
	isPricingStale: () => boolean;

	// ── Setters ──
	setPricingList: (pricingList: pricing[]) => void;
	clearCache: () => void;
};

export const usePricingStore = create<PricingCacheState>()((set, get) => ({
	pricingList: [],
	pricingFetchedAt: null,

	// Cek apakah cache list sudah kedaluwarsa (lebih dari 5 menit)
	isPricingStale: () => {
		const { pricingFetchedAt } = get();
		if (!pricingFetchedAt) return true;
		return Date.now() - pricingFetchedAt > CACHE_TTL;
	},

	// Simpan list pricing beserta timestamp saat ini
	setPricingList: (pricingList) => {
		set({ pricingList, pricingFetchedAt: Date.now() });
	},

	// Hapus seluruh cache (berguna setelah create/edit/delete)
	clearCache: () => {
		set({ pricingList: [], pricingFetchedAt: null });
	},
}));
