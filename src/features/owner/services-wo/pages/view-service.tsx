import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, LayoutGrid, List, Eye, DollarSign, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLoading } from "@/shared/atoms";
import { useCreateService } from "../hooks/useCreateService";
import PageHeader from "@/shared/atoms/header-content";
import { Badge } from "@/components/ui/badge";
import { GenericFilter } from "@/shared/molecules/generic-filter";
import { EmptyData } from "@/shared/molecules/empty-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CreateServiceModal } from "../components/create-service-modal";
import useAuth from "@/features/auth/hooks/useAuth";
import { EditPriceDialog } from "../../pricing/components/edit-price-dialog";
import { usePricing } from "../../pricing/hooks/use-pricing";

const serviceTypeLabel = (type: any) => {
	const strType = String(type).toLowerCase();
	switch (strType) {
		case "internal":
		case "2":
			return "Internal Perusahaan";
		case "public":
		case "0":
			return "Publik";
		case "member_only":
		case "1":
			return "Berlangganan";
		default:
			return strType;
	}
};

const accessBadgeStyle = (type: any) => {
	const strType = String(type).toLowerCase();
	switch (strType) {
		case "internal":
		case "2":
			return "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50";
		case "public":
		case "0":
			return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50";
		case "member_only":
		case "1":
			return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50";
		default:
			return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50";
	}
};

const formatRupiah = (value: number) =>
	new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(value);

const ViewService: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { loading, error, fecthServices, filteredData, filterConfig } =
		useCreateService();

	// Lazy loading - fetch services on mount
	useEffect(() => {
		void fecthServices();
	}, []);

	const [viewMode, setViewMode] = useState<string>(() => {
		return sessionStorage.getItem("serviceViewMode") || "card";
	});

	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	// Price editing state
	const { pricingList, createPricing, updatePricing, submitting: pricingSubmitting } = usePricing();
	const [priceDialogOpen, setPriceDialogOpen] = useState(false);
	const [selectedServiceForPrice, setSelectedServiceForPrice] = useState<any>(null);

	const handleEditPrice = (e: React.MouseEvent, service: any) => {
		e.stopPropagation();
		setSelectedServiceForPrice(service);
		setPriceDialogOpen(true);
	};

	const handlePriceSubmit = async (price: number) => {
		if (!selectedServiceForPrice) return;

		const existingPricing = pricingList.find((p: any) => p.service?._id === selectedServiceForPrice._id);

		if (existingPricing) {
			await updatePricing(existingPricing._id, { serviceId: selectedServiceForPrice._id, price });
		} else {
			await createPricing({ serviceId: selectedServiceForPrice._id, price });
		}

		await fecthServices();
		setPriceDialogOpen(false);
	};

	const handleViewChange = (value: string) => {
		setViewMode(value);
		sessionStorage.setItem("serviceViewMode", value);
	};

	const handleAddClick = () => {
		if (user?.role === "manager_company") {
			navigate("/dashboard/internal/services/create");
		} else {
			setIsCreateModalOpen(true);
		}
	};

	const handleSelectBlank = () => {
		setIsCreateModalOpen(false);
		navigate("/dashboard/internal/services/create");
	};

	const handleSelectTemplate = () => {
		setIsCreateModalOpen(false);
		navigate("/dashboard/internal/services/create/company-type");
	};

	const columns: ColumnDef<any>[] = useMemo(
		() => [
			{
				id: "no",
				cell: ({ row, table }) => {
					const pageIndex = table.getState().pagination.pageIndex;
					const pageSize = table.getState().pagination.pageSize;
					return (
						<p className="text-sm text-center text-muted-foreground">
							{pageIndex * pageSize + row.index + 1}
						</p>
					);
				},
			},
			{
				accessorKey: "title",
				header: "Nama Layanan",
				cell: ({ row }) => (
					<div>
						<p className="font-medium text-slate-900">
							{row.original.title || "Untitled Service"}
						</p>
						<p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
							{row.original.description || "Tidak ada deskripsi."}
						</p>
					</div>
				),
			},
			{
				accessorKey: "accessType",
				header: "Tipe Layanan",
				cell: ({ row }) => (
					<Badge
						variant="outline"
						className={`rounded-full uppercase tracking-wider text-[10px] border shadow-none ${accessBadgeStyle(row.original.accessType)}`}>
						{serviceTypeLabel(row.original.accessType)}
					</Badge>
				),
			},
			{
				accessorKey: "createdAt",
				header: "Tanggal Dibuat",
				cell: ({ row }) => {
					const date = row.original.createdAt;
					if (!date) return <span className="text-muted-foreground">-</span>;
					return (
						<span className="text-muted-foreground">
							{new Date(date).toLocaleDateString("id-ID", {
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
						</span>
					);
				},
			},
			{
				accessorKey: "updatedAt",
				header: "Terakhir Diperbarui",
				cell: ({ row }) => {
					const date = row.original.updatedAt;
					if (!date) return <span className="text-muted-foreground">-</span>;
					return (
						<span className="text-muted-foreground">
							{new Date(date).toLocaleDateString("id-ID", {
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
						</span>
					);
				},
			},
			{
				accessorKey: "isActive",
				header: "Status",
				cell: ({ row }) => {
					const isActive = row.original.isActive;
					return isActive ?
						<div className="flex items-center gap-1.5 text-emerald-600 border border-emerald-500 rounded-full px-2 py-0.5">
							<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
							<span className="text-[10px] font-bold uppercase tracking-wider">
								Aktif
							</span>
						</div>
						: <div className="flex items-center gap-1.5 text-slate-500 border border-slate-500 rounded-full px-2 py-0.5">
							<span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
							<span className="text-[10px] font-bold uppercase tracking-wider">
								Nonaktif
							</span>
						</div>;
				},
			},
			{
				id: "actions",
				cell: ({ row }) => (
					<Button
						className="hover:cursor-pointer"
						variant="ghost"
						size="sm"
						onClick={() =>
							navigate(
								`/dashboard/internal/services/detail/${row.original._id}`,
							)
						}>
						<Eye className="w-4 h-4" />
						<span className="text-xs ml-2">Lihat Detail</span>
					</Button>
				),
			},
		],
		[navigate],
	);

	if (error) {
		return <EmptyData />;
	}

	return (
		<>
			{/* header */}
			<PageHeader
				title="List Data Layanan"
				subtitle="Berikut merupakan list layanan yang dimiliki oleh perusahaan."
				onAddClick={handleAddClick}
				addLabel="Tambah Layanan"
				backPath={true}
			/>

			<CreateServiceModal
				open={isCreateModalOpen}
				onOpenChange={setIsCreateModalOpen}
				onSelectBlank={handleSelectBlank}
				onSelectTemplate={handleSelectTemplate}
			/>

			<Tabs
				value={viewMode}
				onValueChange={handleViewChange}
				className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<GenericFilter config={filterConfig} />
					<TabsList>
						<TabsTrigger value="card" className="flex items-center gap-2">
							<LayoutGrid className="w-4 h-4" /> Card
						</TabsTrigger>
						<TabsTrigger value="table" className="flex items-center gap-2">
							<List className="w-4 h-4" /> Tabel
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="card" className="m-0 focus-visible:outline-none">
					{/* Main Content - Services Grid */}
					<div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
						<AnimatePresence mode="wait">
							{loading ?
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
									className="col-span-full">
									<SectionLoading message="Memuat data service..." />
								</motion.div>
								: filteredData.length > 0 ?
									filteredData.map((service) => (
										<motion.div
											key={service._id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											whileHover={{ scale: 1.02, y: -4 }}
											transition={{ duration: 0.2, ease: "easeOut" }}>
											<div
												onClick={() =>
													navigate(
														`/dashboard/internal/services/detail/${service._id}`,
													)
												}
												className=" group gap-2 flex flex-col h-full bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:cursor-pointer">
												<div className=" space-y-4">
													{/* Header */}
													<div className="flex items-center justify-start border-b border-slate-100 px-5 py-3 gap-2">
														<div>
															{/* Status Badge */}
															{service.isActive ?
																<div className=" items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
																	<span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
																	Aktif
																</div>
																: <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
																	<span className="w-1 h-1 rounded-full bg-slate-400" />
																	Nonaktif
																</div>
															}
														</div>
														{/* type services */}
														<Badge
															variant="outline"
															className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border shadow-none ${accessBadgeStyle(service.accessType)}`}
														>
															{serviceTypeLabel(service.accessType)}
														</Badge>
													</div>
													{/* Baris Atas: Icon, Judul, dan Status */}
													<div className="flex items-start justify-between gap-4 px-5 py-2">
														<div className="flex items-center gap-3 min-w-0">
															{/* Icon */}
															<div className="shrink-0 p-2.5 rounded-xl bg-primary/5 text-primary  transition-colors">
																<ClipboardList className="w-6 h-6" />
															</div>

															{/* Judul dengan min-height agar sejajar antar card */}
															<h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 min-h-[2.5rem] flex items-center">
																{service.title || "Untitled Form"}
															</h3>
														</div>
													</div>

													{/* Deskripsi - Masuk dalam CardContent atau tetap di Header dengan padding yang pas */}
													<div className="px-5 text-sm text-slate-500 leading-relaxed line-clamp-3 min-h-[6rem] text-justify">
														{service.description ||
															"Tidak ada deskripsi tersedia untuk layanan ini."}
													</div>
												</div>

												<div className="text-xs py-5 px-5 border-t border-slate-200/70 p-0 flex items-center justify-between">
													<div className="flex items-center gap-2">
														<div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
															<DollarSign className="w-3.5 h-3.5 text-amber-500" />
														</div>
														<div>
															<p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
																Harga
															</p>
															<p className="text-base font-bold text-slate-900 leading-tight">
																{service.price === 0 ? "Gratis" : service.price ? formatRupiah(service.price) : "Belum diatur"}
															</p>
														</div>
													</div>
													{/* Actions */}
													<div className="flex items-center gap-1">
														<button
															onClick={(e) => handleEditPrice(e, service)}
															className="p-2 rounded-lg hover:bg-primary/8 text-slate-400 hover:text-primary transition-colors hover:cursor-pointer">
															<Pencil className="w-3.5 h-3.5" />
														</button>

													</div>
												</div>

											</div>
										</motion.div>
									))
									: <motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="col-span-full">
										<EmptyData />
									</motion.div>
							}
						</AnimatePresence>
					</div>
				</TabsContent>

				<TabsContent value="table" className="m-0 focus-visible:outline-none">
					<AnimatePresence mode="wait">
						{loading ?
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
								className="col-span-full">
								<SectionLoading message="Memuat data layanan..." />
							</motion.div>
							: filteredData.length > 0 ?
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.2, ease: "easeOut" }}>
									<div className="bg-muted/20 rounded-xl border border-slate-200/70">
										<div className="">
											<div className="flex flex-row items-center justify-between px-5 py-5 border-b border-slate-200/70">
												<div>
													<h2 className="text-sm font-semibold">
														Daftar Layanan
													</h2>
												</div>
												<div className="flex items-center">
													<ClipboardList className="w-4 h-4 mr-2" />
												</div>
											</div>

											<div className="p-0 sm:p-2">
												<DataTable
													columns={columns}
													data={filteredData}
													loading={loading}
													loadingMessage="Memuat data layanan..."
													searchKey="title"
												/>
											</div>
										</div>
									</div>
								</motion.div>
								: <motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="col-span-full">
									<EmptyData />
								</motion.div>
						}
					</AnimatePresence>
				</TabsContent>
			</Tabs>

			<EditPriceDialog
				open={priceDialogOpen}
				onClose={() => setPriceDialogOpen(false)}
				service={selectedServiceForPrice}
				onSubmit={handlePriceSubmit}
				submitting={pricingSubmitting}
			/>
		</>
	);
};

export default ViewService;
