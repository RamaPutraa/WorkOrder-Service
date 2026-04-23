import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../components/columns";
import { useStaff } from "../hooks/use-staff";
import InviteEmployeeDialog from "../components/invite-employee-dialog";
import PageHeader from "@/shared/atoms/header-content";
import { TextLoading } from "@/shared/atoms/loading-state";
import { Input } from "@/components/ui/input";

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

			{/* Data Table */}
			<div className="border rounded-xl bg-muted/50">
				{/* header */}
				<div className="flex flex-row items-center justify-between px-5 py-4">
					<div>
						<h2 className="text-lg font-semibold">Daftar Karyawan</h2>
						<p className="text-sm text-muted-foreground">
							Total {employees.length} karyawan
						</p>
					</div>

					<Input
						placeholder="Cari nama pegawai..."
						className="w-[200px] bg-white rounded-lg"
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
				</div>
				<div className="px-2 pb-2">
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
		</>
	);
};

export default ViewStaff;
