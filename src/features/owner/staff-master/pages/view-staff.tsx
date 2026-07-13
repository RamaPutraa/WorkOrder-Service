import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/ui/data-table";
import { createStaffColumns } from "../components/columns";
import { useStaff } from "../hooks/use-staff";
import InviteEmployeeDialog from "../components/invite-employee-dialog";
import { AddStaffMethodDialog } from "../components/add-staff-method-dialog";
import { CreateInvitationCodeDialog } from "../components/create-invitation-code-dialog";
import { StaffInvitationCodeTab } from "../components/staff-invitation-code-tab";
import PageHeader from "@/shared/atoms/header-content";
import { TextLoading } from "@/shared/atoms/loading-state";
import { Input } from "@/components/ui/input";
import { ShieldUser, User, Users, QrCode} from "lucide-react";
import { EmptyData } from "@/shared/molecules/empty-data";
import { useProfileStore } from "@/store/profileStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ViewStaff = () => {
	const { employees, loading, error, fetchEmployees } = useStaff();
	const profile = useProfileStore((state) => state.profile);
	const navigate = useNavigate();

	// ── Dialog states ───────────────────────────────────────────────────────
	const [openMethodDialog, setOpenMethodDialog] = useState(false);
	const [openInvite, setOpenInvite] = useState(false);
	const [openCodeDialog, setOpenCodeDialog] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);

	// ── Filter state ────────────────────────────────────────────────────────
	const [searchValue, setSearchValue] = useState("");

	// ── Handlers ────────────────────────────────────────────────────────────
	const handleDetail = (employee: Employee) => {
		navigate(`/dashboard/internal/staff/${employee._id}`);
	};

	const handleSelectEmail = () => {
		setOpenMethodDialog(false);
		setOpenInvite(true);
	};

	const handleSelectCode = () => {
		setOpenMethodDialog(false);
		setOpenCodeDialog(true);
	};

	const columns = useMemo(
		() =>
			createStaffColumns({
				onDetail: handleDetail,
			}),
		[],
	);

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
				onAddClick={() => setOpenMethodDialog(true)}
				addLabel="Tambah Pegawai"
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

			{/* ── Tabs ─────────────────────────────────────────────────────── */}
			<Tabs defaultValue="employees" className="w-full">
				<TabsList className="grid w-full sm:w-[400px] grid-cols-2 mb-6">
					<TabsTrigger value="employees" className="flex items-center gap-2">
						<Users className="w-3.5 h-3.5" />
						Daftar Pegawai
					</TabsTrigger>
					<TabsTrigger value="codes" className="flex items-center gap-2">
						<QrCode className="w-3.5 h-3.5" />
						Daftar Kode Undangan
					</TabsTrigger>
				</TabsList>

				{/* Tab 1 — Daftar Pegawai */}
				<TabsContent value="employees" className="mt-0 outline-none">
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
								onRowClick={handleDetail}
							/>
						</div>
					</div>
				</TabsContent>

				{/* Tab 2 — Daftar Kode Undangan */}
				<TabsContent value="codes" className="mt-0 outline-none">
					<div className="bg-muted/20 rounded-xl border shadow-sm overflow-hidden">
						<div className="px-5 py-5 border-b">
							<div className="flex items-center gap-2">
								<div className="p-1.5 rounded-lg bg-indigo-50">
									<QrCode className="w-4 h-4 text-indigo-600" />
								</div>
								<div>
									<h2 className="text-lg font-semibold text-foreground">
										Daftar Kode Undangan
									</h2>
									<p className="text-sm text-muted-foreground mt-0.5">
										Kelola kode undangan yang dapat digunakan pegawai untuk bergabung
									</p>
								</div>
							</div>
						</div>
						<div className="p-4 sm:p-6">
							<StaffInvitationCodeTab 
								onRefreshParent={fetchEmployees}
								refreshKey={refreshKey}
							/>
						</div>
					</div>
				</TabsContent>
			</Tabs>

			{/* ── Dialogs ───────────────────────────────────────────────────── */}

			{/* Method selection dialog */}
			<AddStaffMethodDialog
				open={openMethodDialog}
				onOpenChange={setOpenMethodDialog}
				onSelectEmail={handleSelectEmail}
				onSelectCode={handleSelectCode}
			/>

			{/* Email invite dialog */}
			<InviteEmployeeDialog
				open={openInvite}
				onOpenChange={setOpenInvite}
				onSuccess={fetchEmployees}
			/>

			{/* Generate code dialog */}
			<CreateInvitationCodeDialog
				open={openCodeDialog}
				onOpenChange={setOpenCodeDialog}
				onSuccess={() => {
					fetchEmployees();
					setRefreshKey((prev) => prev + 1);
				}}
			/>
		</div>
	);
};

export default ViewStaff;
