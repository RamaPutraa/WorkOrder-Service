import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../components/columns";
import { useStaff } from "../hooks/use-staff";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import InviteEmployeeDialog from "../components/invite-employee-dialog";
import PageHeader from "@/shared/atoms/header-content";
import { TextLoading } from "@/shared/atoms/loading-state";

const ViewStaff = () => {
	const { employees, loading, error, fetchEmployees } = useStaff();
	const [openInvite, setOpenInvite] = useState(false);

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
			<Card>
				<CardHeader>
					<h2 className="text-lg font-semibold">Daftar Karyawan</h2>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={columns}
						data={employees}
						loading={loading}
						loadingMessage="Memuat data karyawan..."
					/>
				</CardContent>
			</Card>

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
