import React, { useEffect, useState } from "react";
import { getPositionsApi } from "../services/positionService";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const PositionView: React.FC = () => {
	const [positions, setPositions] = useState<Position[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	useEffect(() => {
		const fetchPositions = async (): Promise<void> => {
			try {
				setLoading(true);
				const res = await getPositionsApi();
				setPositions(res.data ?? []);
				console.log("API response:", res);
			} catch {
				setError("Gagal memuat data posisi");
			} finally {
				setLoading(false);
			}
		};

		void fetchPositions();
	}, []);

	if (loading) {
		return (
			<div className="container py-8 px-10">
				<p>Memuat data posisi...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container py-8 px-10">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<div className="container py-10 px-6">
			<div className="flex items-center justify-between mb-8">
				<div className="flex flex-col space-y-2">
					<h1 className="text-2xl font-bold">List Data Posisi Pegawai</h1>
					<p className="text-muted-foreground">
						Berikut merupakan daftar posisi pegawai yang dimiliki oleh
						perusahaan.
					</p>
				</div>

				<Button
					className="bg-primary hover:bg-primary/90"
					onClick={() => navigate("/dashboard/owner/positions/create")}>
					<Plus className="h-4 w-4" />
					Tambah Posisi
				</Button>
			</div>

			<Card className="p-6 border shadow-md rounded-2xl bg-white">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow className="bg-muted/50">
								<TableHead className="w-16 text-center font-semibold text-gray-700">
									No
								</TableHead>
								<TableHead className="font-semibold text-gray-700">
									Nama Posisi
								</TableHead>
								<TableHead className="font-semibold text-gray-700">
									Company ID
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{positions.length > 0 ? (
								positions.map((pos, index) => (
									<TableRow
										key={pos._id}
										className="hover:bg-muted/30 transition-colors">
										<TableCell className="text-center font-medium text-gray-800">
											{index + 1}
										</TableCell>
										<TableCell className="font-medium text-gray-900">
											{pos.name}
										</TableCell>
										<TableCell className="text-gray-700">
											{pos.companyId}
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={3}
										className="text-center text-muted-foreground py-6">
										Tidak ada data posisi.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</Card>
		</div>
	);
};

export default PositionView;
