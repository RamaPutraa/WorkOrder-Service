import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import FormFieldViewer from "../../../../../shared/molecules/form-field-viewer";
import { RoleAccessSelector } from "./role-access-selector";
import { type FormType } from "../../hooks/useCreateService";

type RoleConfig = {
	fillableByRoles: string[];
	fillableByPositionIds: string[];
	viewableByRoles: string[];
	viewableByPositionIds: string[];
};

type CardWorkOrderFormProps = {
	forms: Form[];
	positions: Position[];
	selectedForms: Form[];
	selectedStaff: Staff[];
	availableRoles: { value: string; label: string }[];
	formAccessConfig: Record<string, RoleConfig>;
	loading: boolean;

	// Handlers
	toggleForm: (form: Form) => void;
	toggleRoleFill: (formId: string, role: string, type: FormType) => void;
	toggleRoleView: (formId: string, role: string, type: FormType) => void;
	toggleFillablePosition: (
		formId: string,
		posId: string,
		type: FormType,
	) => void;
	toggleViewablePosition: (
		formId: string,
		posId: string,
		type: FormType,
	) => void;
};

export const CardWorkOrderForm: React.FC<CardWorkOrderFormProps> = ({
	forms,
	positions,
	selectedForms,
	selectedStaff,
	availableRoles,
	formAccessConfig,
	toggleForm,
	toggleRoleFill,
	toggleRoleView,
	toggleFillablePosition,
	toggleViewablePosition,
}) => {
	// Filter positions that are actually selected in the service
	const activePositions = selectedStaff
		.map((s) => positions.find((p) => p._id === s.positionId))
		.filter((p): p is Position => !!p);

	return (
		<Card className="border shadow-md rounded-lg overflow-hidden h-full flex flex-col">
			<div className="p-4 border-b bg-gradient-to-br from-background to-muted/20 shrink-0">
				<p className="text-sm text-muted-foreground">
					Pilih jenis form yang akan digunakan pada layanan work order ini.
				</p>
			</div>

			<CardContent className="pb-5 space-y-8 flex-1 overflow-y-auto min-h-0">
				{/* Pilihan form */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<Label className="text-base font-semibold">
							Pilih Form Tersedia
						</Label>
						<span className="text-sm text-muted-foreground">
							{selectedForms.length} dipilih
						</span>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{forms.map((form) => {
							const isSelected = selectedForms.some((f) => f._id === form._id);
							return (
								<div
									key={`workorder-available-${form._id}`}
									onClick={() => toggleForm(form)}
									className={`
										relative group cursor-pointer rounded-xl border-2 p-4 transition-all duration-200
										hover:border-primary/50 hover:bg-accent/50
										${isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-muted bg-card"}
									`}>
									<div className="flex items-start justify-between gap-3 mb-2">
										<div
											className={`
												p-2 rounded-lg transition-colors
												${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
											`}>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="w-4 h-4">
												<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
												<polyline points="14 2 14 8 20 8" />
												<path d="M12 18v-4" />
												<path d="M8 18v-2" />
												<path d="M16 18v-6" />
											</svg>
										</div>
										<Checkbox
											checked={isSelected}
											className={`
												transition-opacity duration-200
												${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
											`}
										/>
									</div>
									<div className="space-y-1">
										<h4 className="font-semibold leading-none tracking-tight">
											{form.title}
										</h4>
										<p className="text-sm text-muted-foreground line-clamp-2 h-10">
											{form.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Konfigurasi akses untuk form yang dipilih */}
				<div className="border bg-muted rounded-md p-6 space-y-6">
					{selectedForms.length === 0 ?
						<p className="text-muted-foreground text-sm text-center">
							Pilih form untuk melihat pratinjau di sini
						</p>
					:	selectedForms.map((form) => {
							const config = formAccessConfig[form._id] || {
								fillableByRoles: [],
								fillableByPositionIds: [],
								viewableByRoles: [],
								viewableByPositionIds: [],
							};

							return (
								<Card
									key={`workorder-form-${form._id}`}
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

									{/* Role & Position Config */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-6 pt-6 border-t">
										{/* === KIRI: Dapat diisi Oleh === */}
										<RoleAccessSelector
											label="Siapa yang dapat mengisi?"
											availableRoles={availableRoles}
											selectedRoles={config.fillableByRoles}
											onToggleRole={(role) =>
												toggleRoleFill(form._id, role, "workOrder")
											}
											positions={activePositions}
											selectedPositionIds={config.fillableByPositionIds}
											onTogglePosition={(posId) =>
												toggleFillablePosition(form._id, posId, "workOrder")
											}
										/>

										{/* === KANAN: Dapat dilihat Oleh === */}
										<RoleAccessSelector
											label="Siapa yang dapat melihat?"
											availableRoles={availableRoles}
											selectedRoles={config.viewableByRoles}
											onToggleRole={(role) =>
												toggleRoleView(form._id, role, "workOrder")
											}
											positions={activePositions}
											selectedPositionIds={config.viewableByPositionIds}
											onTogglePosition={(posId) =>
												toggleViewablePosition(form._id, posId, "workOrder")
											}
										/>
									</div>

									{/* Preview pertanyaan form */}
									<div>
										<div className="flex items-center justify-between mb-4 mt-8">
											<h3 className="font-semibold text-base flex items-center gap-2">
												Preview Form
												<span className="text-xs font-normal text-muted-foreground px-2 py-0.5 rounded-full bg-muted border">
													Read Only
												</span>
											</h3>
										</div>
										<div className="border rounded-xl p-6 space-y-6 bg-card/50">
											{form.fields?.length > 0 ?
												form.fields.map((field, i) => (
													<FormFieldViewer
														key={i}
														field={field}
														answer={null}
														readOnly={true}
													/>
												))
											:	<div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed">
													<p>Belum ada pertanyaan pada form ini</p>
												</div>
											}
										</div>
									</div>
								</Card>
							);
						})
					}
				</div>
			</CardContent>
		</Card>
	);
};
