import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare, FileText, Phone } from "lucide-react";

export default function DsQuickActions() {
	return (
		<Card className="shadow-sm h-full">
			<CardHeader className="pb-3">
				<CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-2 gap-3">
				<Button variant="default" className="w-full flex flex-col items-center justify-center h-20 gap-2">
					<PlusCircle className="h-5 w-5" />
					<span className="text-xs">New Request</span>
				</Button>
				<Button variant="outline" className="w-full flex flex-col items-center justify-center h-20 gap-2">
					<FileText className="h-5 w-5" />
					<span className="text-xs">View Invoices</span>
				</Button>
				<Button variant="outline" className="w-full flex flex-col items-center justify-center h-20 gap-2">
					<MessageSquare className="h-5 w-5" />
					<span className="text-xs">Support Chat</span>
				</Button>
				<Button variant="outline" className="w-full flex flex-col items-center justify-center h-20 gap-2">
					<Phone className="h-5 w-5" />
					<span className="text-xs">Contact Owner</span>
				</Button>
			</CardContent>
		</Card>
	);
}
