/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ArrowLeft, CheckIcon, ChevronDownIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPositionsApi } from "@/features/positions/services/positionService";
import {
	getFormsApi,
	getFormByIdApi,
} from "@/features/form/services/formService";

import { createServiceApi } from "../services/servicesWo";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import axios from "axios";

type Status = {
	value: string;
	label: string;
};

const statuses: Status[] = [
	{
		value: "true",
		label: "Aktif",
	},
	{
		value: "false",
		label: "Non-Aktif",
	},
];

type RoleConfig = {
	fillableByRoles: string[];
	fillableByPositionIds: string[];
	viewableByRoles: string[];
	viewableByPositionIds: string[];
};

const CreateService = () => {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const [open, setOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

	const [positions, setPositions] = useState<Position[]>([]);

	const [forms, setForms] = useState<Form[]>([]);
	const [selectedForms, setSelectedForms] = useState<Form[]>([]);
	const [selectedStaff, setSelectedStaff] = useState<Staff[]>([]);

	const [availableRoles, setAvailableRoles] = useState<string[]>([]);

	const [formAccessConfig, setFormAccessConfig] = useState<
		Record<string, RoleConfig>
	>({});

	const [selectedReportForms, setSelectedReportForms] = useState<Form[]>([]);
	const [formAccessConfigReport, setFormAccessConfigReport] = useState<
		Record<string, RoleConfig>
	>({});

	// submit ni boisss
	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [accessType, setAccessType] = useState("public");

	// klik form laporan
	const toggleReportForm = async (form: Form) => {
		const alreadySelected = selectedReportForms.some((f) => f._id === form._id);
		if (alreadySelected) {
			setSelectedReportForms((prev) => prev.filter((f) => f._id !== form._id));
			return;
		}

		try {
			setLoading(true);
			const res = await getFormByIdApi(form._id);
			const detailedForm = res.data?.form;
			if (!detailedForm) return;
			setSelectedReportForms((prev) => [...prev, detailedForm]);
		} catch (err) {
			console.error("Gagal memuat form:", err);
			setError("Gagal memuat detail report form");
		} finally {
			setLoading(false);
		}
	};

	// toggle roles
	const toggleReportRoleFill = (formId: string, role: string) => {
		setFormAccessConfigReport((prev) => {
			const current = prev[formId] || {
				fillableByRoles: [],
				fillableByPositionIds: [],
				viewableByRoles: [],
				viewableByPositionIds: [],
			};
			const updated = {
				...current,
				fillableByRoles: current.fillableByRoles.includes(role)
					? current.fillableByRoles.filter((r) => r !== role)
					: [...current.fillableByRoles, role],
			};
			return { ...prev, [formId]: updated };
		});
	};

	const toggleReportRoleView = (formId: string, role: string) => {
		setFormAccessConfigReport((prev) => {
			const current = prev[formId] || {
				fillableByRoles: [],
				fillableByPositionIds: [],
				viewableByRoles: [],
				viewableByPositionIds: [],
			};
			const updated = {
				...current,
				viewableByRoles: current.viewableByRoles.includes(role)
					? current.viewableByRoles.filter((r) => r !== role)
					: [...current.viewableByRoles, role],
			};
			return { ...prev, [formId]: updated };
		});
	};

	// toggle posisi
	const toggleReportFillablePosition = (formId: string, posId: string) => {
		setFormAccessConfigReport((prev) => {
			const current = prev[formId]!;
			const updated = {
				...current,
				fillableByPositionIds: current.fillableByPositionIds.includes(posId)
					? current.fillableByPositionIds.filter((id) => id !== posId)
					: [...current.fillableByPositionIds, posId],
			};
			return { ...prev, [formId]: updated };
		});
	};

	const toggleReportViewablePosition = (formId: string, posId: string) => {
		setFormAccessConfigReport((prev) => {
			const current = prev[formId]!;
			const updated = {
				...current,
				viewableByPositionIds: current.viewableByPositionIds.includes(posId)
					? current.viewableByPositionIds.filter((id) => id !== posId)
					: [...current.viewableByPositionIds, posId],
			};
			return { ...prev, [formId]: updated };
		});
	};

	// fetch roles
	useEffect(() => {
		setAvailableRoles([
			"owner_company",
			"manager_company",
			"staff_company",
			"client",
		]);
	}, []);

	// fetch positions
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
	useEffect(() => {
		void fetchPositions();
	}, []);

	// fetch forms
	const fetchForms = async (): Promise<void> => {
		try {
			setLoading(true);
			const res = await getFormsApi();
			setForms(res.data?.forms || []);
		} catch {
			setError("Gagal memuat data form");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		void fetchForms();
	}, []);

	// klik posisi
	const toggleStaff = (pos: Position) => {
		setSelectedStaff((prev) => {
			const exists = prev.some((s) => s.positionId === pos._id);
			if (exists) return prev.filter((s) => s.positionId !== pos._id);
			return [
				...prev,
				{ positionId: pos._id, minimumStaff: 1, maximumStaff: 1 },
			];
		});
	};

	// klik form
	const toggleForm = async (form: Form) => {
		const alreadySelected = selectedForms.some((f) => f._id === form._id);
		if (alreadySelected) {
			setSelectedForms((prev) => prev.filter((f) => f._id !== form._id));
			return;
		}

		try {
			setLoading(true);
			const res = await getFormByIdApi(form._id);
			const detailedForm = res.data?.form;
			if (!detailedForm) {
				console.error("Form data tidak ditemukan");
				return;
			}
			setSelectedForms((prev) => [...prev, detailedForm]);
		} catch (err) {
			console.error("Gagal memuat form:", err);
			setError("Gagal memuat detail form");
		} finally {
			setLoading(false);
		}
	};

	const toggleRoleFill = (formId: string, role: string) => {
		setFormAccessConfig((prev) => {
			const current = prev[formId] || {
				fillableByRoles: [],
				fillableByPositionIds: [],
				viewableByRoles: [],
				viewableByPositionIds: [],
			};

			const updated = {
				...current,
				fillableByRoles: current.fillableByRoles.includes(role)
					? current.fillableByRoles.filter((r) => r !== role)
					: [...current.fillableByRoles, role],
			};

			return { ...prev, [formId]: updated };
		});
	};

	const toggleRoleView = (formId: string, role: string) => {
		setFormAccessConfig((prev) => {
			const current = prev[formId] || {
				fillableByRoles: [],
				fillableByPositionIds: [],
				viewableByRoles: [],
				viewableByPositionIds: [],
			};

			const updated = {
				...current,
				viewableByRoles: current.viewableByRoles.includes(role)
					? current.viewableByRoles.filter((r) => r !== role)
					: [...current.viewableByRoles, role],
			};

			return { ...prev, [formId]: updated };
		});
	};

	const toggleFillablePosition = (formId: string, posId: string) => {
		setFormAccessConfig((prev) => {
			const current = prev[formId]!;
			const updated = {
				...current,
				fillableByPositionIds: current.fillableByPositionIds.includes(posId)
					? current.fillableByPositionIds.filter((id) => id !== posId)
					: [...current.fillableByPositionIds, posId],
			};
			return { ...prev, [formId]: updated };
		});
	};

	const toggleViewablePosition = (formId: string, posId: string) => {
		setFormAccessConfig((prev) => {
			const current = prev[formId]!;
			const updated = {
				...current,
				viewableByPositionIds: current.viewableByPositionIds.includes(posId)
					? current.viewableByPositionIds.filter((id) => id !== posId)
					: [...current.viewableByPositionIds, posId],
			};
			return { ...prev, [formId]: updated };
		});
	};

	const createService = async () => {
		setLoading(true);
		setError(null);

		try {
			// === Validasi dasar ===
			if (!title.trim() || !description.trim()) {
				notifyError("Gagal menyimpan", "Judul dan deskripsi wajib diisi");
				return;
			}
			if (selectedStaff.length === 0) {
				notifyError("Gagal menyimpan", "Pilih minimal satu staff");
				return;
			}

			// ===== Bentuk payload dengan struktur sesuai d.ts terbaru =====
			const payload: CreateServiceRequest = {
				title,
				description,
				isActive: selectedStatus?.value === "active",
				accessType,

				// === REQUIRED STAFF ===
				requiredStaff: selectedStaff.map((s) => ({
					positionId: s.positionId,
					minimumStaff: s.minimumStaff,
					maximumStaff: s.maximumStaff,
				})),

				// === WORK ORDER FORMS ===
				workOrderForms: selectedForms.map((form, i) => {
					const cfg = formAccessConfig[form._id] || {
						fillableByRoles: [],
						viewableByRoles: [],
						fillableByPositionIds: [],
						viewableByPositionIds: [],
					};

					return {
						order: i + 1,
						formId: form._id, // kirim ID form saja
						fillableByRoles: cfg.fillableByRoles,
						viewableByRoles: cfg.viewableByRoles,
						fillableByPositionIds: cfg.fillableByPositionIds,
						viewableByPositionIds: cfg.viewableByPositionIds,
					};
				}),

				// === REPORT FORMS ===
				reportForms: selectedReportForms.map((form, i) => {
					const cfg = formAccessConfigReport[form._id] || {
						fillableByRoles: [],
						viewableByRoles: [],
						fillableByPositionIds: [],
						viewableByPositionIds: [],
					};

					return {
						order: i + 1,
						formId: form._id,
						fillableByRoles: cfg.fillableByRoles,
						viewableByRoles: cfg.viewableByRoles,
						fillableByPositionIds: cfg.fillableByPositionIds,
						viewableByPositionIds: cfg.viewableByPositionIds,
					};
				}),
			};

			// === Log payload sebelum dikirim ===
			console.log("🧩 Payload dikirim:", JSON.stringify(payload, null, 2));

			// === Kirim request ===
			const res = await createServiceApi(payload);

			console.log("✅ Response dari server:", res.data);

			notifySuccess("Berhasil", "Layanan berhasil dibuat");
			navigate("/dashboard/owner/services");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const backendMessage =
					error.response?.data?.error ||
					error.response?.data?.message ||
					"Terjadi kesalahan tak terduga";

				console.error("❌ Response error:", error.response?.data);
				setError(backendMessage);
				notifyError("Gagal membuat layanan", backendMessage);
			} else {
				console.error(error);
				setError("Terjadi kesalahan internal");
				notifyError("Gagal membuat layanan", "Terjadi kesalahan internal");
			}
		} finally {
			setLoading(false);
		}
	};

	// error handling
	if (error) {
		return (
			<div className="container py-8 px-10">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<>
			{/* Header */}
			<div className="flex items-center justify-between mb-9">
				<div className="flex flex-col space-y-2">
					<h1 className="text-xl font-bold tracking-tight">
						Tambah Layanan Work Order
					</h1>
					<p className="text-muted-foreground">
						Berikut merupakan form tambah Layanan work order perusahaan.
					</p>
				</div>
				<Button
					onClick={() => navigate(-1)}
					className="bg-primary hover:bg-primary/90">
					<ArrowLeft className="h-4 w-4" />
					Kembali
				</Button>
			</div>

			{/* card pertama */}
			<Card className="p-4 border shadow-md rounded-2xl ">
				<CardHeader className="pt-5 px-6">
					<div className="flex items-center justify-between">
						<p className="text-muted-foreground">
							Isi form di bawah untuk menambahkan layanan work order baru.
						</p>
					</div>
				</CardHeader>
				<CardContent className="pb-5 space-y-5">
					{/* Judul Service */}
					<div className="space-y-2">
						<Label className="text-sm font-medium">Judul Layanan</Label>
						<Input
							placeholder="Contoh: Cleaning Service"
							value={title}
							onChange={(e) => setTitle(e.target.value)}></Input>
					</div>
					{/* Deskripsi */}
					<div className="space-y-2">
						<Label className="text-sm font-medium">Deskripsi Layanan</Label>
						<Input
							placeholder="Contoh: Menjelaskan terkait layanan apa ini"
							value={description}
							onChange={(e) => setDescription(e.target.value)}></Input>
					</div>

					<div className="grid grid-cols-3 my-8">
						{/* set status */}
						<div className="flex items-center space-x-4">
							<p className="font-medium text-sm">Status</p>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="w-[150px] justify-start text-muted-foreground font-normal">
										{selectedStatus ? (
											<>{selectedStatus.label}</>
										) : (
											<>+ Set status</>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="p-0" side="right" align="start">
									<Command>
										<CommandList>
											<CommandEmpty>No results found.</CommandEmpty>
											<CommandGroup>
												{statuses.map((status) => (
													<CommandItem
														key={status.value}
														value={status.value}
														onSelect={(value) => {
															setSelectedStatus(
																statuses.find(
																	(priority) => priority.value === value
																) || null
															);
															setOpen(false);
														}}>
														{status.label}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</div>

						{/* Access form */}
						<div className="flex items-center gap-3">
							<label className="text-sm font-medium whitespace-nowrap">
								Akses Form
							</label>

							<Select value={accessType} onValueChange={setAccessType}>
								<SelectTrigger className="w-[200px]">
									<SelectValue placeholder="Pilih Akses" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="public">Public</SelectItem>
									<SelectItem value="internal">Internal</SelectItem>
									<SelectItem value="member_only">
										Langganan Terdaftar
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* grid column */}
					<div className="grid grid-cols-4 gap-2 items-start items">
						{/* Select staff */}
						<div className="space-y-2 col-span-3">
							<div className="flex flex-wrap items-start justify-between gap-2 border rounded-md px-3 py-2 mt-1.5 focus-within:ring-2 focus-within:ring-ring transition-all">
								{/* Badges section */}
								<div className="flex flex-col gap-2 flex-1">
									{selectedStaff.length > 0 ? (
										selectedStaff.map((s) => {
											const pos = positions.find((p) => p._id === s.positionId);
											return (
												<div
													key={s.positionId}
													className="flex items-center justify-between gap-1 border-b pb-2 last:border-none">
													<div
														className="
																inline-flex items-center gap-1 px-2 py-1
																text-sm rounded-md border border-primary text-primary
																transition-colors w-fit
															">
														<span>{pos?.name || "Tidak diketahui"}</span>
													</div>

													{/* Input min & max */}
													<div className="flex items-center gap-2 mt-2">
														<div className="flex items-center gap-1">
															<Label className="text-xs">Min</Label>
															<Input
																type="number"
																className="w-16 h-7 text-xs"
																value={s.minimumStaff}
																onChange={(e) => {
																	const val = Number(e.target.value);
																	setSelectedStaff((prev) =>
																		prev.map((st) =>
																			st.positionId === s.positionId
																				? { ...st, minimumStaff: val }
																				: st
																		)
																	);
																}}
															/>
														</div>
														<div className="flex items-center gap-1">
															<Label className="text-xs">Max</Label>
															<Input
																type="number"
																className="w-16 h-7 text-xs"
																value={s.maximumStaff}
																onChange={(e) => {
																	const val = Number(e.target.value);
																	setSelectedStaff((prev) =>
																		prev.map((st) =>
																			st.positionId === s.positionId
																				? { ...st, maximumStaff: val }
																				: st
																		)
																	);
																}}
															/>
														</div>
														<Trash
															onClick={(e) => {
																e.stopPropagation();
																setSelectedStaff((prev) =>
																	prev.filter(
																		(st) => st.positionId !== s.positionId
																	)
																);
															}}
															className="size-4 mx-4 cursor-pointer hover:text-destructive transition-colors"
														/>
													</div>
												</div>
											);
										})
									) : (
										<span className="text-sm text-muted-foreground">
											Pilih beberapa pegawai yang dibutuhkan
										</span>
									)}
								</div>
							</div>
						</div>

						{/* Dropdown pilih posisi */}
						<div className="space-y-2">
							<DropdownMenu onOpenChange={(open) => open && fetchPositions()}>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="w-full shrink-0 mt-2 flex items-center gap-1 text-sm">
										Pilih Pegawai
										<ChevronDownIcon className="w-3 h-3" />
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent
									align="end"
									className="h-[300px] overflow-y-auto w-[250px]">
									{loading ? (
										<DropdownMenuItem disabled>Loading...</DropdownMenuItem>
									) : error ? (
										<DropdownMenuItem disabled>{error}</DropdownMenuItem>
									) : positions.length > 0 ? (
										positions.map((p) => {
											const isSelected = selectedStaff.some(
												(s) => s.positionId === p._id
											);
											return (
												<DropdownMenuItem
													key={p._id}
													onClick={(e) => {
														e.preventDefault();
														toggleStaff(p);
													}}
													className="flex justify-between">
													<span>{p.name}</span>
													{isSelected && (
														<CheckIcon className="w-4 h-4 text-primary" />
													)}
												</DropdownMenuItem>
											);
										})
									) : (
										<DropdownMenuItem disabled>
											Tidak ada posisi tersedia
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* card kedua */}
			<Card className="p-4 border shadow-md rounded-2xl mt-8">
				<CardHeader className="pt-5 px-6">
					<div className="flex items-center justify-between">
						<p className="text-muted-foreground">
							Pilih jenis form yang akan digunakan pada layanan work order ini.
						</p>
					</div>
				</CardHeader>
				<CardContent className="pb-5 space-y-5">
					{/* pilih forms */}
					<div className="grid grid-cols-2 gap-2">
						{forms.map((form) => (
							<Label
								key={form._id}
								onClick={() => toggleForm(form)}
								className="
									hover:bg-accent/50
									cursor-pointer
									flex items-start gap-3
									rounded-lg border p-3
									transition-colors
									has-[[aria-checked=true]]:border-primary
									has-[[aria-checked=true]]:bg-primary/5
								">
								<Checkbox
									checked={selectedForms.some((f) => f._id === form._id)}
									className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
								/>
								<div className="grid gap-1.5 font-normal">
									<p className="text-sm leading-none font-medium">
										{form.title}
									</p>
									<p className="text-muted-foreground text-sm line-clamp-3">
										{form.description}
									</p>
								</div>
							</Label>
						))}
					</div>
					{/* form pick views */}
					<div className="border bg-muted rounded-md p-6 space-y-6">
						{selectedForms.length === 0 ? (
							<p className="text-muted-foreground text-sm text-center">
								Pilih form untuk melihat pratinjau di sini
							</p>
						) : (
							selectedForms.map((form) => {
								// Ambil konfigurasi per form dari state global
								const config = formAccessConfig[form._id] || {
									fillableByRoles: [],
									fillableByPositionIds: [],
									viewableByRoles: [],
									viewableByPositionIds: [],
								};

								return (
									<Card
										key={form._id}
										className="border rounded-xl shadow-sm p-5">
										{/* Header form */}
										<div>
											<h3 className="font-semibold text-lg">{form.title}</h3>
											<p className="text-sm text-muted-foreground">
												{form.description}
											</p>
											<p className="text-sm mt-1 text-primary font-medium">
												Tipe: {form.formType}
											</p>
										</div>

										{/* input tambahan untuk roles dan positions */}
										<div className="grid grid-cols-2 gap-6 items-start">
											{/* === KOLOM KIRI: FILLABLE === */}
											<div className="space-y-4">
												<div className="space-y-1">
													<Label className="text-sm font-medium">
														Dapat diisi Oleh
													</Label>
													<Popover>
														<PopoverTrigger asChild>
															<Button
																variant="outline"
																className="w-full justify-between">
																{config.fillableByRoles.length > 0
																	? config.fillableByRoles.join(", ")
																	: "Pilih roles..."}
																<ChevronDownIcon className="h-4 w-4 opacity-50" />
															</Button>
														</PopoverTrigger>
														<PopoverContent className="w-[250px] p-2 space-y-2">
															{availableRoles.map((role) => (
																<div
																	key={role}
																	className="flex items-center space-x-2 cursor-pointer"
																	onClick={() =>
																		toggleRoleFill(form._id, role)
																	}>
																	<Checkbox
																		checked={config.fillableByRoles.includes(
																			role
																		)}
																	/>
																	<span>{role}</span>
																</div>
															))}
														</PopoverContent>
													</Popover>
												</div>

												{/* Pilihan staff kalau role = staff */}
												{config.fillableByRoles.includes("staff_company") && (
													<div className="flex flex-wrap items-center justify-between gap-2 border rounded-md px-3 py-2 mt-1.5">
														<div className="flex flex-col flex-1 min-w-0">
															{config.fillableByPositionIds.length === 0 ? (
																<p className="text-sm text-muted-foreground italic">
																	Pilih beberapa staff
																</p>
															) : (
																<div className="flex flex-wrap gap-2">
																	{config.fillableByPositionIds.map((id) => {
																		// 🔍 Cari posisi dari daftar positions (bukan dari selectedStaff)
																		const pos = positions.find(
																			(p) => p._id === id
																		);
																		return (
																			<div
																				key={id}
																				className="flex items-center gap-1 px-2 py-1 text-sm rounded-md border border-primary text-primary bg-primary/10">
																				<span>
																					{pos?.name || "Tidak diketahui"}
																				</span>
																				<button
																					type="button"
																					onClick={() =>
																						toggleFillablePosition(form._id, id)
																					}
																					className="text-xs text-primary/70 hover:text-primary">
																					×
																				</button>
																			</div>
																		);
																	})}
																</div>
															)}
														</div>

														<div className="flex-shrink-0 w-[150px]">
															<DropdownMenu>
																<DropdownMenuTrigger asChild>
																	<Button
																		variant="outline"
																		size="sm"
																		className="w-full mt-1 flex items-center justify-between gap-1 text-sm">
																		Pilih Pegawai
																		<ChevronDownIcon className="w-3 h-3" />
																	</Button>
																</DropdownMenuTrigger>
																<DropdownMenuContent
																	align="end"
																	className="h-[150px] overflow-y-auto w-[250px]">
																	{selectedStaff.map((s) => {
																		const id = String(s.positionId);
																		const pos = positions.find(
																			(p) => p._id === id
																		);
																		const isSelected =
																			config.fillableByPositionIds.includes(id);

																		return (
																			<DropdownMenuItem
																				key={id}
																				onClick={(e) => {
																					e.preventDefault();
																					toggleFillablePosition(form._id, id);
																				}}
																				className="flex justify-between">
																				<span>
																					{pos?.name || "Tidak diketahui"}
																				</span>
																				{isSelected && (
																					<CheckIcon className="w-4 h-4 text-primary" />
																				)}
																			</DropdownMenuItem>
																		);
																	})}
																</DropdownMenuContent>
															</DropdownMenu>
														</div>
													</div>
												)}
											</div>

											{/* === KOLOM KANAN: VIEWABLE === */}
											<div className="space-y-4">
												<div className="space-y-1">
													<Label className="text-sm font-medium">
														Dapat dilihat Oleh
													</Label>
													<Popover>
														<PopoverTrigger asChild>
															<Button
																variant="outline"
																className="w-full justify-between">
																{config.viewableByRoles.length > 0
																	? config.viewableByRoles.join(", ")
																	: "Pilih roles..."}
																<ChevronDownIcon className="h-4 w-4 opacity-50" />
															</Button>
														</PopoverTrigger>
														<PopoverContent className="w-[250px] p-2 space-y-2">
															{availableRoles.map((role) => (
																<div
																	key={role}
																	className="flex items-center space-x-2 cursor-pointer"
																	onClick={() =>
																		toggleRoleView(form._id, role)
																	}>
																	<Checkbox
																		checked={config.viewableByRoles.includes(
																			role
																		)}
																	/>
																	<span>{role}</span>
																</div>
															))}
														</PopoverContent>
													</Popover>
												</div>

												{config.viewableByRoles.includes("staff_company") && (
													<div className="flex flex-wrap items-center justify-between gap-2 border rounded-md px-3 py-2 mt-1.5">
														<div className="flex flex-col items-baseline flex-1 min-w-0">
															{config.viewableByPositionIds.length === 0 ? (
																<p className="text-sm text-muted-foreground italic">
																	Pilih beberapa staff
																</p>
															) : (
																<div className="flex flex-wrap gap-2">
																	{config.viewableByPositionIds.map((id) => {
																		// 🔍 Ambil data posisi dari daftar positions (bukan dari selectedStaff)
																		const pos = positions.find(
																			(p) => p._id === id
																		);
																		return (
																			<div
																				key={id}
																				className="flex items-center gap-1 px-2 py-1 text-sm rounded-md border border-primary text-primary bg-primary/10">
																				<span>
																					{pos?.name || "Tidak diketahui"}
																				</span>
																				<button
																					type="button"
																					onClick={() =>
																						toggleViewablePosition(form._id, id)
																					}
																					className="text-xs text-primary/70 hover:text-primary">
																					×
																				</button>
																			</div>
																		);
																	})}
																</div>
															)}
														</div>

														<div className="flex-shrink-0 w-[150px]">
															<DropdownMenu>
																<DropdownMenuTrigger asChild>
																	<Button
																		variant="outline"
																		size="sm"
																		className="w-full mt-1 flex items-center justify-between gap-1 text-sm">
																		Pilih Pegawai
																		<ChevronDownIcon className="w-3 h-3" />
																	</Button>
																</DropdownMenuTrigger>
																<DropdownMenuContent
																	align="end"
																	className="h-[150px] overflow-y-auto w-[250px]">
																	{selectedStaff.map((s) => {
																		const id = String(s.positionId);
																		const pos = positions.find(
																			(p) => p._id === id
																		);
																		const isSelected =
																			config.viewableByPositionIds.includes(id);

																		return (
																			<DropdownMenuItem
																				key={id}
																				onClick={(e) => {
																					e.preventDefault();
																					toggleViewablePosition(form._id, id);
																				}}
																				className="flex justify-between">
																				<span>
																					{pos?.name || "Tidak diketahui"}
																				</span>
																				{isSelected && (
																					<CheckIcon className="w-4 h-4 text-primary" />
																				)}
																			</DropdownMenuItem>
																		);
																	})}
																</DropdownMenuContent>
															</DropdownMenu>
														</div>
													</div>
												)}
											</div>
										</div>

										{/* render fields (VIEW ONLY) */}
										<h3 className="leading-none font-medium mt-8">
											Pertanyaan Form
										</h3>
										<div className="border rounded-md p-6 space-y-4">
											{form.fields?.map((field, i) => (
												<div key={i} className="space-y-1">
													<Label className="text-sm font-medium">
														{field.label}
													</Label>

													{/* tampilkan sesuai type */}
													{field.type === "text" && (
														<p className="text-sm text-muted-foreground border rounded-md p-2 bg-muted/40">
															{field.placeholder || "Isian teks"}
														</p>
													)}

													{field.type === "email" && (
														<p className="text-sm text-muted-foreground border rounded-md p-2 bg-muted/40">
															{field.placeholder || "Alamat email"}
														</p>
													)}

													{field.type === "number" && (
														<p className="text-sm text-muted-foreground border rounded-md p-2 bg-muted/40">
															{field.placeholder || "Isian angka"}
														</p>
													)}

													{field.type === "textarea" && (
														<div className="border rounded-md p-2 bg-muted/40 text-sm text-muted-foreground min-h-[80px]">
															{field.placeholder || "Area teks"}
														</div>
													)}

													{field.type === "single_select" && (
														<div className="border rounded-md p-2 bg-muted/40 text-sm text-muted-foreground">
															<p className="mb-1 italic">Pilihan (radio):</p>
															<ul className="list-disc list-inside space-y-1">
																{field.options?.map((opt, j) => (
																	<li
																		key={j}
																		className="flex items-center space-x-2">
																		<input
																			type="radio"
																			name={`field-${i}`}
																			disabled
																		/>
																		<span>{opt.value}</span>
																	</li>
																))}
															</ul>
														</div>
													)}

													{field.type === "multi_select" && (
														<div className="border rounded-md p-2 bg-muted/40 text-sm text-muted-foreground">
															<p className="mb-1 italic">Pilihan (checkbox):</p>
															<ul className="list-disc list-inside space-y-1">
																{field.options?.map((opt, j) => (
																	<li
																		key={j}
																		className="flex items-center space-x-2">
																		<input type="checkbox" disabled />
																		<span>{opt.value}</span>
																	</li>
																))}
															</ul>
														</div>
													)}

													{field.type === "date" && (
														<p className="text-sm text-muted-foreground border rounded-md p-2 bg-muted/40">
															Tanggal (date picker)
														</p>
													)}

													{field.type === "file" && (
														<p className="text-sm text-muted-foreground border rounded-md p-2 bg-muted/40">
															Upload file
														</p>
													)}
												</div>
											))}
										</div>
									</Card>
								);
							})
						)}
					</div>
				</CardContent>
			</Card>

			{/* card ketiga */}
			{/* === CARD REPORT FORMS === */}
			<Card className="p-4 border shadow-md rounded-2xl mt-8">
				<CardHeader className="pt-5 px-6">
					<div className="flex items-center justify-between">
						<p className="text-muted-foreground">
							Pilih form laporan (report form) yang akan digunakan setelah
							layanan work order selesai.
						</p>
					</div>
				</CardHeader>
				<CardContent className="pb-5 space-y-5">
					{/* pilih forms */}
					<div className="grid grid-cols-2 gap-2">
						{forms.map((form) => (
							<Label
								key={form._id}
								onClick={() => toggleReportForm(form)}
								className="
						hover:bg-accent/50
						cursor-pointer
						flex items-start gap-3
						rounded-lg border p-3
						transition-colors
						has-[[aria-checked=true]]:border-primary
						has-[[aria-checked=true]]:bg-primary/5
					">
								<Checkbox
									checked={selectedReportForms.some((f) => f._id === form._id)}
									className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
								/>
								<div className="grid gap-1.5 font-normal">
									<p className="text-sm leading-none font-medium">
										{form.title}
									</p>
									<p className="text-muted-foreground text-sm line-clamp-3">
										{form.description}
									</p>
								</div>
							</Label>
						))}
					</div>

					{/* form pick views */}
					<div className="border bg-muted rounded-md p-6 space-y-6">
						{selectedReportForms.length === 0 ? (
							<p className="text-muted-foreground text-sm text-center">
								Pilih form untuk melihat pratinjau di sini
							</p>
						) : (
							selectedReportForms.map((form) => {
								const config = formAccessConfigReport[form._id] || {
									fillableByRoles: [],
									fillableByPositionIds: [],
									viewableByRoles: [],
									viewableByPositionIds: [],
								};

								return (
									<Card
										key={form._id}
										className="border rounded-xl shadow-sm p-5">
										<div>
											<h3 className="font-semibold text-lg">{form.title}</h3>
											<p className="text-sm text-muted-foreground">
												{form.description}
											</p>
											<p className="text-sm mt-1 text-primary font-medium">
												Tipe: {form.formType}
											</p>
										</div>

										{/* akses role & posisi */}
										<div className="grid grid-cols-2 gap-6 items-start">
											{/* === KIRI: FILLABLE === */}
											<div className="space-y-4">
												<div className="space-y-1">
													<Label className="text-sm font-medium">
														Dapat diisi Oleh
													</Label>
													<Popover>
														<PopoverTrigger asChild>
															<Button
																variant="outline"
																className="w-full justify-between">
																{config.fillableByRoles.length > 0
																	? config.fillableByRoles.join(", ")
																	: "Pilih roles..."}
																<ChevronDownIcon className="h-4 w-4 opacity-50" />
															</Button>
														</PopoverTrigger>
														<PopoverContent className="w-[250px] p-2 space-y-2">
															{availableRoles.map((role) => (
																<div
																	key={role}
																	className="flex items-center space-x-2 cursor-pointer"
																	onClick={() =>
																		toggleReportRoleFill(form._id, role)
																	}>
																	<Checkbox
																		checked={config.fillableByRoles.includes(
																			role
																		)}
																	/>
																	<span>{role}</span>
																</div>
															))}
														</PopoverContent>
													</Popover>
												</div>

												{config.fillableByRoles.includes("staff_company") && (
													<div className="flex flex-wrap items-center justify-between gap-2 border rounded-md px-3 py-2 mt-1.5">
														<div className="flex flex-col flex-1 min-w-0">
															{config.fillableByPositionIds.length === 0 ? (
																<p className="text-sm text-muted-foreground italic">
																	Pilih beberapa staff
																</p>
															) : (
																<div className="flex flex-wrap gap-2">
																	{config.fillableByPositionIds.map((id) => {
																		// 🔍 Cari posisi dari daftar positions (bukan dari selectedStaff)
																		const pos = positions.find(
																			(p) => p._id === id
																		);
																		return (
																			<div
																				key={id}
																				className="flex items-center gap-1 px-2 py-1 text-sm rounded-md border border-primary text-primary bg-primary/10">
																				<span>
																					{pos?.name || "Tidak diketahui"}
																				</span>
																				<button
																					type="button"
																					onClick={() =>
																						toggleReportFillablePosition(
																							form._id,
																							id
																						)
																					}
																					className="text-xs text-primary/70 hover:text-primary">
																					×
																				</button>
																			</div>
																		);
																	})}
																</div>
															)}
														</div>

														<div className="flex-shrink-0 w-[150px]">
															<DropdownMenu>
																<DropdownMenuTrigger asChild>
																	<Button
																		variant="outline"
																		size="sm"
																		className="w-full mt-1 flex items-center justify-between gap-1 text-sm">
																		Pilih Pegawai
																		<ChevronDownIcon className="w-3 h-3" />
																	</Button>
																</DropdownMenuTrigger>

																<DropdownMenuContent
																	align="end"
																	className="h-[150px] overflow-y-auto w-[250px]">
																	{selectedStaff.map((s) => {
																		const id = String(s.positionId);
																		const pos = positions.find(
																			(p) => p._id === id
																		);
																		const isSelected =
																			config.fillableByPositionIds.includes(id);

																		return (
																			<DropdownMenuItem
																				key={id}
																				onClick={(e) => {
																					e.preventDefault();
																					toggleReportFillablePosition(
																						form._id,
																						id
																					);
																				}}
																				className="flex justify-between">
																				<span>
																					{pos?.name || "Tidak diketahui"}
																				</span>
																				{isSelected && (
																					<CheckIcon className="w-4 h-4 text-primary" />
																				)}
																			</DropdownMenuItem>
																		);
																	})}
																</DropdownMenuContent>
															</DropdownMenu>
														</div>
													</div>
												)}
											</div>

											{/* === KANAN: VIEWABLE === */}
											<div className="space-y-4">
												<div className="space-y-1">
													<Label className="text-sm font-medium">
														Dapat dilihat Oleh
													</Label>
													<Popover>
														<PopoverTrigger asChild>
															<Button
																variant="outline"
																className="w-full justify-between">
																{config.viewableByRoles.length > 0
																	? config.viewableByRoles.join(", ")
																	: "Pilih roles..."}
																<ChevronDownIcon className="h-4 w-4 opacity-50" />
															</Button>
														</PopoverTrigger>
														<PopoverContent className="w-[250px] p-2 space-y-2">
															{availableRoles.map((role) => (
																<div
																	key={role}
																	className="flex items-center space-x-2 cursor-pointer"
																	onClick={() =>
																		toggleReportRoleView(form._id, role)
																	}>
																	<Checkbox
																		checked={config.viewableByRoles.includes(
																			role
																		)}
																	/>
																	<span>{role}</span>
																</div>
															))}
														</PopoverContent>
													</Popover>
												</div>

												{config.viewableByRoles.includes("staff_company") && (
													<div className="flex flex-wrap items-center justify-between gap-2 border rounded-md px-3 py-2 mt-1.5">
														<div className="flex flex-col flex-1 min-w-0">
															{config.viewableByPositionIds.length === 0 ? (
																<p className="text-sm text-muted-foreground italic">
																	Pilih beberapa staff
																</p>
															) : (
																<div className="flex flex-wrap gap-2">
																	{config.viewableByPositionIds.map((id) => {
																		// 🔍 Ambil data posisi berdasarkan ID
																		const pos = positions.find(
																			(p) => p._id === id
																		);
																		return (
																			<div
																				key={id}
																				className="flex items-center gap-1 px-2 py-1 text-sm rounded-md border border-primary text-primary bg-primary/10">
																				<span>
																					{pos?.name || "Tidak diketahui"}
																				</span>
																				<button
																					type="button"
																					onClick={() =>
																						toggleReportViewablePosition(
																							form._id,
																							id
																						)
																					}
																					className="text-xs text-primary/70 hover:text-primary">
																					×
																				</button>
																			</div>
																		);
																	})}
																</div>
															)}
														</div>

														<div className="flex-shrink-0 w-[150px]">
															<DropdownMenu>
																<DropdownMenuTrigger asChild>
																	<Button
																		variant="outline"
																		size="sm"
																		className="w-full mt-1 flex items-center justify-between gap-1 text-sm">
																		Pilih Pegawai
																		<ChevronDownIcon className="w-3 h-3" />
																	</Button>
																</DropdownMenuTrigger>

																<DropdownMenuContent
																	align="end"
																	className="h-[150px] overflow-y-auto w-[250px]">
																	{selectedStaff.map((s) => {
																		const id = String(s.positionId);
																		const pos = positions.find(
																			(p) => p._id === id
																		);
																		const isSelected =
																			config.viewableByPositionIds.includes(id);

																		return (
																			<DropdownMenuItem
																				key={id}
																				onClick={(e) => {
																					e.preventDefault();
																					toggleReportViewablePosition(
																						form._id,
																						id
																					);
																				}}
																				className="flex justify-between">
																				<span>
																					{pos?.name || "Tidak diketahui"}
																				</span>
																				{isSelected && (
																					<CheckIcon className="w-4 h-4 text-primary" />
																				)}
																			</DropdownMenuItem>
																		);
																	})}
																</DropdownMenuContent>
															</DropdownMenu>
														</div>
													</div>
												)}
											</div>
										</div>

										{/* render fields (VIEW ONLY) */}
										<h3 className="leading-none font-medium mt-8">
											Pertanyaan Form
										</h3>
										<div className="border rounded-md p-6 space-y-4">
											{form.fields?.map((field, i) => (
												<div key={i} className="space-y-1">
													<Label className="text-sm font-medium">
														{field.label}
													</Label>

													{/* tampilkan sesuai type */}
													{field.type === "text" && (
														<p className="text-sm text-muted-foreground border rounded-md p-2 bg-muted/40">
															{field.placeholder || "Isian teks"}
														</p>
													)}

													{field.type === "email" && (
														<p className="text-sm text-muted-foreground border rounded-md p-2 bg-muted/40">
															{field.placeholder || "Alamat email"}
														</p>
													)}

													{field.type === "number" && (
														<p className="text-sm text-muted-foreground border rounded-md p-2 bg-muted/40">
															{field.placeholder || "Isian angka"}
														</p>
													)}

													{field.type === "textarea" && (
														<div className="border rounded-md p-2 bg-muted/40 text-sm text-muted-foreground min-h-[80px]">
															{field.placeholder || "Area teks"}
														</div>
													)}

													{field.type === "single_select" && (
														<div className="border rounded-md p-2 bg-muted/40 text-sm text-muted-foreground">
															<p className="mb-1 italic">Pilihan (radio):</p>
															<ul className="list-disc list-inside space-y-1">
																{field.options?.map((opt, j) => (
																	<li
																		key={j}
																		className="flex items-center space-x-2">
																		<input
																			type="radio"
																			name={`field-${i}`}
																			disabled
																		/>
																		<span>{opt.value}</span>
																	</li>
																))}
															</ul>
														</div>
													)}

													{field.type === "multi_select" && (
														<div className="border rounded-md p-2 bg-muted/40 text-sm text-muted-foreground">
															<p className="mb-1 italic">Pilihan (checkbox):</p>
															<ul className="list-disc list-inside space-y-1">
																{field.options?.map((opt, j) => (
																	<li
																		key={j}
																		className="flex items-center space-x-2">
																		<input type="checkbox" disabled />
																		<span>{opt.value}</span>
																	</li>
																))}
															</ul>
														</div>
													)}

													{field.type === "date" && (
														<p className="text-sm text-muted-foreground border rounded-md p-2 bg-muted/40">
															Tanggal (date picker)
														</p>
													)}

													{field.type === "file" && (
														<p className="text-sm text-muted-foreground border rounded-md p-2 bg-muted/40">
															Upload file
														</p>
													)}
												</div>
											))}
										</div>
									</Card>
								);
							})
						)}
					</div>
				</CardContent>
			</Card>
			<div className="flex justify-end mt-8">
				<Button
					onClick={createService}
					disabled={loading}
					className="bg-primary hover:bg-primary/90">
					{loading ? "Menyimpan..." : "Simpan Layanan"}
				</Button>
			</div>
		</>
	);
};

export default CreateService;
