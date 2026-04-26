import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye } from "lucide-react";

const mockActivities = [
	{
		id: "WO-2405-001",
		title: "AC Maintenance - Floor 3",
		location: "Sudirman Branch",
		status: "In Progress",
		date: "2026-05-12",
	},
	{
		id: "WO-2405-002",
		title: "Plumbing Leak Fix",
		location: "Kemang Office",
		status: "Pending",
		date: "2026-05-11",
	},
	{
		id: "WO-2405-003",
		title: "Server Rack Relocation",
		location: "Sudirman Branch",
		status: "Completed",
		date: "2026-05-10",
	},
	{
		id: "WO-2405-004",
		title: "Lighting Replacement",
		location: "Bandung Branch",
		status: "Approved",
		date: "2026-05-09",
	},
	{
		id: "WO-2405-005",
		title: "CCTV Installation",
		location: "Surabaya Branch",
		status: "In Progress",
		date: "2026-05-08",
	},
];

const getStatusBadge = (status: string) => {
	switch (status) {
		case "Completed":
			return <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">{status}</Badge>;
		case "In Progress":
			return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">{status}</Badge>;
		case "Pending":
			return <Badge variant="outline" className="text-amber-600 border-amber-600">{status}</Badge>;
		case "Approved":
			return <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">{status}</Badge>;
		default:
			return <Badge variant="outline">{status}</Badge>;
	}
};

export default function DsRecentActivities() {
	return (
		<Card className="shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<div className="space-y-1">
					<CardTitle className="text-base font-semibold">Recent Work Orders</CardTitle>
					<CardDescription>Latest updates on your requests</CardDescription>
				</div>
				<Button variant="ghost" size="sm" className="text-xs">
					View All <ArrowRight className="ml-1 h-3 w-3" />
				</Button>
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Title</TableHead>
								<TableHead className="hidden md:table-cell">Location</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="hidden sm:table-cell">Date</TableHead>
								<TableHead className="text-right">Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{mockActivities.map((activity) => (
								<TableRow key={activity.id}>
									<TableCell className="font-medium text-xs">{activity.id}</TableCell>
									<TableCell className="font-medium">{activity.title}</TableCell>
									<TableCell className="hidden md:table-cell text-muted-foreground">
										{activity.location}
									</TableCell>
									<TableCell>{getStatusBadge(activity.status)}</TableCell>
									<TableCell className="hidden sm:table-cell text-muted-foreground text-xs">
										{activity.date}
									</TableCell>
									<TableCell className="text-right">
										<Button variant="ghost" size="icon" className="h-8 w-8">
											<Eye className="h-4 w-4 text-muted-foreground" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
