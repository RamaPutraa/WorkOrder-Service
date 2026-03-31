import { create } from "zustand";

const CACHE_TTL = 5 * 60 * 1000; // 5 menit dalam milidetik

type PositionStore = {
	positions: Position[];
	positionsFetchedAt: number | null;

	isPositionsStale: () => boolean;

	setPositions: (positions: Position[]) => void;
	clearPositions: () => void;
};

export const usePositionStore = create<PositionStore>((set, get) => ({
	positions: [],
	positionsFetchedAt: null,
	isPositionsStale: () => {
		const { positionsFetchedAt } = get();
		if (!positionsFetchedAt) return true;
		return Date.now() - positionsFetchedAt > CACHE_TTL;
	},
	setPositions: (positions) =>
		set({ positions, positionsFetchedAt: Date.now() }),
	clearPositions: () => set({ positions: [], positionsFetchedAt: null }),
}));
