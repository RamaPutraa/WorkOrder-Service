import { DataTable } from "@/components/ui/data-table";
import { createPositionColumns } from "../components/position-columns";
import usePosition from "../hooks/usePosition";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import EditPositionDialog from "../components/edit-position-dialog";
import PageHeader from "@/shared/atoms/header-content";
import { TextLoading } from "@/shared/atoms/loading-state";

const PositionView = () => {
	const { fetchPositions, positions, loading, error } = usePosition();
	const navigate = useNavigate();

	// ── Edit dialog state ──────────────────────────────────────────────────────
	const [editOpen, setEditOpen] = useState(false);
	const [selectedPosition, setSelectedPosition] = useState<Position | null>(
		null,
	);

	const handleEdit = (position: Position) => {
		setSelectedPosition(position);
		setEditOpen(true);
	};

	const handleDelete = (_position: Position) => {
		// TODO: implement delete logic
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
			<Card>
				<CardHeader>
					<h2 className="text-lg font-semibold">Daftar Departemen</h2>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={columns}
						data={positions}
						loading={loading}
						loadingMessage="Memuat data posisi..."
					/>
				</CardContent>
			</Card>

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
