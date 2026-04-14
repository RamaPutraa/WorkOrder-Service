import React from "react";

export const InfoRow = ({
	icon: Icon,
	label,
	value,
	valueClass = "",
}: {
	icon: React.ElementType;
	label: string;
	value: React.ReactNode;
	valueClass?: string;
}) => (
	<div className="flex items-start gap-3 py-3">
		<div className="shrink-0 mt-0.5 p-2 rounded-lg bg-primary/5 text-primary">
			<Icon className="w-4 h-4" />
		</div>
		<div className="flex-1 min-w-0">
			<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
				{label}
			</p>
			<div className={`text-sm font-medium text-foreground ${valueClass}`}>
				{value}
			</div>
		</div>
	</div>
);
