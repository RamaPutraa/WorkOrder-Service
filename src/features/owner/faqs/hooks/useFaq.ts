import { useState, useCallback } from "react";
import {
	getFaqListApi,
	toggleActiveFaqApi,
	uploadFaqTextApi,
	uploadFaqPdfApi,
	deleteFaqApi,
} from "../services/faq-service";
import { notifySuccess, notifyError } from "@/lib/toast-helper";

export const useFaq = () => {
	const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
	const [isActive, setIsActive] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchFaqList = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await getFaqListApi();
			setFaqItems(res.data ?? []);
		} catch {
			setError("Gagal memuat data FAQ.");
		} finally {
			setLoading(false);
		}
	}, []);

	const handleToggleActive = useCallback(async (value: boolean) => {
		setSubmitting(true);
		try {
			await toggleActiveFaqApi(value);
			setIsActive(value);
			notifySuccess(
				value ? "FAQ diaktifkan" : "FAQ dinonaktifkan",
				value ?
					"FAQ sekarang dapat dilihat publik."
				:	"FAQ disembunyikan dari publik.",
			);
		} catch {
			notifyError("Gagal mengubah status FAQ.");
		} finally {
			setSubmitting(false);
		}
	}, []);

	// TODO: DI PUBLIC TOMBOL FAQ JANGAN MUNCUL TERUS, CEK APAKAH isFaqActive
	const handleAddText = useCallback(async (data: FaqTextRequest) => {
		setSubmitting(true);
		try {
			const res = await uploadFaqTextApi(data);
			if (res.data) {
				// Map FaqText → FaqItem shape
				const item: FaqItem = {
					id: res.data.id,
					title: res.data.title,
					content: res.data.content,
					type: "TEXT",
					file_url: null,
					mime_type: null,
					size: null,
					created_at: res.data.created_at,
				};
				setFaqItems((prev) => [item, ...prev]);
			}
			notifySuccess("FAQ teks berhasil ditambahkan.");
			return true;
		} catch {
			notifyError("Gagal menambahkan FAQ teks.");
			return false;
		} finally {
			setSubmitting(false);
		}
	}, []);

	const handleAddPdf = useCallback(async (data: FaqFileRequest) => {
		setSubmitting(true);
		try {
			const res = await uploadFaqPdfApi(data);
			if (res.data) {
				// Map FaqFile → FaqItem shape
				const item: FaqItem = {
					id: res.data.id,
					title: res.data.title,
					content: res.data.content,
					type: "PDF",
					file_url: res.data.file_url,
					mime_type: res.data.mime_type,
					size: res.data.size,
					created_at: res.data.created_at,
				};
				setFaqItems((prev) => [item, ...prev]);
			}
			notifySuccess("FAQ PDF berhasil ditambahkan.");
			return true;
		} catch {
			notifyError("Gagal menambahkan FAQ PDF.");
			return false;
		} finally {
			setSubmitting(false);
		}
	}, []);

	const handleDelete = useCallback(async (id: number) => {
		setSubmitting(true);
		try {
			await deleteFaqApi(id);
			setFaqItems((prev) => prev.filter((item) => item.id !== id));
			notifySuccess("FAQ berhasil dihapus.");
		} catch {
			notifyError("Gagal menghapus FAQ.");
		} finally {
			setSubmitting(false);
		}
	}, []);

	return {
		faqItems,
		isActive,
		setIsActive,
		loading,
		submitting,
		error,
		fetchFaqList,
		handleToggleActive,
		handleAddText,
		handleAddPdf,
		handleDelete,
	};
};
