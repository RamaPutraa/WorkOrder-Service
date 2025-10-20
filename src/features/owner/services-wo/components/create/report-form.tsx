import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, CheckIcon } from "lucide-react";

type RoleConfig = {
	fillableByRoles: string[];
	fillableByPositionIds: string[];
	viewableByRoles: string[];
	viewableByPositionIds: string[];
};

type CardReportFormProps = {
	forms: Form[];
	positions: Position[];
	selectedReportForms: Form[];
	selectedStaff: Staff[];
	availableRoles: { value: string; label: string }[];
	formAccessConfigReport: Record<string, RoleConfig>;
	loading: boolean;

	toggleReportForm: (form: Form) => void;
	toggleRoleFill: (formId: string, role: string, isReport?: boolean) => void;
	toggleRoleView: (formId: string, role: string, isReport?: boolean) => void;
	toggleFillablePosition: (
		formId: string,
		posId: string,
		isReport?: boolean
	) => void;
	toggleViewablePosition: (
		formId: string,
		posId: string,
		isReport?: boolean
	) => void;
};

export const CardReportForm: React.FC<CardReportFormProps> = ({
	forms,
	positions,
	selectedReportForms,
	selectedStaff,
	availableRoles,
	formAccessConfigReport,
	toggleReportForm,
	toggleRoleFill,
	toggleRoleView,
	toggleFillablePosition,
	toggleViewablePosition,
}) => {
	return (
		<Card className="p-4 border shadow-md rounded-2xl mt-8">
			<CardHeader className="pt-5 px-6">
				<div className="flex items-center justify-between">
					<p className="text-muted-foreground">
						Pilih form laporan (report form) yang akan digunakan setelah layanan
						work order selesai.
					</p>
				</div>
			</CardHeader>

			<CardContent className="pb-5 space-y-5">
				{/* Pilihan form report */}
				<div className="grid grid-cols-2 gap-2">
					{forms.map((form) => (
						<Label
							key={`report-available-${form._id}`}
							onClick={() => toggleReportForm(form)}
							className="
								hover:bg-accent/50 cursor-pointer flex items-start gap-3
								rounded-lg border p-3 transition-colors
								has-[[aria-checked=true]]:border-primary
								has-[[aria-checked=true]]:bg-primary/5
							">
							<Checkbox
								onClick={(e) => e.stopPropagation()} // 🔥 mencegah double toggle
								checked={selectedReportForms.some((f) => f._id === form._id)}
								className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
							/>
							<div className="grid gap-1.5 font-normal">
								<p className="text-sm leading-none font-medium">{form.title}</p>
								<p className="text-muted-foreground text-sm line-clamp-3">
									{form.description}
								</p>
							</div>
						</Label>
					))}
				</div>

				{/* Konfigurasi akses form report */}
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
									key={`report-form-${form._id}`}
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

									{/* Akses Role & Posisi */}
									<div className="grid grid-cols-2 gap-6 items-start mt-5">
										{/* === KIRI: Dapat diisi oleh === */}
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
																? config.fillableByRoles
																		.map(
																			(r) =>
																				availableRoles.find(
																					(ar) => ar.value === r
																				)?.label || r
																		)
																		.join(", ")
																: "Pilih roles..."}
															<ChevronDownIcon className="h-4 w-4 opacity-50" />
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-[250px] p-2 space-y-2">
														{availableRoles.map((role) => (
															<div
																key={`report-fill-${form._id}-${role.value}`}
																className="flex items-center space-x-2 cursor-pointer"
																onClick={() =>
																	toggleRoleFill(form._id, role.value, true)
																}>
																<Checkbox
																	onClick={(e) => e.stopPropagation()}
																	checked={config.fillableByRoles.includes(
																		role.value
																	)}
																/>
																<span>{role.label}</span>
															</div>
														))}
													</PopoverContent>
												</Popover>
											</div>

											{/* Pilihan staff */}
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
																	const pos = positions.find(
																		(p) => p._id === id
																	);
																	return (
																		<div
																			key={`report-fillpos-${form._id}-${id}`}
																			className="flex items-center gap-1 px-2 py-1 text-sm rounded-md border border-primary text-primary bg-primary/10">
																			<span>
																				{pos?.name || "Tidak diketahui"}
																			</span>
																			<button
																				type="button"
																				onClick={() =>
																					toggleFillablePosition(
																						form._id,
																						id,
																						true
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
																			key={`report-fillselect-${form._id}-${id}`}
																			onClick={(e) => {
																				e.preventDefault();
																				toggleFillablePosition(
																					form._id,
																					id,
																					true
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

										{/* === KANAN: Dapat dilihat oleh === */}
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
																? config.viewableByRoles
																		.map(
																			(r) =>
																				availableRoles.find(
																					(ar) => ar.value === r
																				)?.label || r
																		)
																		.join(", ")
																: "Pilih roles..."}
															<ChevronDownIcon className="h-4 w-4 opacity-50" />
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-[250px] p-2 space-y-2">
														{availableRoles.map((role) => (
															<div
																key={`report-view-${form._id}-${role.value}`}
																className="flex items-center space-x-2 cursor-pointer"
																onClick={() =>
																	toggleRoleView(form._id, role.value, true)
																}>
																<Checkbox
																	onClick={(e) => e.stopPropagation()}
																	checked={config.viewableByRoles.includes(
																		role.value
																	)}
																/>
																<span>{role.label}</span>
															</div>
														))}
													</PopoverContent>
												</Popover>
											</div>

											{/* Staff posisi view */}
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
																	const pos = positions.find(
																		(p) => p._id === id
																	);
																	return (
																		<div
																			key={`report-viewpos-${form._id}-${id}`}
																			className="flex items-center gap-1 px-2 py-1 text-sm rounded-md border border-primary text-primary bg-primary/10">
																			<span>
																				{pos?.name || "Tidak diketahui"}
																			</span>
																			<button
																				type="button"
																				onClick={() =>
																					toggleViewablePosition(
																						form._id,
																						id,
																						true
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
																			key={`report-viewselect-${form._id}-${id}`}
																			onClick={(e) => {
																				e.preventDefault();
																				toggleViewablePosition(
																					form._id,
																					id,
																					true
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

									{/* Preview fields */}
									<h3 className="leading-none font-medium mt-8">
										Pertanyaan Form
									</h3>
									<div className="border rounded-md p-6 space-y-4">
										{form.fields?.map((field, i) => (
											<div
												key={`report-field-${form._id}-${i}`}
												className="space-y-1">
												<Label className="text-sm font-medium">
													{field.label}
												</Label>
												<p className="text-sm text-muted-foreground border rounded-md p-2 bg-muted/40">
													{field.placeholder || field.type}
												</p>
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
	);
};
