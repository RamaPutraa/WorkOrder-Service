import React, { useEffect, useState } from "react";
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
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
} from "@/components/ui/pagination";
import { motion } from "framer-motion";
import usePosition from "../hooks/usePosition";

const ITEMS_PER_PAGE = 6;

const PositionView: React.FC = () => {
	const { fetchPositions, positions, loading, error } = usePosition();
	const [currentPage, setCurrentPage] = useState(1);
	const navigate = useNavigate();

	useEffect(() => {
		void fetchPositions();
	}, []);

	const totalPages = Math.ceil(positions.length / ITEMS_PER_PAGE);

	const paginated = positions.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	// 🔹 fungsi untuk menentukan halaman mana yang tampil + ellipsis
	const getVisiblePages = () => {
		if (totalPages <= 5)
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
		if (currentPage >= totalPages - 2)
			return [
				1,
				"...",
				totalPages - 3,
				totalPages - 2,
				totalPages - 1,
				totalPages,
			];
		return [
			1,
			"...",
			currentPage - 1,
			currentPage,
			currentPage + 1,
			"...",
			totalPages,
		];
	};

	const visiblePages = getVisiblePages();

	if (error) {
		return (
			<div className="container py-8 px-10">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<div className="container">
			{/* 🔹 Header Section */}
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
					<Plus className="h-4 w-4 mr-2" />
					Tambah Posisi
				</Button>
			</div>

			{/* 🔹 Tabel Data */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: "easeOut" }}>
				<Card className="p-6 border shadow-sm rounded-2xl bg-gradient-to-b from-white to-gray-50">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow className="bg-muted/50">
									<TableHead className="w-16 text-center font-semibold">
										No
									</TableHead>
									<TableHead className="font-semibold">Nama Posisi</TableHead>
									<TableHead className="font-semibold">Company ID</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{loading ? (
									Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
										<TableRow key={idx}>
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
								) : paginated.length > 0 ? (
									paginated.map((pos, idx) => (
										<TableRow
											key={pos._id}
											className="hover:bg-primary/5 cursor-pointer transition-all duration-200 ease-in-out rounded-md"
											onClick={() =>
												navigate(`/dashboard/owner/positions/${pos._id}`)
											}>
											<TableCell className="text-center font-medium">
												{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
											</TableCell>
											<TableCell className="font-medium">{pos.name}</TableCell>
											<TableCell>{pos.companyId}</TableCell>
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

					{/* 🔹 Pagination Section */}
					{!loading && positions.length > ITEMS_PER_PAGE && (
						<div className="mt-4 flex justify-center">
							<motion.div
								className="mt-4 flex justify-center"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2, duration: 0.3 }}>
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												href="#"
												onClick={(e) => {
													e.preventDefault();
													setCurrentPage((p) => Math.max(1, p - 1));
												}}
												className={
													currentPage === 1
														? "opacity-50 pointer-events-none"
														: ""
												}
											/>
										</PaginationItem>

										{visiblePages.map((page, i) =>
											page === "..." ? (
												<PaginationItem key={i}>
													<PaginationEllipsis />
												</PaginationItem>
											) : (
												<PaginationItem key={i}>
													<PaginationLink
														href="#"
														onClick={(e) => {
															e.preventDefault();
															setCurrentPage(Number(page));
														}}
														isActive={currentPage === page}>
														{page}
													</PaginationLink>
												</PaginationItem>
											)
										)}

										<PaginationItem>
											<PaginationNext
												href="#"
												onClick={(e) => {
													e.preventDefault();
													setCurrentPage((p) => Math.min(totalPages, p + 1));
												}}
												className={
													currentPage === totalPages
														? "opacity-50 pointer-events-none"
														: ""
												}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</motion.div>
						</div>
					)}
				</Card>
			</motion.div>
		</div>
	);
};

export default PositionView;
