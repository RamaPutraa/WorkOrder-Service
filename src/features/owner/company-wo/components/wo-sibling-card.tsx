import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StatusBadge } from "./wo-status-badge";

export const SiblingCard = ({
	sibling,
	currentId,
	index,
}: {
	sibling: {
		_id: string;
		code: string;
		status: string;
		position?: {
			_id: string;
			name: string;
		};
		serviceSummary?: ServiceSummaryObject;
	};
	currentId: string;
	index: number;
}) => {
	const navigate = useNavigate();
	const isCurrent = sibling._id === currentId;
	return (
		<button
			onClick={() =>
				!isCurrent &&
				navigate(`/dashboard/internal/workorders/detail/${sibling._id}`)
			}
			disabled={isCurrent}
			className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all duration-150 ${
				isCurrent ?
					"bg-primary/5 border-primary/30 cursor-default"
				:	"hover:bg-muted/50 hover:border-muted-foreground/30 cursor-pointer"
			}`}>
			<div className="flex items-center gap-2">
				<div>
					{index != null && (
						<span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">
							{index}
						</span>
					)}
				</div>
				<div>
					<span className="text-sm font-medium">
						{sibling.serviceSummary?.title}
					</span>
					<p className="text-xs text-muted-foreground">{sibling.code}</p>
				</div>
				{isCurrent && (
					<span className="text-[10px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground font-semibold">
						Sedang diakses
					</span>
				)}
			</div>
			<div className="flex items-center gap-2">
				<StatusBadge status={sibling.status} />
				{!isCurrent && (
					<ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
				)}
			</div>
		</button>
	);
};
