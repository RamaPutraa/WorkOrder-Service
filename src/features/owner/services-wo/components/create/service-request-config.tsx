import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { EmptyData } from "@/shared/molecules/empty-data";
import { useProfileStore } from "@/store/profileStore";

import {
	ClipboardCheck,
	FileText,
	ScrollText,
	Settings2,
	Search,
} from "lucide-react";
import { Loader2 } from "lucide-react";

type CardServiceRequestConfigProps = {
	forms: Form[];
	loading: boolean;

	intakeFormId: string;
	reviewFormId: string;
	serviceRequestApprovalType: "auto" | "manager";
	reviewNeed: boolean;
	draftingWorkOrderType: draftingWorkOrderType;

	setIntakeFormId: (val: string) => void;
	setReviewFormId: (val: string) => void;
	setServiceRequestApprovalType: (val: "auto" | "manager") => void;
	setReviewNeed: (val: boolean) => void;
};

export const CardServiceRequestConfig: React.FC<
	CardServiceRequestConfigProps
> = ({
	forms,
	loading,
	intakeFormId,
	reviewFormId,
	serviceRequestApprovalType,
	reviewNeed,
	draftingWorkOrderType,
	setIntakeFormId,
	setReviewFormId,
	setServiceRequestApprovalType,
	setReviewNeed,
}) => {
	const [intakeSearch, setIntakeSearch] = useState("");
	const [reviewSearch, setReviewSearch] = useState("");
	const [intakeTypeFilter, setIntakeTypeFilter] = useState("intake");
	const [reviewTypeFilter, setReviewTypeFilter] = useState("review");

	const { profile } = useProfileStore();
	const isManager = profile?.role === "manager_company";
	const managerPositionId = profile?.position?._id || "";

	const formTypeOptions = [
		{ label: "Semua", value: "all" },
		{ label: "Pengajuan", value: "intake" },
		{ label: "Ulasan", value: "review" },
		{ label: "Perintah Kerja", value: "work_order" },
		{ label: "Laporan", value: "report" },
	];

	const filteredIntakeForms = forms.filter((f) => {
		const matchesSearch = f.title
			.toLowerCase()
			.includes(intakeSearch.toLowerCase());
		const matchesType =
			intakeTypeFilter === "all" || f.formType === intakeTypeFilter;
		const matchesPosition =
			!isManager || !managerPositionId || f.position?._id === managerPositionId;
		return matchesSearch && matchesType && matchesPosition;
	});

	const filteredReviewForms = forms.filter((f) => {
		const matchesSearch = f.title
			.toLowerCase()
			.includes(reviewSearch.toLowerCase());
		const matchesType =
			reviewTypeFilter === "all" || f.formType === reviewTypeFilter;
		const matchesPosition =
			!isManager || !managerPositionId || f.position?._id === managerPositionId;
		return matchesSearch && matchesType && matchesPosition;
	});

	return (
		<div className="h-full overflow-y-auto">
			<div className="max-w-full space-y-8 p-8">
				{/* Section header */}
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-lg bg-primary/5 text-primary">
						<Settings2 className="w-5 h-5" />
					</div>
					<div>
						<h2 className="text-base font-semibold text-slate-900">
							Konfigurasi Formulir Permintaan Layanan
						</h2>
						<p className="text-sm text-slate-500">
							Atur formulir dan alur persetujuan saat klien mengajukan layanan.
						</p>
					</div>
				</div>

				{loading ?
					<div className="flex items-center justify-center py-12 gap-3 text-slate-400">
						<Loader2 className="w-5 h-5 animate-spin" />
						<span className="text-sm">Memuat data form…</span>
					</div>
				:	<>
						{/* Intake Form */}
						<div className="space-y-3">
							<div>
								<Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
									<FileText className="w-4 h-4 text-slate-400" />
									Formulir Klien <span className="text-red-500">*</span>
								</Label>
								<p className="text-xs text-slate-500 mt-1">
									Form yang diisi oleh klien saat mengajukan layanan.
								</p>
							</div>

							<div className="max-h-[320px] overflow-y-auto p-5 space-y-3 border border-slate-200 rounded-md">
								<div className="flex flex-wrap gap-1.5 pb-1">
									{formTypeOptions.map((opt) => (
										<button
											key={opt.value}
											type="button"
											onClick={() => setIntakeTypeFilter(opt.value)}
											className={`px-3 py-1 text-[10px] font-semibold rounded-full border transition-all duration-200 ${
												intakeTypeFilter === opt.value ?
													"bg-primary border-primary text-white"
												:	"bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
											}`}>
											{opt.label}
										</button>
									))}
								</div>
								<div className="relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
									<Input
										placeholder="Cari nama formulir..."
										value={intakeSearch}
										onChange={(e) => setIntakeSearch(e.target.value)}
										className="pl-9 h-8 bg-white rounded-xl"
									/>
								</div>
								<div className="grid grid-cols-1 gap-2 2xl:grid-cols-3">
									{filteredIntakeForms.length === 0 ?
										<div className="col-span-1 2xl:col-span-3 text-sm text-slate-500 text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
											<EmptyData />
										</div>
									:	filteredIntakeForms.map((f) => {
											const isSelected = intakeFormId === f._id;
											return (
												<button
													key={f._id}
													type="button"
													onClick={() =>
														setIntakeFormId(isSelected ? "" : f._id)
													}
													className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex flex-col gap-2 ${
														isSelected ?
															"border-primary bg-primary/5 shadow-sm"
														:	"border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
													}`}>
													<div className="flex items-center justify-between w-full">
														<div className="flex items-start gap-4">
															{/* Icon */}
															<div className="shrink-0 p-3 bg-primary/5 text-primary rounded-xl">
																<ScrollText className="w-5 h-5" />
															</div>

															{/* Text Content */}
															<div className="flex-1 space-y-1">
																<h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-1">
																	{f.title || "Untitled Form"}
																</h3>

																<p className="text-xs text-slate-500 leading-relaxed line-clamp-1">
																	{f.description ||
																		"No description available."}
																</p>
															</div>
														</div>
													</div>
												</button>
											);
										})
									}
								</div>
							</div>
						</div>

						{/* Review Form */}
						<div className="space-y-3">
							<div>
								<Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
									<ClipboardCheck className="w-4 h-4 text-slate-400" />
									Formulir Ulasan
								</Label>
								<p className="text-xs text-slate-500 mt-1">
									Form ulasan opsional setelah layanan diselesaikan.
								</p>
							</div>

							<div className="max-h-[320px] overflow-y-auto p-5 space-y-3 border border-slate-200 rounded-xl">
								<div className="flex flex-wrap gap-1.5 pb-1">
									{formTypeOptions.map((opt) => (
										<button
											key={opt.value}
											type="button"
											onClick={() => setReviewTypeFilter(opt.value)}
											className={`px-3 py-1 text-[10px] font-semibold rounded-full border transition-all duration-200 ${
												reviewTypeFilter === opt.value ?
													"bg-primary border-primary text-white"
												:	"bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
											}`}>
											{opt.label}
										</button>
									))}
								</div>
								<div className="relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
									<Input
										placeholder="Cari nama formulir..."
										value={reviewSearch}
										onChange={(e) => setReviewSearch(e.target.value)}
										className="pl-9 h-8 bg-white rounded-xl"
									/>
								</div>
								<div className="grid grid-cols-1 gap-2 2xl:grid-cols-3">
									{filteredReviewForms.length === 0 ?
										<div className="col-span-1 2xl:col-span-3 text-sm text-slate-500 text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
											<EmptyData />
										</div>
									:	filteredReviewForms.map((f) => {
											const isSelected = reviewFormId === f._id;
											return (
												<button
													key={f._id}
													type="button"
													onClick={() =>
														setReviewFormId(isSelected ? "" : f._id)
													}
													className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex flex-col gap-2 ${
														isSelected ?
															"border-primary bg-primary/5 shadow-sm"
														:	"border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
													}`}>
													<div className="flex items-center justify-between w-full">
														<div className="flex items-start gap-4">
															{/* Icon */}
															<div className="shrink-0 p-3 bg-primary/5 text-primary rounded-xl">
																<ScrollText className="w-5 h-5" />
															</div>

															{/* Text Content */}
															<div className="flex-1 space-y-1">
																<h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-1">
																	{f.title || "Untitled Form"}
																</h3>

																<p className="text-xs text-slate-500 leading-relaxed line-clamp-1">
																	{f.description ||
																		"No description available."}
																</p>
															</div>
														</div>
													</div>
												</button>
											);
										})
									}
								</div>
							</div>
						</div>

						{/* Approval Type */}
						{draftingWorkOrderType !== "auto" && (
							<div className="space-y-2">
							<Label className="text-sm font-medium text-slate-700">
								Tipe Persetujuan Permintaan
							</Label>
							<p className="text-xs text-slate-500">
								Tentukan siapa yang menyetujui pengajuan layanan dari klien.
							</p>
							<div className="grid grid-cols-2 gap-3">
								{(
									[
										{
											value: "auto",
											label: "Otomatis",
											desc: "Disetujui tanpa perlu tindakan",
										},
										{
											value: "manager",
											label: "Manager",
											desc: "Perlu persetujuan manager",
										},
									] as const
								).map((opt) => {
									const isSelected = serviceRequestApprovalType === opt.value;
									return (
										<button
											key={opt.value}
											type="button"
											onClick={() => setServiceRequestApprovalType(opt.value)}
											className={`flex flex-col items-start gap-1 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
												isSelected ?
													"border-primary bg-primary/5 shadow-sm"
												:	"border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
											}`}>
											<span
												className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-slate-700"}`}>
												{opt.label}
											</span>
											<span className="text-xs text-slate-500">{opt.desc}</span>
										</button>
									);
								})}
							</div>
						</div>
						)}

						{/* Review Need toggle */}
						<div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
							<div className="space-y-0.5">
								<p className="text-sm font-medium text-slate-700">
									Diperlukan Ulasan
								</p>
								<p className="text-xs text-slate-500">
									Apakah layanan ini perlu proses review sebelum diterima?
								</p>
							</div>
							<Switch checked={reviewNeed} onCheckedChange={setReviewNeed} />
						</div>
					</>
				}
			</div>
		</div>
	);
};
