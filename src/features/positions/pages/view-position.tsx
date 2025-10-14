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
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

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
			} catch {
				setError("Gagal memuat data posisi");
			} finally {
				setLoading(false);
			}
		};

		void fetchPositions();
	}, []);

	if (error) {
		return (
			<div className="container py-8 px-10">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<div className="container py-10 px-6">
			{/* Header Section */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex flex-col space-y-2">
					<h1 className="text-2xl font-bold tracking-tight">
						List Data Posisi Pegawai
					</h1>
					<p className="text-muted-foreground">
						Berikut merupakan daftar posisi pegawai yang dimiliki oleh
						perusahaan.
					</p>
				</div>

				<Button
					className="bg-primary hover:bg-primary/90 shadow-sm"
					onClick={() => navigate("/dashboard/owner/positions/create")}>
					<Plus className="h-4 w-4 mr-2" />
					Tambah Posisi
				</Button>
			</div>

			{/* Table Section */}
			<Card className="p-6 border  shadow-sm rounded-2xl bg-gradient-to-b ">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow className="bg-muted/50">
								<TableHead className="w-16 text-center font-semibold ">
									No
								</TableHead>
								<TableHead className="font-semibold ">Nama Posisi</TableHead>
								<TableHead className="font-semibold ">Company ID</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{loading ? (
								// Skeleton loading
								Array.from({ length: 5 }).map((_, index) => (
									<TableRow key={index}>
										<TableCell className="text-center">
											<Skeleton className="h-4 w-4 mx-auto" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-32" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-24" />
										</TableCell>
									</TableRow>
								))
							) : positions.length > 0 ? (
								positions.map((pos, index) => (
									<motion.tr
										key={pos._id}
										initial={{ opacity: 0, y: 8 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3, delay: index * 0.05 }}
										onClick={() =>
											navigate(`/dashboard/owner/positions/${pos._id}`)
										}
										className="hover:bg-primary/5  cursor-pointer transition-all duration-200 ease-in-out rounded-md">
										<TableCell className="text-center font-medium ">
											{index + 1}
										</TableCell>
										<TableCell className="font-medium ">{pos.name}</TableCell>
										<TableCell className="">{pos.companyId}</TableCell>
									</motion.tr>
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
