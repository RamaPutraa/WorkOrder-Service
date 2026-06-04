import { ScrollText, CalendarDays, LayoutGrid, List, Eye, UsersRoundIcon, Tag, Hammer, Star, Clipboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLoading } from "@/shared/atoms";
import { useForm } from "../hooks/use-form";
import PageHeader from "@/shared/atoms/header-content";
import { GenericFilter } from "@/shared/molecules/generic-filter";
import { EmptyData } from "@/shared/molecules/empty-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

const formTypeLabel = (type: string) => {
	switch (type?.toLowerCase()) {
		case "report":
			return "Laporan";
		case "intake":
			return "Pengajuan";
		case "work_order":
			return "Perintah Kerja";
		case "review":
			return "Ulasan";
		default:
			return type;
	}
};


const ViewForm: React.FC = () => {
	const { loading, error, filterConfig, filteredData } = useForm();
	const navigate = useNavigate();

	const [viewMode, setViewMode] = useState<string>(() => {
		return sessionStorage.getItem("formViewMode") || "card";
	});

	const handleViewChange = (value: string) => {
		setViewMode(value);
		sessionStorage.setItem("formViewMode", value);
	};

	const columns: ColumnDef<any>[] = useMemo(
		() => [
			{
				id: "No",
				cell: ({ row }) => (
					<p className="text-muted-foreground text-center">{row.index + 1}</p>
				),
			},
			{
				accessorKey: "title",
				header: "Nama Formulir",
				cell: ({ row }) => (
					<div>
						<p className="font-medium text-slate-900">
							{row.original.title || "Untitled Form"}
						</p>
						<p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
							{row.original.description || "No description available."}
						</p>
					</div>
				),
			},
			{
				accessorKey: "formType",
				header: "Jenis Formulir",
				cell: ({ row }) => (
					<Badge
						variant="outline"
						className="rounded-full uppercase tracking-wider text-[10px]">
						{formTypeLabel(row.original.formType)}
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
				id: "actions",
				cell: ({ row }) => (
					<Button
						className="hover:cursor-pointer"
						variant="ghost"
						size="sm"
						onClick={() =>
							navigate(`/dashboard/internal/form/detail/${row.original._id}`)
						}>
						<Eye className="w-4 h-4" />
						<span className="text-xs">Lihat Detail</span>
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
				title="List Data Formulir"
				subtitle="Berikut merupakan list form yang dimiliki oleh perusahaan."
				onAddClick={() => navigate("/dashboard/internal/form/create")}
				addLabel="Tambah Formulir"
				backPath={true}
			/>

			{/* ── Stats ── */}
			{!loading && filteredData.length > 0 && (
				<div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-5">
					{[
						{
							label: "Total Formulir",
							value: filteredData.length,
							icon: Tag,
							color: "text-primary",
							bg: "bg-primary/8",
						},
						{
							label: "Formulir Klien",
							value: filteredData.filter((form) => form.formType === "intake").length,
							icon: UsersRoundIcon,
							color: "text-emerald-600",
							bg: "bg-emerald-50",
						},
						{
							label: "Formulir Perintah Kerja",
							value: filteredData.filter((form) => form.formType === "work_order").length,
							icon: Hammer,
							color: "text-violet-700",
							bg: "bg-violet-50",
						},
						{
							label: "Formulir Laporan",
							value: filteredData.filter((form) => form.formType === "report").length,
							icon: Clipboard,
							color: "text-red-500",
							bg: "bg-red-50",

						},
						{
							label: "Formulir Ulasan",
							value: filteredData.filter((form) => form.formType === "review").length,
							icon: Star,
							color: "text-amber-500",
							bg: "bg-amber-50",

						},
					].map(({ label, value, icon: Icon, color, bg }) => (
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
					{/* Main Content - Forms Grid */}
					<div className="grid gap-4 sm:gap-5 grid-cols-1  xl:grid-cols-2">
						<AnimatePresence mode="wait">
							{loading ?
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
									className="col-span-full">
									<SectionLoading message="Memuat data form..." />
								</motion.div>
								: filteredData.length > 0 ?
									filteredData.map((form) => {
										return (
											<motion.div
												key={form._id}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												whileHover={{ scale: 1.02, y: -4 }}
												transition={{ duration: 0.2, ease: "easeOut" }}>
												<div
													onClick={() =>
														navigate(
															`/dashboard/internal/form/detail/${form._id}`,
														)
													}
													className="hover:cursor-pointer p-5 group gap-2 flex flex-col h-full bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
													<div className="py-3">
														<div className="flex items-center gap-4">
															{/* Icon */}
															<div className="shrink-0 p-3 bg-primary/5 text-primary rounded-xl">
																<ScrollText className="w-6 h-6" />
															</div>

															{/* Text Content */}
															<div className="flex-1 space-y-1">
																<h3 className="text-base font-semibold text-slate-900 leading-snug line-clamp-2">
																	{form.title || "Untitled Form"}
																</h3>

																<p className="text-sm text-slate-500 leading-relaxed line-clamp-1">
																	{form.description ||
																		"No description available."}
																</p>
															</div>
															<span className="tracking-wide uppercase">
																<Badge variant="outline">
																	{formTypeLabel(form.formType)}
																</Badge>
															</span>
														</div>
													</div>

													<div className="footer">
														<div className="w-full pt-4 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-400">
															{form.createdAt && (
																<div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
																	<CalendarDays className="w-3.5 h-3.5 shrink-0" />
																	<span>
																		{new Date(form.createdAt).toLocaleDateString(
																			"id-ID",
																			{
																				day: "numeric",
																				month: "long",
																				year: "numeric",
																			},
																		)}
																	</span>
																</div>
															)}
														</div>
													</div>
												</div>
											</motion.div>
										);
									})
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
								<SectionLoading message="Memuat data form..." />
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
														Daftar Formulir
													</h2>
												</div>
												<div className="flex items-center">
													<ScrollText className="w-4 h-4 mr-2" />
												</div>
											</div>
											<div className="p-0 sm:p-2">
												<DataTable
													columns={columns}
													data={filteredData}
													loading={loading}
													loadingMessage="Memuat data form..."
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
		</>
	);
};

export default ViewForm;
