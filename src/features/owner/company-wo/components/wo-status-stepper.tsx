// import { WorkOrder, WorkOrderDetail } from "@/types/work-order";

const formatDateStr = (dateStr?: string | null) => {
	if (!dateStr) return null;
	return new Date(dateStr).toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};

type StepperProps = {
	wo: any; // Sesuaikan dengan tipe Anda: WorkOrderDetail | WorkOrder
};

export const WoStatusStepper = ({ wo }: StepperProps) => {
	// Status workflow: drafted -> sent -> approved -> on_progress -> completed
	const defaultSteps = [
		{ key: "drafted", label: "Dirancang", date: wo.draftedAt || wo.createdAt },
		{ key: "sent", label: "Dikirim", date: wo.sentAt },
		{ key: "approved", label: "Disetujui", date: wo.approvedAt },
		{
			key: "on_progress",
			label: "Dikerjakan",
			date: wo.startedAt,
		},
		{ key: "completed", label: "Selesai", date: wo.completedAt },
	];

	let currentIdx = 0;
	let isError = false;
	const isCancelled = wo.status === "cancelled";
	const steps = [...defaultSteps];

	switch (wo.status) {
		case "drafted":
			currentIdx = 0;
			break;
		case "sent":
			currentIdx = 1;
			break;
		case "rejected":
			currentIdx = 2;
			isError = true;
			steps[2] = {
				key: "rejected",
				label: "Ditolak",
				date: wo.rejectedAt,
			};
			break;
		case "approved":
			currentIdx = 2;
			break;
		case "unprocessable":
			currentIdx = 3;
			isError = true;
			steps[3] = {
				key: "unprocessable",
				label: "Gagal Proses",
				date: wo.unprocessableAt,
			};
			break;
		case "on_progress":
			currentIdx = 3;
			break;
		case "failed":
			currentIdx = 4;
			isError = true;
			steps[4] = {
				key: "failed",
				label: "Gagal",
				date: wo.failedAt || wo.updatedAt,
			};
			break;
		case "completed":
			currentIdx = 4;
			break;
		case "cancelled":
			// Cari index terakhir yang memiliki tanggal, jadikan itu sebagai titik berhenti
			currentIdx = steps.reduce((acc, step, idx) => (step.date ? idx : acc), 0);

			// Tambahkan keterangan batal di step terakhirnya
			steps[currentIdx] = {
				...steps[currentIdx],
				label: steps[currentIdx].label + " (Batal)",
				date: wo.cancelledAt || steps[currentIdx].date || wo.updatedAt,
			};
			break;
	}

	return (
		<div className="w-full flex gap-2 sm:gap-3 items-start">
			{steps.map((step, index) => {
				const isCompleted =
					index < currentIdx ||
					(index === currentIdx && wo.status === "completed");
				const isErrorStep = index === currentIdx && isError;
				const isCurrent = index === currentIdx && !isCompleted && !isErrorStep;

				let barColor = isCancelled ? "bg-red-400/20" : "bg-primary/20";
				if (isCompleted || isCurrent)
					barColor = isCancelled ? "bg-red-400" : "bg-primary";
				else if (isErrorStep) barColor = "bg-red-600";

				let nodeColor = isCancelled ? "bg-red-400/20" : "bg-primary/20";
				if (isCompleted || isCurrent)
					nodeColor = isCancelled ? "bg-red-400" : "bg-primary";
				else if (isErrorStep) nodeColor = "bg-red-600";

				let textColor = "text-muted-foreground/70 font-medium";
				if (isCompleted || isCurrent)
					textColor =
						isCancelled ?
							"text-red-400 font-semibold"
						:	"text-primary font-semibold";
				else if (isErrorStep) textColor = "text-red-600 font-semibold";

				return (
					<div key={step.key} className="flex-1 flex flex-col gap-2.5">
						{/* 1. Baris Atas: Garis Status Segmen */}
						<div
							className={`w-full h-[2px] rounded-full transition-colors duration-300 ${barColor}`}
						/>

						{/* 2. Baris Bawah: Titik (Node) & Value secara Horizontal */}
						<div className="flex items-start gap-2">
							{/* Titik Biasa */}
							<div
								className={`shrink-0 mt-1 w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 rounded-full transition-colors duration-300 ${nodeColor}`}
							/>

							{/* Label & Tanggal */}
							<div className="flex flex-col items-start text-start">
								<span
									className={`text-[11px] sm:text-[12px] leading-tight ${textColor}`}>
									{step.label}
								</span>
								{step.date && (
									<span className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 tracking-tight">
										{formatDateStr(step.date)}
									</span>
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
