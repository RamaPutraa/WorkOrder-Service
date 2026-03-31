import { create } from "zustand";

const CACHE_TTL = 5 * 60 * 1000; // 5 menit dalam milidetik

type MembercodeCacheState = {
	// ── List Membercodes ──
	membercodes: Membercode[];
	membercodesFetchedAt: number | null; // timestamp epoch (ms)

	// ── Helpers ──
	isMembercodesStale: () => boolean;

	// ── Setters ──
	setMembercodes: (membercodes: Membercode[]) => void;
	clearCache: () => void;
};

export const useMembercodeStore = create<MembercodeCacheState>()(
	(set, get) => ({
		membercodes: [],
		membercodesFetchedAt: null,

		// Cek apakah cache sudah kedaluwarsa (lebih dari 5 menit)
		isMembercodesStale: () => {
			const { membercodesFetchedAt } = get();
			if (!membercodesFetchedAt) return true;
			return Date.now() - membercodesFetchedAt > CACHE_TTL;
		},

		// Simpan list membercodes beserta timestamp saat ini
		setMembercodes: (membercodes) => {
			set({ membercodes, membercodesFetchedAt: Date.now() });
		},

		// Hapus seluruh cache (berguna setelah create/delete)
		clearCache: () => {
			set({ membercodes: [], membercodesFetchedAt: null });
		},
	}),
);
