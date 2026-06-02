import { useForm } from "../hooks/use-form";
import FormFieldViewer from "@/shared/molecules/form-field-viewer";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { TextLoading } from "@/shared/atoms/loading-state";
import {
	Calendar,
	Clock,
	FileText,
	Pencil,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { EmptyData } from "@/shared/molecules/empty-data";

const formTypeMap: Record<string, { label: string; color: string }> = {
	intake: {
		label: "Formulir Permintaan",
		color: "bg-blue-50 text-blue-700 border-blue-200",
	},
	report: {
		label: "Formulir Laporan",
		color: "bg-emerald-50 text-emerald-700 border-emerald-200",
	},
	work_order: {
		label: "Formulir Perintah Kerja",
		color: "bg-amber-50 text-amber-700 border-amber-200",
	},
	review: {
		label: "Formulir Ulasan",
		color: "bg-violet-50 text-violet-700 border-violet-200",
	},
};

const formatDate = (dateString?: string) => {
	if (!dateString) return "-";
	return new Date(dateString).toLocaleDateString("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

const DetailForm = () => {
	// const { showDialog } = useDialogStore();
	// const { detailForm, loading, removeForm } = useForm();
	const { detailForm, loading } = useForm();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();

	const typeInfo = formTypeMap[detailForm?.formType || ""] ?? {
		label: detailForm?.formType || "Unknown",
		color: "bg-slate-50 text-slate-700 border-slate-200",
	};

	// const handleDelete = () => {
	// 	showDialog({
	// 		title: "Hapus Formulir",
	// 		description: `Apakah Anda yakin ingin menghapus formulir "${detailForm?.title}"?`,
	// 		confirmText: "Hapus",
	// 		cancelText: "Batal",
	// 		onConfirm: async () => {
	// 			if (id) {
	// 				const success = await removeForm(id);
	// 				if (success) {
	// 					navigate("/dashboard/internal/forms");
	// 				}
	// 			}
	// 		},
	// 	});
	// };

	return (
		<>
			{/* Header */}
			<PageHeader
				title={
					loading ?
						<div className="flex items-center gap-1.5">
							Detail Formulir{" "}
							<TextLoading variant="dots" message="" className="w-40" />
						</div>
						: `Detail Formulir`
				}
				subtitle={
					loading ?
						<div className="flex items-center gap-1.5">
							Memuat detail formulir...{" "}
							<TextLoading variant="dots" message="" className="w-40" />
						</div>
						: detailForm?.title
				}
				backPath="/dashboard/internal/forms"
				addLabel="Edit Formulir"
				onAddClick={() => navigate(`../form/edit/${id}`)}
				addIcon={<Pencil className="w-3.5 h-3.5" />}
			/>

			{loading ?
				<SectionLoading message="Memuat detail form..." />
				: !detailForm ?
					<div className="my-10">
						<EmptyData />
					</div>
					: <div className="space-y-6">
						{/* ── Overview Card ── */}
						<div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
							<div className="p-6 space-y-5">
								{/* Title + actions */}
								<div className="flex items-start justify-between gap-4">
									<div className="flex items-start gap-4 min-w-0">
										<div className="shrink-0 p-3 rounded-xl bg-primary/5 text-primary">
											<FileText className="w-6 h-6" />
										</div>
										<div className="space-y-1.5 min-w-0">
											<h2 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
												{detailForm.title}
											</h2>
											{detailForm.description && (
												<p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
													{detailForm.description}
												</p>
											)}
										</div>
									</div>

									{/* <Button
										variant="destructive"
										size="icon"
										className="h-9 w-9 shrink-0 rounded-lg"
										title="Hapus Formulir"
										onClick={handleDelete}>
										<Trash2 className="w-4 h-4" />
									</Button> */}
								</div>

								{/* Meta chips */}
								<div className="flex flex-wrap items-center gap-2">
									<Badge
										variant="outline"
										className={`rounded-full text-xs font-semibold px-3 py-1 border shadow-none ${typeInfo.color}`}>
										{typeInfo.label}
									</Badge>

									<div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 rounded-full px-3 py-1.5 border border-slate-100">
										<Calendar className="w-3 h-3" />
										<span className="font-medium">
											Dibuat pada : {" "}
											{formatDate(detailForm.createdAt)}
										</span>
									</div>

									<div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 rounded-full px-3 py-1.5 border border-slate-100">
										<Clock className="w-3 h-3" />
										<span className="font-medium">
											Terakhir diperbarui : {" "}
											{formatDate(detailForm.updatedAt)}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* ── Fields Section ── */}
						<div className="space-y-3">
							<div className="flex items-center justify-between px-1">
								<h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
									Daftar Pertanyaan
								</h3>
								<span className="text-xs text-slate-400 font-medium">
									{detailForm.fields?.length || 0} pertanyaan
								</span>
							</div>

							{detailForm.fields && detailForm.fields.length > 0 ?
								<div className="space-y-3">
									{detailForm.fields.map((field, i) => (
										<FormFieldViewer
											key={i}
											field={field}
											answer={null}
											readOnly
											index={i + 1}
										/>
									))}
								</div>
								: <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
									<FileText className="w-10 h-10 text-slate-300 mb-3" />
									<p className="text-sm font-medium text-slate-500">
										Belum ada pertanyaan
									</p>
									<p className="text-xs text-slate-400 mt-1">
										Tambahkan pertanyaan melalui halaman edit formulir.
									</p>
								</div>
							}
						</div>
					</div>
			}
		</>
	);
};

export default DetailForm;
