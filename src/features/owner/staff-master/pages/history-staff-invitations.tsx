import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { createInvitationColumns } from "../components/invitation-columns";
import { useStaffHistory } from "../hooks/use-staff-history";
import { useDialogStore } from "@/store/dialogStore";
import PageHeader from "@/shared/atoms/header-content";
import { TextLoading } from "@/shared/atoms/loading-state";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Timer } from "lucide-react";
import { EmptyData } from "@/shared/molecules/empty-data";



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
		return <EmptyData />;
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
						: `Daftar Undangan - Total ${history.length} undangan`
				}
				backPath={true}
			/>

			{/* Status summary chips */}
			{!loading && history.length > 0 && (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
					{[
						{
							label: "Menunggu",
							value: history.filter((h) => h.status === "pending").length,
							icon: Timer,
							color: "text-primary",
							bg: "bg-primary/8",
						},
						{
							label: "Diterima",
							value: history.filter((h) => h.status === "accepted").length,
							icon: CheckCircle,
							color: "text-emerald-600",
							bg: "bg-emerald-50",
						},
						{
							label: "Ditolak",
							value: history.filter((h) => h.status === "rejected").length,
							icon: XCircle,
							color: "text-rose-500",
							bg: "bg-rose-50",
						},

					].map(({ label, value, icon: Icon, color, bg }) => (
						<div
							key={label}
							className="flex items-center gap-3 p-4 rounded-2xl border bg-white shadow-sm">
							<div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
								<Icon className={`w-4.5 h-4.5 ${color}`} />
							</div>
							<div className="min-w-0">
								<p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
									{label}
								</p>
								<p className="text-sm font-bold text-slate-900 truncate mt-0.5">{value}</p>
							</div>
						</div>
					))}
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
