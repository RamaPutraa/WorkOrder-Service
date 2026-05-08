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

const ViewStaff = () => {
	const { employees, loading, error, fetchEmployees } = useStaff();
	const [openInvite, setOpenInvite] = useState(false);

	// ── Filter state ───────────────────────────────────────────────────────────
	const [searchValue, setSearchValue] = useState("");

	// ── Fetch data ───────────────────────────────────────────────────────────
	useEffect(() => {
		void fetchEmployees();
	}, [fetchEmployees]);

	if (error) {
		return <EmptyData />;
	}

	const ROLE_SUMMARY = [
		{ label: "Total Pegawai", icon: Users, key: "all" },
		{ label: "Manager Perusahaan", icon: ShieldUser, key: "manager_company" },
		{ label: "Pegawai Perusahaan", icon: User, key: "staff_company" },
	];

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
				<div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
					{ROLE_SUMMARY.map(({ label, icon: Icon, key }) => {
						const count =
							key === "all" ?
								employees.length
							:	employees.filter((h) => h.role === key).length;
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
