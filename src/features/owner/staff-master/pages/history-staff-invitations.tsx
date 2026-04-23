import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { createInvitationColumns } from "../components/invitation-columns";
import { useStaffHistory } from "../hooks/use-staff-history";
import { useDialogStore } from "@/store/dialogStore";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/shared/atoms/header-content";
import { TextLoading } from "@/shared/atoms/loading-state";
import { Input } from "@/components/ui/input";

const STATUS_SUMMARY = [
	{ label: "Menunggu", key: "pending", variant: "outline" as const },
	{ label: "Diterima", key: "accepted", variant: "default" as const },
	{ label: "Ditolak", key: "rejected", variant: "destructive" as const },
	{ label: "Kadaluarsa", key: "expired", variant: "secondary" as const },
];

const HistoryStaffInvitations = () => {
	const { history, loading, error, fetchHistory, removeInvitation } =
		useStaffHistory();
	const { showDialog } = useDialogStore();

	// ── Filter state ───────────────────────────────────────────────────────────
	const [searchValue, setSearchValue] = useState("");

	const handleDelete = (id: string) => {
		showDialog({
			title: "Hapus Riwayat Undangan",
			description: "Apakah Anda yakin ingin menghapus riwayat undangan ini?",
			confirmText: "Hapus",
			cancelText: "Batal",
			onConfirm: async () => {
				await removeInvitation(id);
			},
		});
	};

	const columns = createInvitationColumns({ onDelete: handleDelete });

	useEffect(() => {
		void fetchHistory();
	}, [fetchHistory]);

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
			<PageHeader
				title="Riwayat Undangan"
				subtitle={
					loading ?
						<div className="flex items-center gap-1.5">
							Riwayat Undangan - Total{" "}
							<TextLoading variant="dots" message="" className="w-40" />
						</div>
					:	`Daftar Undangan - Total ${history.length} undangan`
				}
				backPath={true}
			/>

			<div className="">
				{/* Status summary chips */}
				{!loading && history.length > 0 && (
					<div className="flex items-center justify-between ">
						<div className="flex flex-wrap gap-2 ">
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
					</div>
				)}
			</div>

			{/* Table */}
			<div className="bg-muted/50 rounded-xl border">
				<div className="px-5 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-lg font-semibold">Daftar Riwayat Undangan</h2>
							<p className="text-sm text-muted-foreground">
								Total {history.length} undangan
							</p>
						</div>
						<div>
							<Input
								placeholder="Cari email"
								className="w-[300px] bg-white rounded-lg"
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
							/>
						</div>
					</div>
				</div>

				<div className="px-2 pb-2">
					<DataTable
						columns={columns}
						data={history}
						searchKey="email"
						searchValue={searchValue}
						loading={loading}
						loadingMessage="Memuat riwayat undangan..."
					/>
				</div>
			</div>
		</>
	);
};

export default HistoryStaffInvitations;
