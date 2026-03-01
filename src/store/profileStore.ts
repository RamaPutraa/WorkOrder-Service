import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProfileState = {
	profile: User | null;
	setProfile: (profile: User) => void;
	updateProfile: (data: Partial<User>) => void;
	clearProfile: () => void;
};

export const useProfileStore = create<ProfileState>()(
	persist(
		(set) => ({
			profile: null,

			setProfile: (profile) => {
				set({ profile });
			},

			updateProfile: (data) => {
				set((state) => {
					if (!state.profile) return state;
					return {
						profile: { ...state.profile, ...data },
					};
				});
			},

			clearProfile: () => {
				set({ profile: null });
			},
		}),
		{
			name: "profile-storage", // nama kunci di localStorage
		},
	),
);
