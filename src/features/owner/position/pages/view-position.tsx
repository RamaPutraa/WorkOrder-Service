import { DataTable } from "@/components/ui/data-table";
import { createPositionColumns } from "../components/position-columns";
import usePosition from "../hooks/usePosition";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import EditPositionDialog from "../components/edit-position-dialog";
import PageHeader from "@/shared/atoms/header-content";
import { useDialogStore } from "@/store/dialogStore";
import { TextLoading } from "@/shared/atoms/loading-state";
import { Users } from "lucide-react";
import ErrorPage from "@/shared/errors/templates/error-page";

const PositionView = () => {
	const { fetchPositions, positions, loading, error, removePosition } =
		usePosition();
	const { showDialog } = useDialogStore();
	const navigate = useNavigate();

	// ── Filter state ───────────────────────────────────────────────────────────
	const [globalFilter, setGlobalFilter] = useState("");

	// ── Edit dialog state ──────────────────────────────────────────────────────
	const [editOpen, setEditOpen] = useState(false);
	const [selectedPosition, setSelectedPosition] = useState<Position | null>(
		null,
	);

	const handleEdit = (position: Position) => {
		setSelectedPosition(position);
		setEditOpen(true);
	};

	const DEPARTEMENT_SUMMARY = [
		{ label: "Total Departemen", icon: Users, key: "all" },
		{ label: "Departemen Aktif", icon: Users, key: true },
		{ label: "Departemen Non-Aktif", icon: Users, key: false },
	];

	const handleDelete = (position: Position) => {
		showDialog({
			title: "Hapus Departemen",
			description: `Apakah Anda yakin ingin menghapus departemen ${position.name}?`,
			confirmText: "Hapus",
			cancelText: "Batal",
			onConfirm: async () => {
				await removePosition(position._id);
			},
		});
	};

	const columns = useMemo(
		() =>
			createPositionColumns({
				onEdit: handleEdit,
				onDelete: handleDelete,
			}),
		[],
	);

	useEffect(() => {
		void fetchPositions();
	}, []);

	if (error) {
		return <ErrorPage />;
	}

	return (
		<div className="space-y-6 pb-8">
			{/* header */}
			<PageHeader
				title="Manajemen Departemen"
				subtitle={
					loading ?
						<div className="flex items-center gap-1.5">
							Daftar Departemen - Total{" "}
							<TextLoading variant="dots" message="" className="w-40" />
						</div>
					:	`Daftar Departemen - Total ${positions.length} departemen`
				}
				onAddClick={() => navigate("/dashboard/internal/positions/create")}
				addLabel="Tambah Departemen"
				backPath={true}
			/>

			{/* Summary Cards */}
			{!loading && positions.length > 0 && (
				<div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
					{DEPARTEMENT_SUMMARY.map(({ label, icon: Icon, key }) => {
						const count =
							key === "all" ?
								positions.length
							:	positions.filter((h) => h.isActive === key).length;
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

			{/* Data Table */}
			<div className="bg-muted/20 rounded-xl shadow-sm border overflow-hidden">
				{/* header */}
				<div className="px-5 py-5 border-b bg-muted/20">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div>
							<h2 className="text-lg font-semibold text-foreground">
								Daftar Departemen
							</h2>
							<p className="text-sm text-muted-foreground mt-1">
								Kelola dan pantau data departemen perusahaan
							</p>
						</div>
						<div className="w-full sm:w-auto">
							<Input
								placeholder="Cari nama departemen..."
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
						data={positions}
						searchValue={globalFilter}
						loading={loading}
						loadingMessage="Memuat data posisi..."
					/>
				</div>
			</div>

			{/* Edit / Update Dialog */}
			{selectedPosition && (
				<EditPositionDialog
					open={editOpen}
					onOpenChange={setEditOpen}
					position={selectedPosition}
					onSuccess={() => void fetchPositions()}
				/>
			)}
		</div>
	);
};

export default PositionView;
