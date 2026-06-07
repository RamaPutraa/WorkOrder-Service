import { create } from "zustand";

const CACHE_TTL = 5 * 60 * 1000; // 5 menit dalam milidetik

type FormCacheState = {
	// ── List Forms ──
	forms: Form[];
	formsFetchedAt: number | null; // timestamp epoch (ms)

	// ── Detail Form (per ID) ──
	detailCache: Record<string, { data: Form; meta?: { canDelete: boolean }; fetchedAt: number }>;

	// ── Helpers ──
	isFormsStale: () => boolean;
	isDetailStale: (id: string) => boolean;

	// ── Setters ──
	setForms: (forms: Form[]) => void;
	setDetailForm: (id: string, form: Form, meta?: { canDelete: boolean }) => void;
	clearCache: () => void;
};

export const useFormStore = create<FormCacheState>()((set, get) => ({
	forms: [],
	formsFetchedAt: null,
	detailCache: {},

	// Cek apakah cache list sudah kedaluwarsa (lebih dari 5 menit)
	isFormsStale: () => {
		const { formsFetchedAt } = get();
		if (!formsFetchedAt) return true;
		return Date.now() - formsFetchedAt > CACHE_TTL;
	},

	// Cek apakah cache detail untuk ID tertentu sudah kedaluwarsa
	isDetailStale: (id: string) => {
		const { detailCache } = get();
		const cached = detailCache[id];
		if (!cached) return true;
		return Date.now() - cached.fetchedAt > CACHE_TTL;
	},

	// Simpan list forms beserta timestamp saat ini
	setForms: (forms) => {
		set({ forms, formsFetchedAt: Date.now() });
	},

	// Simpan detail form per ID beserta timestamp
	setDetailForm: (id, form, meta) => {
		set((state) => ({
			detailCache: {
				...state.detailCache,
				[id]: { data: form, meta, fetchedAt: Date.now() },
			},
		}));
	},

	// Hapus seluruh cache (berguna setelah create/edit/delete)
	clearCache: () => {
		set({ forms: [], formsFetchedAt: null, detailCache: {} });
	},
}));
