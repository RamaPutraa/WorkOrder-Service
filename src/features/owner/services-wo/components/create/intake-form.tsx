import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type RoleConfig = {
	fillableByRoles: string[];
	fillableByPositionIds: string[];
	viewableByRoles: string[];
	viewableByPositionIds: string[];
};

type CardIntakeFormProps = {
	forms: Form[];
	positions: Position[];
	selectedIntakeForms: Form[];
	selectedStaff: Staff[];
	availableRoles: { value: string; label: string }[];
	formAccessConfigIntake: Record<string, RoleConfig>;
	loading: boolean;

	toggleIntakeForm: (form: Form) => void;
};

export const CardIntakeForm: React.FC<CardIntakeFormProps> = ({
	forms,
	selectedIntakeForms,
	toggleIntakeForm,
}) => {
	return (
		<Card className="p-4 border shadow-md rounded-2xl mt-8">
			<CardHeader className="pt-5 px-6">
				<div className="flex items-center justify-between">
					<p className="text-muted-foreground">
						Pilih form intake (form intake) yang akan digunakan setelah layanan
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
							onClick={() => toggleIntakeForm(form)}
							className="
								hover:bg-accent/50 cursor-pointer flex items-start gap-3
								rounded-lg border p-3 transition-colors
								has-[[aria-checked=true]]:border-primary
								has-[[aria-checked=true]]:bg-primary/5
							">
							<Checkbox
								onClick={(e) => e.stopPropagation()} // 🔥 mencegah double toggle
								checked={selectedIntakeForms.some((f) => f._id === form._id)}
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
					{selectedIntakeForms.length === 0 ? (
						<p className="text-muted-foreground text-sm text-center">
							Pilih form untuk melihat pratinjau di sini
						</p>
					) : (
						selectedIntakeForms.map((form) => {
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

									{/* Preview fields */}
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
	);
};
