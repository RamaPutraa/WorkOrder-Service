import { DataTable } from "@/components/ui/data-table";
import { getInvitationColumns } from "../components/invitation-columns";
import { useInvitations } from "../hooks/invitations";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const STATUS_SUMMARY = [
	{ label: "Menunggu", key: "pending", variant: "outline" as const },
	{ label: "Kadaluarsa", key: "expired", variant: "destructive" as const },
];

const InvitationsHistory = () => {
	const {
		history,
		loading,
		error,
		handleAccept,
		handleReject,
		actionLoadingId,
	} = useInvitations();
	const navigate = useNavigate();

	const columns = getInvitationColumns({
		onAccept: handleAccept,
		onReject: handleReject,
		actionLoadingId,
	});

	if (error) {
		return (
			<div className="p-6">
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-red-600">Error: {error}</p>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* Header */}
			<div className="flex items-center gap-4 mb-8">
				<Button
					onClick={() => navigate(-1)}
					className="bg-primary hover:bg-primary/90 h-full shrink-0">
					<ChevronLeft className="size-6" />
				</Button>
				<div className="flex-1">
					<h1 className="text-2xl font-bold">Riwayat Undangan</h1>
					<p className="text-muted-foreground text-sm mt-0.5">
						Total {history.length} undangan diterima
					</p>
				</div>
			</div>

			{/* Table */}
			<Card>
				<CardHeader>
					<h2 className="text-lg font-semibold">Daftar Riwayat Undangan</h2>
				</CardHeader>
				<CardContent>
					{/* Status summary chips */}
					{!loading && history.length > 0 && (
						<div className="flex flex-wrap gap-2 mb-5">
							{STATUS_SUMMARY.map(({ label, key, variant }) => {
								const count = history.filter((h) => h.status === key).length;
								return (
									<div
										key={key}
										className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-white text-sm text-muted-foreground">
										<Badge variant={variant} className="text-xs px-1.5">
											{count}
										</Badge>
										{label}
									</div>
								);
							})}
						</div>
					)}
					<DataTable
						columns={columns}
						data={history}
						searchKey="company"
						loading={loading}
						loadingMessage="Memuat riwayat undangan..."
					/>
				</CardContent>
			</Card>
		</>
	);
};

export default InvitationsHistory;
