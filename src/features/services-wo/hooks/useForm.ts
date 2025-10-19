import { useState } from "react";

export type RoleConfig = {
	fillableByRoles: string[];
	fillableByPositionIds: string[];
	viewableByRoles: string[];
	viewableByPositionIds: string[];
};

type FormAccessConfig = Record<string, RoleConfig>;

const emptyConfig: RoleConfig = {
	fillableByRoles: [],
	fillableByPositionIds: [],
	viewableByRoles: [],
	viewableByPositionIds: [],
};

export const useFormAccessConfig = () => {
	const [formAccessConfig, setFormAccessConfig] = useState<FormAccessConfig>(
		{}
	);

	// 🔹 Pastikan formId punya entry di state
	const ensureForm = (prev: FormAccessConfig, formId: string): RoleConfig =>
		prev[formId] || { ...emptyConfig };

	// 🔹 Toggle role yang bisa mengisi
	const toggleRoleFill = (formId: string, role: string) => {
		setFormAccessConfig((prev) => {
			const c = ensureForm(prev, formId);
			const updated = {
				...c,
				fillableByRoles: c.fillableByRoles.includes(role)
					? c.fillableByRoles.filter((r) => r !== role)
					: [...c.fillableByRoles, role],
			};
			return { ...prev, [formId]: updated };
		});
	};

	// 🔹 Toggle role yang bisa melihat
	const toggleRoleView = (formId: string, role: string) => {
		setFormAccessConfig((prev) => {
			const c = ensureForm(prev, formId);
			const updated = {
				...c,
				viewableByRoles: c.viewableByRoles.includes(role)
					? c.viewableByRoles.filter((r) => r !== role)
					: [...c.viewableByRoles, role],
			};
			return { ...prev, [formId]: updated };
		});
	};

	// 🔹 Toggle posisi yang bisa mengisi
	const toggleFillablePosition = (formId: string, posId: string) => {
		setFormAccessConfig((prev) => {
			const c = ensureForm(prev, formId);
			const updated = {
				...c,
				fillableByPositionIds: c.fillableByPositionIds.includes(posId)
					? c.fillableByPositionIds.filter((id) => id !== posId)
					: [...c.fillableByPositionIds, posId],
			};
			return { ...prev, [formId]: updated };
		});
	};

	// 🔹 Toggle posisi yang bisa melihat
	const toggleViewablePosition = (formId: string, posId: string) => {
		setFormAccessConfig((prev) => {
			const c = ensureForm(prev, formId);
			const updated = {
				...c,
				viewableByPositionIds: c.viewableByPositionIds.includes(posId)
					? c.viewableByPositionIds.filter((id) => id !== posId)
					: [...c.viewableByPositionIds, posId],
			};
			return { ...prev, [formId]: updated };
		});
	};

	// 🔹 Ambil config form tertentu (atau default kosong)
	const getConfig = (formId: string): RoleConfig => {
		return formAccessConfig[formId] || { ...emptyConfig };
	};

	// 🔹 Inisialisasi config kosong (misalnya saat form baru dipilih)
	const initConfig = (formId: string) => {
		setFormAccessConfig((prev) => {
			if (prev[formId]) return prev;
			return { ...prev, [formId]: { ...emptyConfig } };
		});
	};

	// 🔹 Hapus config form tertentu (saat form dihapus)
	const removeConfig = (formId: string) => {
		setFormAccessConfig((prev) => {
			const updated = { ...prev };
			delete updated[formId];
			return updated;
		});
	};

	return {
		formAccessConfig,
		getConfig,
		initConfig,
		removeConfig,
		toggleRoleFill,
		toggleRoleView,
		toggleFillablePosition,
		toggleViewablePosition,
	};
};
