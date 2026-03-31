import { create } from "zustand";

const CACHE_TTL = 5 * 60 * 1000; // 5 menit dalam milidetik

type StaffCompanyStore = {
	staffCompany: Employee[];
	staffCompanyFetchedAt: number | null;

	isStaffCompanyStale: () => boolean;

	setStaffCompany: (staffCompany: Employee[]) => void;
	clearStaffCompany: () => void;
};

export const useStaffCompanyStore = create<StaffCompanyStore>((set, get) => ({
	staffCompany: [],
	staffCompanyFetchedAt: null,
	isStaffCompanyStale: () => {
		const { staffCompanyFetchedAt } = get();
		if (!staffCompanyFetchedAt) return true;
		return Date.now() - staffCompanyFetchedAt > CACHE_TTL;
	},
	setStaffCompany: (staffCompany) =>
		set({ staffCompany, staffCompanyFetchedAt: Date.now() }),
	clearStaffCompany: () =>
		set({ staffCompany: [], staffCompanyFetchedAt: null }),
}));

type StaffHistoryStore = {
	staffHistorys: InvitationsHistory[];
	staffHistorysFetchedAt: number | null;

	isStaffHistoryStale: () => boolean;

	setStaffHistorys: (staffHistorys: InvitationsHistory[]) => void;
	clearStaffHistorys: () => void;
};

export const useStaffHistoryStore = create<StaffHistoryStore>((set, get) => ({
	staffHistorys: [],
	staffHistorysFetchedAt: null,
	isStaffHistoryStale: () => {
		const { staffHistorysFetchedAt } = get();
		if (!staffHistorysFetchedAt) return true;
		return Date.now() - staffHistorysFetchedAt > CACHE_TTL;
	},

	setStaffHistorys: (staffHistorys) =>
		set({ staffHistorys, staffHistorysFetchedAt: Date.now() }),

	clearStaffHistorys: () =>
		set({ staffHistorys: [], staffHistorysFetchedAt: null }),
}));
