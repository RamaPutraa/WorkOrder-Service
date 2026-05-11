const formatDateStr = (dateStr?: string | null) => {
	if (!dateStr) return null;
	return new Date(dateStr).toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};

type SrStatusStepperProps = {
	sr: {
		serviceRequestStatus: string;
		createdAt: string;
		updatedAt: string;
		approvedAt: string;
		onProgressAt: string;
		startedAt: string;
		completedAt: string;
		partialCompletedAt: string;
		rejectedAt: string;
		unprocessableAt: string;
		cancelledAt: string;
		closedAt: string;
		failedAt: string;
	};
};

export const SrStatusStepper = ({ sr }: SrStatusStepperProps) => {
	const status: string = sr.serviceRequestStatus;
	const isCancelled = status === "cancelled";
	const isPartialCompleted = status === "partial_completed";
	const isClosed = status === "closed";

	const defaultSteps = [
		{
			key: "received",
			label: "Menunggu Persetujuan",
			date: sr.createdAt,
		},
		{
			key: "approved",
			label: "Disetujui",
			date: sr.approvedAt,
		},
		{
			key: "on_progress",
			label: "Dikerjakan",
			date: sr.onProgressAt,
		},
		{
			key: "completed",
			label: "Selesai",
			date: sr.completedAt,
		},
		{
			key: "closed",
			label: "Ditutup",
			date: sr.closedAt,
		},
	];

	let currentIdx = 0;
	let isError = false;
	const steps = [...defaultSteps];

	switch (status) {
		case "received":
			currentIdx = 0;
			break;
		case "rejected":
			currentIdx = 1;
			isError = true;
			steps[1] = { key: "rejected", label: "Ditolak", date: sr.rejectedAt };
			break;
		case "approved":
			currentIdx = 1;
			break;
		case "unprocessable":
			currentIdx = 2;
			isError = true;
			steps[2] = {
				key: "unprocessable",
				label: "Gagal Diproses",
				date: sr.unprocessableAt,
			};
			break;
		case "on_progress":
			currentIdx = 2;
			break;
		case "completed":
			currentIdx = 3;
			break;
		case "partial_completed":
			currentIdx = 4;
			steps[4] = {
				key: "partial_completed",
				label: "Sebagian Selesai",
				date: sr.partialCompletedAt,
			};
			break;
		case "cancelled": {
			let idx = steps.findIndex((s) => s.date === null);
			if (idx === -1) idx = steps.length - 1;
			currentIdx = idx;
			steps[idx] = {
				...steps[idx],
				label: steps[idx].label + " (Batal)",
				date: sr.cancelledAt,
			};
			break;
		}
		case "closed":
			currentIdx = 4;
			break;
	}

	return (
		<div className="w-full flex gap-2 sm:gap-4 items-start">
			{steps.map((step, index) => {
				const isCompleted =
					index < currentIdx ||
					(index === currentIdx && status === "closed") ||
					(index === 3 && status === "completed");
				const isErrorStep = index === currentIdx && isError;
				const isCurrent = index === currentIdx && !isCompleted && !isErrorStep;
				const isActive = isCompleted || isCurrent;

				// partial_completed step: amber instead of primary
				const isPartialStep = isPartialCompleted && index === currentIdx;

				// Bar
				let barColor = "bg-muted";
				if (isActive)
					barColor =
						isCancelled ? "bg-red-400"
						: isClosed ? "bg-purple-500"
						: isPartialStep ? "bg-amber-400"
						: "bg-primary";
				else if (isErrorStep) barColor = "bg-destructive";

				// Dot
				let dotColor = "bg-muted-foreground/20";
				if (isActive)
					dotColor =
						isCancelled ? "bg-red-400"
						: isClosed ? "bg-purple-500"
						: isPartialStep ? "bg-amber-400"
						: "bg-primary";
				else if (isErrorStep) dotColor = "bg-destructive";

				// Text
				let labelColor = "text-muted-foreground/50";
				if (isActive)
					labelColor =
						isCancelled ? "text-red-400"
						: isClosed ? "text-purple-600"
						: isPartialStep ? "text-amber-500"
						: "text-primary";
				else if (isErrorStep) labelColor = "text-destructive";

				return (
					<div key={step.key} className="flex-1 flex flex-col gap-2">
						{/* Progress bar */}
						<div
							className={`w-full h-[3px] rounded-full transition-all duration-500 ${barColor}`}
						/>

						{/* Dot + label */}
						<div className="flex items-start gap-1.5 pt-0.5">
							<div
								className={`shrink-0 mt-[5px] w-1.5 h-1.5 rounded-full transition-all duration-300 ${dotColor}`}
							/>
							<div className="flex flex-col gap-0.5">
								<span
									className={`text-[11px] sm:text-[12px] font-semibold leading-tight transition-colors duration-300 ${labelColor}`}>
									{step.label}
								</span>
								{step.date && (
									<span className="text-[9px] sm:text-[10px] text-muted-foreground/60 leading-none">
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
