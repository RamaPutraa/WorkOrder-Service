import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, Clock, AlertCircle } from "lucide-react";

const mockSummary = [
	{
		title: "Active Work Orders",
		value: "12",
		description: "Currently in progress",
		icon: Activity,
		color: "text-blue-500",
	},
	{
		title: "Pending Requests",
		value: "5",
		description: "Awaiting approval",
		icon: Clock,
		color: "text-amber-500",
	},
	{
		title: "Completed (This Month)",
		value: "24",
		description: "+4 from last month",
		icon: CheckCircle,
		color: "text-emerald-500",
	},
	{
		title: "Action Required",
		value: "2",
		description: "Needs your attention",
		icon: AlertCircle,
		color: "text-rose-500",
	},
];

export default function DsSummaryCards() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{mockSummary.map((item, index) => {
				const Icon = item.icon;
				return (
					<Card key={index} className="border-l-4 border-l-primary/50 shadow-sm hover:shadow-md transition-shadow">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								{item.title}
							</CardTitle>
							<Icon className={`h-4 w-4 ${item.color}`} />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{item.value}</div>
							<p className="text-xs text-muted-foreground mt-1">
								{item.description}
							</p>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
