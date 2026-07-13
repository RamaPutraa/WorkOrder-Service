import { DataTable } from "@/components/ui/data-table";
import { getInvitationColumns } from "../components/invitation-columns";
import { useInvitations } from "../hooks/invitations";
import StaffConfirmPage from "../components/staff-confirm";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { ClaimCodeDialog } from "../components/claim-code-dialog";
import { Mail, QrCode } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { TextLoading } from "@/shared/atoms/loading-state";
import { useAuthStore } from "@/store/authStore";

const STATUS_SUMMARY = [
	{ label: "Total Undangan", icon: Mail, key: "all" },
	{ label: "Menunggu", icon: Mail, key: "pending" },
	{ label: "Kadaluarsa", icon: Mail, key: "expired" },
];

const InvitationsHistory = () => {
	const {
		history,
		loading,
		error,
		isAlreadyAccepted,
		handleAccept,
		handleReject,
		actionLoadingId,
	} = useInvitations();
	const user = useAuthStore((state) => state.user);
	const [globalFilter, setGlobalFilter] = useState("");
	const [claimOpen, setClaimOpen] = useState(false);

	const columns = useMemo(
		() =>
			getInvitationColumns({
				onAccept: handleAccept,
				onReject: handleReject,
				actionLoadingId,
			}),
		[handleAccept, handleReject, actionLoadingId],
	);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<SectionLoading message="Memuat riwayat undangan..." />
			</div>
		);
	}
	if (error) {
		return (
			<div className="p-6">
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-red-600">Error: {error}</p>
				</div>
			</div>
		);
	}
	if (isAlreadyAccepted) {
		return <StaffConfirmPage />;
	}

	return (
		<div className="space-y-6 pb-8">
			{/* Header */}
			<PageHeader
				title="Riwayat Undangan"
				subtitle={
					loading ?
						<div className="flex items-center gap-1.5">
							Daftar undangan - Total{" "}
							<TextLoading variant="dots" message="" className="w-40" />
						</div>
					:	`Daftar undangan - Total ${history.length} undangan`
				}
				backPath={true}
				{...(user?.role === "staff_unassigned" && {
					onAddClick: () => setClaimOpen(true),
					addLabel: "Klaim Kode Pegawai",
					addIcon: <QrCode className="w-4 h-4" />,
				})}
			/>

			{/* Summary Cards */}
			{!loading && history.length > 0 && (
				<div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
					{STATUS_SUMMARY.map(({ label, icon: Icon, key }) => {
						const count =
							key === "all" ?
								history.length
							:	history.filter((h) => h.status === key).length;
						return (
							<div
								key={String(key)}
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

			{/* Table Container */}
			<div className="bg-muted/20 rounded-xl shadow-sm border overflow-hidden">
				{/* Table Header */}
				<div className="px-5 py-5 border-b bg-muted/20">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div>
							<h2 className="text-lg font-semibold text-foreground">
								Daftar Riwayat Undangan
							</h2>
							<p className="text-sm text-muted-foreground mt-1">
								Lihat dan kelola undangan yang Anda terima
							</p>
						</div>
						<div className="w-full sm:w-auto">
							<Input
								placeholder="Cari nama perusahaan..."
								value={globalFilter}
								onChange={(e) => setGlobalFilter(e.target.value)}
								className="w-full sm:w-[300px] bg-white transition-shadow focus-visible:shadow-sm"
							/>
						</div>
					</div>
				</div>
				<div className="p-0 sm:p-2">
					<DataTable
						columns={columns}
						data={history}
						searchValue={globalFilter}
						loading={loading}
						loadingMessage="Memuat riwayat undangan..."
					/>
				</div>
			</div>

			<ClaimCodeDialog open={claimOpen} onOpenChange={setClaimOpen} />
		</div>
	);
};

export default InvitationsHistory;
