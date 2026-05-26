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
} from "lucide-react";
import FormFieldViewer, {
	type AnswerValue,
} from "@/shared/molecules/form-field-viewer";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WorkReportDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	form: Form | null;
	submission?: SubmissionObject | null;
	stageIndex: number;
}

const WorkReportDrawer = ({
	open,
	onOpenChange,
	form,
	submission,
	stageIndex,
}: WorkReportDrawerProps) => {
	if (!form) return null;

	const hasFields =
		submission && submission.fieldsData && submission.fieldsData.length > 0;
	const submittedAt = submission?.createdAt ?? null;

	return (
		<Drawer open={open} onOpenChange={onOpenChange} direction="right">
			<DrawerContent
				className="w-full sm:max-w-lg p-0 flex flex-col h-full right-0 rounded-none border-l">
				{/* Header */}
				<DrawerHeader className="px-6 pt-6 pb-4 border-b border-border/60 bg-gradient-to-b from-violet-50/80 to-background space-y-3">
					<div className="flex items-start gap-3">
						<div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-violet-100 text-violet-600 shadow-sm">
							<FileText className="w-5 h-5" />
						</div>
						<div className="flex-1 min-w-0">
							<DrawerTitle className="text-base font-bold tracking-tight leading-snug">
								{form.title || `Tahap ${stageIndex + 1}`}
							</DrawerTitle>
							{form.description && (
								<DrawerDescription className="text-xs mt-1 line-clamp-2">
									{form.description}
								</DrawerDescription>
							)}
						</div>
					</div>

					{/* Meta chips */}
					<div className="flex flex-wrap items-center gap-2">

						<Badge
							variant="secondary"
							className="text-[10px] font-medium bg-muted/60">
							Tahap {stageIndex + 1}
						</Badge>
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
				</DrawerHeader>

				{/* Body */}
				<ScrollArea className="flex-1 overflow-y-auto">
					<div className="px-6 py-5">
						{hasFields && submission ? (
							<div className="space-y-4">
								{[...form.fields]
									.sort((a, b) => a.order - b.order)
									.map((field) => {
										const answer =
											submission.fieldsData.find(
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
