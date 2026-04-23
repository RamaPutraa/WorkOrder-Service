import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { createInvitationColumns } from "../components/invitation-columns";
import { useStaffHistory } from "../hooks/use-staff-history";
import { useDialogStore } from "@/store/dialogStore";
import PageHeader from "@/shared/atoms/header-content";
import { TextLoading } from "@/shared/atoms/loading-state";
import { Input } from "@/components/ui/input";
import { Clock, CheckCircle, XCircle, Timer } from "lucide-react";

const STATUS_SUMMARY = [
	{ label: "Menunggu", icon: Timer, key: "pending" },
	{ label: "Diterima", icon: CheckCircle, key: "accepted" },
	{ label: "Ditolak", icon: XCircle, key: "rejected" },
	{ label: "Kadaluarsa", icon: Clock, key: "expired" },
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
		<div className="space-y-6 pb-8">
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

			{/* Status summary chips */}
			{!loading && history.length > 0 && (
				<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
					{STATUS_SUMMARY.map(({ label, icon: Icon, key }) => {
						const count = history.filter((h) => h.status === key).length;
						return (
							<div
								key={key}
								className="bg-muted/30 rounded-xl border p-1.5 transition-all hover:bg-muted/50">
								<div className="flex items-center justify-between py-2 px-3">
									<p className="text-muted-foreground text-xs sm:text-sm font-medium">
										{label}
									</p>
									<Icon size={16} className="text-muted-foreground" />
								</div>
								<div className="pt-6 sm:pt-8 px-3 pb-3 mt-1 rounded-lg border bg-white shadow-sm">
									<p className="text-2xl sm:text-3xl font-bold text-foreground">
										{count}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Table */}
			<div className="bg-white rounded-xl border shadow-sm overflow-hidden">
				<div className="px-5 py-5 border-b bg-muted/30">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div>
							<h2 className="text-lg font-semibold text-foreground">
								Daftar Riwayat Undangan
							</h2>
							<p className="text-sm text-muted-foreground mt-1">
								Kelola dan pantau riwayat undangan staff
							</p>
						</div>
						<div className="w-full sm:w-auto">
							<Input
								placeholder="Cari email..."
								className="w-full sm:w-[300px] bg-white transition-shadow focus-visible:shadow-sm"
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
							/>
						</div>
					</div>
				</div>

				<div className="p-0 sm:p-2 bg-muted/30">
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
		</div>
	);
};

export default HistoryStaffInvitations;
