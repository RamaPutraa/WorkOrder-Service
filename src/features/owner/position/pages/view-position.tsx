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

			{/* Data Table */}
			<div className="bg-muted/50 rounded-xl border">
				{/* header */}
				<div className="flex flex-row items-center justify-between px-5 py-4">
					<div>
						<h2 className="text-lg font-semibold">Daftar Departemen</h2>
						<p className="text-sm text-muted-foreground">
							Total {positions.length} departemen
						</p>
					</div>
					<div className="flex items-center">
						<Input
							placeholder="Cari nama departemen..."
							value={globalFilter}
							onChange={(e) => setGlobalFilter(e.target.value)}
							className="max-w-sm bg-white rounded-lg"
						/>
					</div>
				</div>
				<div className="px-2 pb-2">
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
		</>
	);
};

export default PositionView;
