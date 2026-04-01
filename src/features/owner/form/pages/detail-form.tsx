import { Button } from "@/components/ui/button";
import { useForm } from "../hooks/use-form";
import FormFieldViewer from "@/shared/molecules/form-field-viewer";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { TextLoading } from "@/shared/atoms/loading-state";
import {
	Calendar,
	Clock,
	FileType,
	ListOrdered,
	Pencil,
	ScrollText,
	Trash,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useDialogStore } from "@/store/dialogStore";

const DetailForm = () => {
	const { showDialog } = useDialogStore();
	const { detailForm, loading, removeForm } = useForm();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();

	const qtyField = detailForm?.fields?.length || 0;

	const formType = (type: string) => {
		switch (type) {
			case "intake":
				return "Formulir Permintaan";
			case "report":
				return "Formulir Laporan";
			case "work_order":
				return "Formulir Perintah Kerja";

			default:
				return type;
		}
	};

	const formatDate = (dateString?: string) => {
		if (!dateString) return "-";
		return new Date(dateString).toLocaleDateString("id-ID", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	return (
		<>
			{/* header */}
			<PageHeader
				title={
					loading ?
						<div className="flex items-center gap-1.5">
							Detail Formulir{" "}
							<TextLoading variant="dots" message="" className="w-40" />
						</div>
					:	`Detail Formulir ${detailForm?.title}`
				}
				subtitle={
					loading ?
						<div className="flex items-center gap-1.5">
							Berikut merupakan detail formulir{" "}
							<TextLoading variant="dots" message="" className="w-40" />
						</div>
					:	`Berikut merupakan detail formulir ${detailForm?.title} `
				}
				backPath={true}
				addLabel="Edit Formulir"
				onAddClick={() => navigate(`../form/edit/${id}`)}
				addIcon={<Pencil className="w-3.5 h-3.5" />}
			/>

			{loading ?
				<SectionLoading message="Memuat detail form..." />
			:	<div className="grid grid-cols-1 lg:grid-cols-3 gap-0 rounded-xl border border-border/60 shadow-sm h-auto lg:h-[70vh]">
					<div className="flex flex-col px-6 py-6 bg-muted/10 border-b lg:border-b-0 lg:border-r border-border/60 lg:overflow-y-auto">
						{/* --- HEADER --- */}
						<div className="flex justify-between items-start">
							<div className="shrink-0 p-3 bg-primary/10 text-primary rounded-xl">
								<ScrollText className="w-6 h-6" />
							</div>
							<Button
								variant="destructive"
								size="icon"
								className="h-9 w-9 shrink-0"
								title="Hapus Formulir"
								onClick={() =>
									showDialog({
										title: "Hapus Formulir",
										description: `Apakah Anda yakin ingin menghapus formulir "${detailForm?.title}"?`,
										confirmText: "Hapus",
										cancelText: "Batal",
										onConfirm: async () => {
											if (id) {
												const success = await removeForm(id);
												if (success) {
													navigate("/dashboard/internal/forms");
												}
											}
										},
									})
								}>
								<Trash className="w-4 h-4" />
							</Button>
						</div>

						{/* --- INFORMASI UTAMA --- */}
						<div className="mt-6 space-y-2">
							<h3 className="font-semibold text-lg text-foreground tracking-tight">
								Informasi Formulir
							</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								{detailForm?.description ||
									"Tidak ada deskripsi untuk formulir ini."}
							</p>
						</div>

						<Separator className="my-6" />

						{/* --- METADATA --- */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2.5 text-muted-foreground">
									<ListOrdered className="w-4 h-4" />
									<span className="text-sm font-medium">Jumlah Field</span>
								</div>
								<div className="flex h-6 items-center justify-center px-2.5 rounded-md bg-primary/10 text-xs font-semibold text-primary">
									{qtyField}
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2.5 text-muted-foreground">
									<FileType className="w-4 h-4" />
									<span className="text-sm font-medium">Jenis Formulir</span>
								</div>
								<div className="flex h-6 items-center justify-center px-2.5 rounded-md border border-border bg-background text-xs font-medium text-foreground">
									{formType(detailForm?.formType || "")}
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2.5 text-muted-foreground">
									<Calendar className="w-4 h-4" />
									<span className="text-sm font-medium">Dibuat Pada</span>
								</div>
								<span className="flex h-6 items-center justify-center px-2.5 rounded-md border border-border bg-background text-xs font-medium text-foreground">
									{formatDate(detailForm?.createdAt)}
								</span>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2.5 text-muted-foreground">
									<Clock className="w-4 h-4" />
									<span className="text-sm font-medium">Diperbarui</span>
								</div>
								<span className="flex h-6 items-center justify-center px-2.5 rounded-md border border-border bg-background text-xs font-medium text-foreground">
									{formatDate(detailForm?.updatedAt)}
								</span>
							</div>
						</div>
					</div>

					<div className="col-span-1 lg:col-span-2 lg:overflow-y-auto bg-background rounded-r-xl">
						<div className="p-5 lg:p-8 space-y-6">
							{detailForm?.fields?.map((field, i) => (
								<FormFieldViewer
									key={i}
									field={field}
									answer={null}
									readOnly
									index={i + 1}
								/>
							))}

							{(!detailForm?.fields || detailForm.fields.length === 0) && (
								<div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
									<ListOrdered className="w-12 h-12 mb-4 opacity-20" />
									<p>Belum ada field pertanyaan di formulir ini.</p>
								</div>
							)}
						</div>
					</div>
				</div>
			}
		</>
	);
};

export default DetailForm;
