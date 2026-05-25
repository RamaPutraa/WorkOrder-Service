import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../components/columns";
import { useStaff } from "../hooks/use-staff";
import InviteEmployeeDialog from "../components/invite-employee-dialog";
import PageHeader from "@/shared/atoms/header-content";
import { TextLoading } from "@/shared/atoms/loading-state";
import { Input } from "@/components/ui/input";
import { ShieldUser, User, Users } from "lucide-react";
import { EmptyData } from "@/shared/molecules/empty-data";
import { useProfileStore } from "@/store/profileStore";

const ViewStaff = () => {
	const { employees, loading, error, fetchEmployees } = useStaff();
	const [openInvite, setOpenInvite] = useState(false);
	const profile = useProfileStore((state) => state.profile);

	// ── Filter state ───────────────────────────────────────────────────────────
	const [searchValue, setSearchValue] = useState("");

	// ── Fetch data ───────────────────────────────────────────────────────────
	useEffect(() => {
		void fetchEmployees();
	}, [fetchEmployees]);

	if (error) {
		return <EmptyData />;
	}

	return (
		<div className="space-y-6 pb-8">
			{/* header */}
			<PageHeader
				title="Manajemen Pegawai"
				subtitle={
					loading ?
						<div className="flex items-center gap-1.5">
							Daftar Pegawai - Total{" "}
							<TextLoading variant="dots" message="" className="w-40" />
						</div>
					:	`Daftar Pegawai - Total ${employees.length} pegawai`
				}
				onAddClick={() => setOpenInvite(true)}
				addLabel="Undang Pegawai"
				backPath={true}
			/>

			{/* Summary Cards */}
			{!loading && employees.length > 0 && (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
					{[
						{
							label: "Total Pegawai",
							value: employees.length,
							icon: Users,
							color: "text-primary",
							bg: "bg-primary/8",
							show: true,
						},
						{
							label: "Manager Perusahaan",
							value: employees.filter((h) => h.role === "manager_company").length,
							icon: ShieldUser,
							color: "text-violet-700",
							bg: "bg-violet-50",
							show: profile?.role !== "manager_company",
						},
						{
							label: "Pegawai Perusahaan",
							value: employees.filter((h) => h.role === "staff_company").length,
							icon: User,
							color: "text-emerald-600",
							bg: "bg-emerald-50",
							show: true,
						},
					]
						.filter((item) => item.show)
						.map(({ label, value, icon: Icon, color, bg }) => (
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

			{/* Data Table */}
			<div className=" bg-muted/20 rounded-xl border shadow-sm overflow-hidden">
				{/* header */}
				<div className="px-5 py-5 border-b">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div>
							<h2 className="text-lg font-semibold text-foreground">
								Daftar Karyawan
							</h2>
							<p className="text-sm text-muted-foreground mt-1">
								Kelola dan pantau data karyawan perusahaan
							</p>
						</div>

						<div className="w-full sm:w-auto">
							<Input
								placeholder="Cari nama pegawai..."
								className="w-full sm:w-[300px] bg-white transition-shadow focus-visible:shadow-sm"
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
							/>
						</div>
					</div>
				</div>
				<div className="p-0 sm:p-2">
					<DataTable
						columns={columns}
						data={employees}
						loading={loading}
						searchValue={searchValue}
						loadingMessage="Memuat data karyawan..."
					/>
				</div>
			</div>

			{/* Invite Dialog */}
			<InviteEmployeeDialog
				open={openInvite}
				onOpenChange={setOpenInvite}
				onSuccess={fetchEmployees}
			/>
		</div>
	);
};

export default ViewStaff;
