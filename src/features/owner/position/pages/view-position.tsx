// import { DataTable } from "@/components/ui/data-table";
import { DataTable } from "@/components/ui/data-table";
import { positionColumns } from "../components/position-columns";
import usePosition from "../hooks/usePosition";
import { ChevronLeft, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PositionView = () => {
	const { fetchPositions, positions, loading, error } = usePosition();
	const navigate = useNavigate();

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
			<div className="flex items-center gap-4 mb-8">
				<Button
					onClick={() => navigate(-1)}
					className="bg-primary hover:bg-primary/90 h-full shrink-0">
					<ChevronLeft className="size-6" />
				</Button>
				<div className="flex-1">
					<h1 className="text-2xl font-bold">Manajemen Departemen</h1>
					<p className="text-muted-foreground text-sm mt-0.5">
						Daftar departemen - Total {positions.length} departemen
					</p>
				</div>

				<Button
					className="bg-primary hover:bg-primary/90"
					onClick={() => navigate("/dashboard/internal/positions/create")}>
					<Plus className="h-4 w-4 mr-2" />
					Tambah Posisi
				</Button>
			</div>

			{/* Data Table */}
			<Card>
				<CardHeader>
					<h2 className="text-lg font-semibold">Daftar Departemen</h2>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={positionColumns}
						data={positions}
						loading={loading}
						loadingMessage="Memuat data posisi..."
					/>
				</CardContent>
			</Card>
		</>
	);
};

export default PositionView;
