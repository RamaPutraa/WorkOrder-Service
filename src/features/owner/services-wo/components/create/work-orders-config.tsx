import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useProfileStore } from "@/store/profileStore";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { type WorkOrderConfigItem } from "../../hooks/useCreateService";
import { EmptyData } from "@/shared/molecules/empty-data";
import {
	Plus,
	Trash2,
	Hammer,
	Loader2,
	Search,
	ScrollText,
	ChevronsUpDown,
	Check,
} from "lucide-react";

const WorkOrderRowCard = ({
	item,
	index,
	forms,
	positions,
	removeWorkOrderConfig,
	updateWorkOrderConfig,
	draftingWorkOrderType,
}: {
	item: WorkOrderConfigItem;
	index: number;
	forms: Form[];
	positions: Position[];
	removeWorkOrderConfig: (index: number) => void;
	updateWorkOrderConfig: (
		index: number,
		field: keyof WorkOrderConfigItem,
		value: string | number | boolean,
	) => void;
	draftingWorkOrderType: draftingWorkOrderType;
}) => {
	const [woFormSearch, setWoFormSearch] = useState("");
	const [wrFormSearch, setWrFormSearch] = useState("");
	const [woTypeFilter] = useState("work_order");
	const [wrTypeFilter] = useState("report");
	const [posOpen, setPosOpen] = useState(false);

	const { profile } = useProfileStore();
	const isManager = profile?.role === "manager_company";
	const managerPositionId = profile?.position?._id || "";

	React.useEffect(() => {
		if (
			isManager &&
			managerPositionId &&
			item.positionId !== managerPositionId
		) {
			updateWorkOrderConfig(index, "positionId", managerPositionId);
		}
	}, [
		isManager,
		managerPositionId,
		item.positionId,
		index,
		updateWorkOrderConfig,
	]);

	const filteredWoForms = forms.filter((f) => {
		const matchesSearch = f.title
			.toLowerCase()
			.includes(woFormSearch.toLowerCase());
		const matchesType = woTypeFilter === "all" || f.formType === woTypeFilter;
		const matchesPosition =
			!isManager || !managerPositionId || f.position?._id === managerPositionId;
		return matchesSearch && matchesType && matchesPosition;
	});

	const filteredWrForms = forms.filter((f) => {
		const matchesSearch = f.title
			.toLowerCase()
			.includes(wrFormSearch.toLowerCase());
		const matchesType = wrTypeFilter === "all" || f.formType === wrTypeFilter;
		const matchesPosition =
			!isManager || !managerPositionId || f.position?._id === managerPositionId;
		return matchesSearch && matchesType && matchesPosition;
	});

	return (
		<div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md">
			{/* Header row */}
			<div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs font-bold">
						{index + 1}
					</div>
					<span className="text-sm font-semibold text-slate-800">
						Tahap Work Order
					</span>
				</div>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
					onClick={() => removeWorkOrderConfig(index)}>
					<Trash2 className="w-4 h-4" />
				</Button>
			</div>

			<div className="p-5 space-y-6">
				{/* Row 1: Position & Capacity */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div className="space-y-2">
						<Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
							Posisi Bertugas <span className="text-red-500">*</span>
						</Label>
						<Popover
							open={posOpen}
							onOpenChange={
								isManager && !!managerPositionId ? undefined : setPosOpen
							}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={posOpen}
									disabled={isManager && !!managerPositionId}
									className="w-full h-10 justify-between bg-white font-normal hover:bg-white text-slate-700 border-slate-200">
									<span className="truncate">
										{item.positionId ?
											(positions.find((p) => p._id === item.positionId)?.name ??
												"Pilih posisi…")
											: "Pilih posisi…"}
									</span>
									<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[--radix-popover-trigger-width] p-0">
								<Command>
									<CommandInput
										placeholder="Cari posisi berdasarkan nama..."
										className="h-9"
									/>
									<CommandList>
										<CommandEmpty className="py-3 text-center text-sm text-slate-500">
											Posisi tidak ditemukan.
										</CommandEmpty>
										<CommandGroup>
											{positions.map((p) => (
												<CommandItem
													key={p._id}
													value={p.name}
													onSelect={() => {
														updateWorkOrderConfig(index, "positionId", p._id);
														setPosOpen(false);
													}}>
													<Check
														className={cn(
															"mr-2 h-4 w-4",
															item.positionId === p._id ?
																"opacity-100"
																: "opacity-0",
														)}
													/>
													{p.name}
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
						{isManager && managerPositionId ?
							<p className="text-[11px] italic text-slate-400 mt-1">
								Manager departemen hanya dapat membuat konfigurasi perintah
								kerja untuk departemennya sendiri
							</p>
							: null}
					</div>

					<div className="space-y-2">
						<Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
							Alokasi Staf <span className="text-red-500">*</span>
						</Label>
						<div className="flex items-center gap-3">
							<div className="relative flex-1">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
									Min
								</span>
								<Input
									type="number"
									min={1}
									className="h-10 pl-10 bg-white"
									value={item.minStaff}
									onChange={(e) =>
										updateWorkOrderConfig(
											index,
											"minStaff",
											Number(e.target.value),
										)
									}
								/>
							</div>
							<span className="text-slate-300 font-medium">-</span>
							<div className="relative flex-1">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
									Max
								</span>
								<Input
									type="number"
									min={1}
									className="h-10 pl-10 bg-white"
									value={item.maxStaff}
									onChange={(e) =>
										updateWorkOrderConfig(
											index,
											"maxStaff",
											Number(e.target.value),
										)
									}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Work Order Phase */}
				{draftingWorkOrderType !== "auto" && (
					<div className="space-y-5 p-4 rounded-xl bg-slate-50 border border-slate-100/80">
						{/* Formulir Work Order */}
						<div className="space-y-3">
							<div>
								<Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
									Formulir Perintah Kerja <span className="text-red-500">*</span>
								</Label>
							</div>
							{/* <div className="flex flex-wrap gap-1.5 pb-1">
								{formTypeOptions.map((opt) => (
									<button
										key={opt.value}
										type="button"
										onClick={() => setWoTypeFilter(opt.value)}
										className={`px-3 py-1 text-[10px] font-semibold rounded-full border transition-all duration-200 ${
											woTypeFilter === opt.value ?
												"bg-primary border-primary text-white"
											:	"bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
										}`}>
										{opt.label}
									</button>
								))}
							</div> */}
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
								<Input
									placeholder="Cari nama formulir..."
									value={woFormSearch}
									onChange={(e) => setWoFormSearch(e.target.value)}
									className="pl-9 h-8 bg-white rounded-xl"
								/>
							</div>
							<div className="max-h-[320px] overflow-y-auto p-5 space-y-3 border border-slate-200 rounded-md bg-white">
								<div className="grid grid-cols-1 gap-2 3xl:grid-cols-3">
									{filteredWoForms.length === 0 ?
										<div className="text-sm text-slate-500 text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
											<EmptyData />
										</div>
										: filteredWoForms.map((f) => {
											const isSelected = item.workOrderFormId === f._id;
											return (
												<button
													key={f._id}
													type="button"
													onClick={() =>
														updateWorkOrderConfig(
															index,
															"workOrderFormId",
															isSelected ? "" : f._id,
														)
													}
													className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex flex-col gap-2 ${isSelected ?
														"border-primary bg-primary/5 shadow-sm"
														: "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
														}`}>
													<div className="flex items-center justify-between w-full">
														<div className="flex items-start gap-4">
															<div className="shrink-0 p-3 bg-primary/5 text-primary rounded-xl">
																<ScrollText className="w-5 h-5" />
															</div>
															<div className="flex-1 space-y-1">
																<h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-1">
																	{f.title || "Untitled Form"}
																</h3>
																<p className="text-xs text-slate-500 leading-relaxed line-clamp-1">
																	{f.description || "No description available."}
																</p>
															</div>
														</div>
													</div>
												</button>
											);
										})
									}
								</div>
							</div>
						</div>


					</div>
				)}

				{/* Work Report Phase */}
				<div className="space-y-5 p-4 rounded-xl bg-slate-50 border border-slate-100/80">
					{/* Formulir Work Report */}
					<div className="space-y-3">
						<div>
							<Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
								Formulir Laporan <span className="text-red-500">*</span>
							</Label>
						</div>
						{/* <div className="flex flex-wrap gap-1.5 pb-1">
							{formTypeOptions.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => setWrTypeFilter(opt.value)}
									className={`px-3 py-1 text-[10px] font-semibold rounded-full border transition-all duration-200 ${wrTypeFilter === opt.value ?
											"bg-primary border-primary text-white"
											: "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
										}`}>
									{opt.label}
								</button>
							))}
						</div> */}
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
							<Input
								placeholder="Cari nama formulir..."
								value={wrFormSearch}
								onChange={(e) => setWrFormSearch(e.target.value)}
								className="pl-9 h-8 bg-white rounded-xl"
							/>
						</div>
						<div className="max-h-[320px] overflow-y-auto p-5 space-y-3 border border-slate-200 rounded-md bg-white">
							<div className="grid grid-cols-1 gap-2 3xl:grid-cols-3">
								{filteredWrForms.length === 0 ?
									<div className="text-sm text-slate-500 text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
										<EmptyData />
									</div>
									: filteredWrForms.map((f) => {
										const isSelected = item.workReportFormId === f._id;
										return (
											<button
												key={f._id}
												type="button"
												onClick={() =>
													updateWorkOrderConfig(
														index,
														"workReportFormId",
														isSelected ? "" : f._id,
													)
												}
												className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex flex-col gap-2 ${isSelected ?
													"border-primary bg-primary/5 shadow-sm"
													: "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
													}`}>
												<div className="flex items-center justify-between w-full">
													<div className="flex items-start gap-4">
														<div className="shrink-0 p-3 bg-primary/5 text-primary rounded-xl">
															<ScrollText className="w-5 h-5" />
														</div>
														<div className="flex-1 space-y-1">
															<h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-1">
																{f.title || "Untitled Form"}
															</h3>
															<p className="text-xs text-slate-500 leading-relaxed line-clamp-1">
																{f.description || "No description available."}
															</p>
														</div>
													</div>
												</div>
											</button>
										);
									})
								}
							</div>
						</div>
					</div>

					{/* Persetujuan Pelaporan */}
					{draftingWorkOrderType !== "auto" && (
						<div className="space-y-4">
							<Label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
								Persetujuan Pelaporan
							</Label>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{(
									[
										{
											value: "auto",
											label: "Otomatis",
											desc: "Disetujui tanpa tindakan",
										},
										{
											value: "manager",
											label: "Manajer",
											desc: "Perlu telaah manajer",
										},
									] as const
								).map((opt) => {
									const isSelected = item.workReportApprovalType === opt.value;
									return (
										<button
											key={opt.value}
											type="button"
											onClick={() =>
												updateWorkOrderConfig(
													index,
													"workReportApprovalType",
													opt.value,
												)
											}
											className={`flex flex-col items-start gap-1 p-4 rounded-xl border-2 text-left transition-all duration-200 ${isSelected ?
												"border-primary bg-primary/5 shadow-sm"
												: "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
												}`}>
											<span
												className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-slate-700"
													}`}>
												{opt.label}
											</span>
											<span className="text-xs text-slate-500">{opt.desc}</span>
										</button>
									);
								})}
							</div>
						</div>
					)}

					{/* Show Report to Requester toggle */}
					<div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-sm mt-4">
						<div className="space-y-0.5">
							<p className="text-sm font-medium text-slate-700">
								Tampilkan Laporan ke Pemohon
							</p>
							<p className="text-xs text-slate-500">
								Pemohon dapat melihat laporan pengerjaan pada tahap ini.
							</p>
						</div>
						<Switch
							checked={item.showReportToRequester}
							onCheckedChange={(val) =>
								updateWorkOrderConfig(index, "showReportToRequester", val)
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

type CardWorkOrdersConfigProps = {
	forms: Form[];
	positions: Position[];
	loading: boolean;
	workOrdersConfig: WorkOrderConfigItem[];
	addWorkOrderConfig: () => void;
	removeWorkOrderConfig: (index: number) => void;
	updateWorkOrderConfig: (
		index: number,
		field: keyof WorkOrderConfigItem,
		value: string | number | boolean,
	) => void;
	draftingWorkOrderType: draftingWorkOrderType;
};

export const CardWorkOrdersConfig: React.FC<CardWorkOrdersConfigProps> = ({
	forms,
	positions,
	loading,
	workOrdersConfig,
	addWorkOrderConfig,
	removeWorkOrderConfig,
	updateWorkOrderConfig,
	draftingWorkOrderType,
}) => {
	return (
		<div className="h-full overflow-y-auto">
			<div className="p-8 space-y-6">
				{/* Section header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-primary/5 text-primary">
							<Hammer className="w-5 h-5" />
						</div>
						<div>
							<h2 className="text-base font-semibold text-slate-900">
								Konfigurasi Work Order
							</h2>
							<p className="text-sm text-slate-500">
								Atur posisi, formulir, dan alur persetujuan setiap work order.
							</p>
						</div>
					</div>
				</div>

				{loading ?
					<div className="flex items-center justify-center py-12 gap-3 text-slate-400">
						<Loader2 className="w-5 h-5 animate-spin" />
						<span className="text-sm">Memuat data…</span>
					</div>
					: workOrdersConfig.length === 0 ?
						<div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
							<div className="p-3 rounded-full bg-slate-100 mb-4">
								<Hammer className="w-6 h-6 text-slate-400" />
							</div>
							<p className="text-sm font-medium text-slate-700">
								Belum ada konfigurasi
							</p>
							<p className="text-xs text-slate-500 mt-1 max-w-xs">
								Klik "Tambah" untuk menambahkan konfigurasi work order pertama.
							</p>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="mt-4 gap-2"
								onClick={addWorkOrderConfig}>
								<Plus className="w-4 h-4" />
								Tambah Konfigurasi
							</Button>
						</div>
						: <div className="space-y-5">
							{workOrdersConfig.map((item, index) => (
								<WorkOrderRowCard
									key={index}
									item={item}
									index={index}
									forms={forms}
									positions={positions}
									removeWorkOrderConfig={removeWorkOrderConfig}
									updateWorkOrderConfig={updateWorkOrderConfig}
									draftingWorkOrderType={draftingWorkOrderType}
								/>
							))}

							{/* Add button below the loop */}
							<div className="flex pt-4">
								<Button
									type="button"
									onClick={addWorkOrderConfig}
									variant="outline"
									className="w-full gap-2 border-dashed border-2 py-6 text-slate-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5">
									<Plus className="w-5 h-5" />
									Tambah Konfigurasi Work Order
								</Button>
							</div>
						</div>
				}
			</div>
		</div>
	);
};
