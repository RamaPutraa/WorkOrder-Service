// import { DataTable } from "@/components/ui/data-table";
import { DataTable } from "@/components/ui/data-table";
import { positionColumns } from "../components/position-columns";
import usePosition from "../hooks/usePosition";
import { ChevronLeft, Loader2, Plus } from "lucide-react";
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

	if (loading) {
		return (
			<div className="flex items-center justify-center h-40">
				<Loader2 className="animate-spin" />
				<span className="ml-2">Memuat data posisi...</span>
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

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-6">
					<Button
						onClick={() => navigate(-1)}
						className="bg-primary hover:bg-primary/90 h-full">
						<ChevronLeft className="size-6" />
					</Button>
					<div className="flex flex-col space-y-2">
						<h1 className="text-2xl font-bold tracking-tight">
							Manajemen Posisi
						</h1>
						<p className="text-muted-foreground">
							Daftar posisi pegawai - Total {positions.length} posisi
						</p>
					</div>
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
					<h2 className="text-lg font-semibold">Daftar Posisi</h2>
				</CardHeader>
				<CardContent>
					<DataTable columns={positionColumns} data={positions} />
				</CardContent>
			</Card>
		</div>
	);
};

export default PositionView;
