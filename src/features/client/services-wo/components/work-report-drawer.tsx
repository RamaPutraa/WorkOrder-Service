import { useEffect, useState } from "react";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
} from "@/components/ui/drawer";
import {
	Calendar,
	CircleDot,
	FileText,
	ChevronLeft,
	ChevronRight,
	CheckCircle2,
} from "lucide-react";
import FormFieldViewer, {
	type AnswerValue,
} from "@/shared/molecules/form-field-viewer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WorkReportDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	workReport: RequesterWorkReport | null;
	/** Index tahap yang dipilih saat drawer dibuka. Jika tidak diisi, default ke submission terbaru. */
	initialIndex?: number;
}

const WorkReportDrawer = ({
	open,
	onOpenChange,
	workReport,
	initialIndex,
}: WorkReportDrawerProps) => {
	// Tentukan index submission terbaru
	const latestIndex = (() => {
		if (!workReport?.submissions?.length || !workReport?.workReportForms?.length)
			return 0;
		const latestSub = [...workReport.submissions].sort(
			(a, b) =>
				new Date(b.createdAt ?? 0).getTime() -
				new Date(a.createdAt ?? 0).getTime(),
		)[0];
		const idx = workReport.workReportForms.findIndex(
			(f) => f._id === latestSub.formId,
		);
		return idx !== -1 ? idx : 0;
	})();

	const [activeIndex, setActiveIndex] = useState(initialIndex ?? latestIndex);

	// Sync saat prop berubah atau drawer dibuka
	useEffect(() => {
		if (open) {
			setActiveIndex(initialIndex ?? latestIndex);
		}
	}, [open, initialIndex, latestIndex]);

	if (!workReport || workReport.workReportForms.length === 0) return null;

	const forms = workReport.workReportForms;
	const submissions = workReport.submissions ?? [];
	const totalForms = forms.length;

	// Helper: ambil submission TERBARU untuk suatu formId
	const getLatestSubmission = (formId: string): SubmissionObject | null =>
		submissions
			.filter((s) => s.formId === formId)
			.sort(
				(a, b) =>
					new Date(b.createdAt ?? 0).getTime() -
					new Date(a.createdAt ?? 0).getTime(),
			)[0] ?? null;

	const activeForm = forms[activeIndex] ?? null;
	const activeSubmission = activeForm
		? getLatestSubmission(activeForm._id)
		: null;

	const hasFields =
		activeSubmission &&
		activeSubmission.fieldsData &&
		activeSubmission.fieldsData.length > 0;

	const submittedAt = activeSubmission?.createdAt ?? null;
	const isLatest = activeIndex === latestIndex;

	const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
	const goNext = () => setActiveIndex((i) => Math.min(totalForms - 1, i + 1));

	return (
		<Drawer open={open} onOpenChange={onOpenChange} direction="right">
			<DrawerContent className="w-full sm:max-w-lg p-0 flex flex-col h-full right-0 rounded-none border-l">
				{/* Header */}
				<DrawerHeader className="px-6 pt-6 pb-4 border-b border-border/60 bg-gradient-to-b from-violet-50/80 to-background space-y-3">
					<div className="flex items-start gap-3">
						<div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-violet-100 text-violet-600 shadow-sm">
							<FileText className="w-5 h-5" />
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 flex-wrap">
								<DrawerTitle className="text-base font-bold tracking-tight leading-snug">
									{activeForm?.title}
								</DrawerTitle>
								{isLatest && activeSubmission && (
									<span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-violet-600 bg-violet-100 border border-violet-200 px-1.5 py-0.5 rounded-full">
										Terbaru
									</span>
								)}
							</div>
							{activeForm?.description && (
								<DrawerDescription className="text-xs mt-1 line-clamp-2">
									{activeForm.description}
								</DrawerDescription>
							)}
						</div>
					</div>

					{/* Meta chips */}
					<div className="flex flex-wrap items-center gap-2">
						{activeSubmission ? (
							<span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
								<CheckCircle2 className="w-3 h-3" />
								Sudah Dilaporkan
							</span>
						) : (
							<span className="inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
								<CircleDot className="w-3 h-3" />
								Belum Dilaporkan
							</span>
						)}
						{submittedAt && (
							<span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
								<Calendar className="w-3 h-3" />
								{new Date(submittedAt).toLocaleDateString("id-ID", {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}
							</span>
						)}
					</div>

					{/* Stage navigation tabs */}
					{totalForms > 1 && (
						<div className="flex items-center gap-2 pt-1">
							<button
								type="button"
								onClick={goPrev}
								disabled={activeIndex === 0}
								className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg border bg-white text-muted-foreground hover:text-foreground hover:border-border transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:cursor-pointer">
								<ChevronLeft className="w-4 h-4" />
							</button>

							<div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
								{forms.map((form, idx) => {
									const sub = getLatestSubmission(form._id);
									const isActive = idx === activeIndex;
									const isLt = idx === latestIndex && !!sub;
									return (
										<button
											key={form._id}
											type="button"
											onClick={() => setActiveIndex(idx)}
											title={form.title || `Tahap ${idx + 1}`}
											className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold border transition-all hover:cursor-pointer ${
												isActive
													? isLt
														? "bg-violet-600 text-white border-violet-600 shadow-sm"
														: "bg-foreground text-background border-foreground"
													: sub
													? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
													: "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"
											}`}>
											{idx + 1}
										</button>
									);
								})}
							</div>

							<button
								type="button"
								onClick={goNext}
								disabled={activeIndex === totalForms - 1}
								className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg border bg-white text-muted-foreground hover:text-foreground hover:border-border transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:cursor-pointer">
								<ChevronRight className="w-4 h-4" />
							</button>
						</div>
					)}
				</DrawerHeader>

				{/* Body */}
				<ScrollArea className="flex-1 overflow-y-auto">
					<div className="px-6 py-5">
						{hasFields && activeSubmission ? (
							<div className="space-y-4">
								{[...activeForm!.fields]
									.sort((a, b) => a.order - b.order)
									.map((field) => {
										const answer =
											activeSubmission.fieldsData.find(
												(fd) => fd.order === field.order,
											)?.value ?? null;
										return (
											<div
												key={field.order}
												className="pb-4 border-b border-border/30 last:border-b-0 last:pb-0">
												<FormFieldViewer
													field={field}
													answer={answer as AnswerValue}
													readOnly={true}
												/>
											</div>
										);
									})}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-3">
									<CircleDot className="w-5 h-5 text-amber-400" />
								</div>
								<p className="text-sm font-medium text-muted-foreground">
									Laporan belum tersedia
								</p>
								<p className="text-xs text-muted-foreground/70 mt-1 max-w-[240px]">
									Staf masih dalam proses pengerjaan tahap ini
								</p>
							</div>
						)}
					</div>
				</ScrollArea>
			</DrawerContent>
		</Drawer>
	);
};

export default WorkReportDrawer;
