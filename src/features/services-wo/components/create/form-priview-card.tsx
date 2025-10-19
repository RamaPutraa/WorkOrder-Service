import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

interface FormPreviewCardProps {
	form: Form;
	availableRoles: string[];
	selectedStaff: Staff[];
	config: {
		fillableByRoles: string[];
		fillableByPositionIds: string[];
		viewableByRoles: string[];
		viewableByPositionIds: string[];
	};
	onToggleRoleFill: (formId: string, role: string) => void;
	onToggleRoleView: (formId: string, role: string) => void;
	onToggleFillablePosition: (formId: string, posId: string) => void;
	onToggleViewablePosition: (formId: string, posId: string) => void;
}

export default function FormPreviewCard({
	form,
	availableRoles,
	selectedStaff,
	config,
	onToggleRoleFill,
	onToggleRoleView,
	onToggleFillablePosition,
	onToggleViewablePosition,
}: FormPreviewCardProps) {
	return (
		<Card className="border rounded-xl shadow-sm p-5">
			{/* Header */}
			<div>
				<h3 className="font-semibold text-lg">{form.title}</h3>
				<p className="text-sm text-muted-foreground">{form.description}</p>
				<p className="text-sm mt-1 text-primary font-medium">
					Tipe: {form.formType}
				</p>
			</div>

			{/* Fillable & Viewable */}
			<div className="grid grid-cols-2 gap-6 items-start mt-4">
				{/* FILLABLE */}
				<AccessColumn
					label="Dapat diisi Oleh"
					formId={form._id}
					availableRoles={availableRoles}
					selectedStaff={selectedStaff}
					roles={config.fillableByRoles}
					positionIds={config.fillableByPositionIds}
					onToggleRole={onToggleRoleFill}
					onTogglePosition={onToggleFillablePosition}
				/>

				{/* VIEWABLE */}
				<AccessColumn
					label="Dapat dilihat Oleh"
					formId={form._id}
					availableRoles={availableRoles}
					selectedStaff={selectedStaff}
					roles={config.viewableByRoles}
					positionIds={config.viewableByPositionIds}
					onToggleRole={onToggleRoleView}
					onTogglePosition={onToggleViewablePosition}
				/>
			</div>

			{/* Fields */}
			<h3 className="leading-none font-medium mt-8">Pertanyaan Form</h3>
			<div className="border rounded-md p-6 space-y-4">
				{form.fields?.map((field, i) => (
					<div key={i} className="space-y-1">
						<Label className="text-sm font-medium">{field.label}</Label>

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
										<li key={j} className="flex items-center space-x-2">
											<input type="radio" name={`field-${i}`} disabled />
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
										<li key={j} className="flex items-center space-x-2">
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
}

function AccessColumn({
	label,
	formId,
	availableRoles,
	selectedStaff,
	roles,
	positionIds,
	onToggleRole,
	onTogglePosition,
}: {
	label: string;
	formId: string;
	availableRoles: string[];
	selectedStaff: Staff[];
	roles: string[];
	positionIds: string[];
	onToggleRole: (formId: string, role: string) => void;
	onTogglePosition: (formId: string, posId: string) => void;
}) {
	return (
		<div className="space-y-4">
			<div className="space-y-1">
				<Label className="text-sm font-medium">{label}</Label>
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outline" className="w-full justify-between">
							{roles.length > 0 ? roles.join(", ") : "Pilih roles..."}
							<ChevronDownIcon className="h-4 w-4 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[250px] p-2 space-y-2">
						{availableRoles.map((role) => (
							<div
								key={role}
								className="flex items-center space-x-2 cursor-pointer"
								onClick={() => onToggleRole(formId, role)}>
								<Checkbox checked={roles.includes(role)} />
								<span>{role}</span>
							</div>
						))}
					</PopoverContent>
				</Popover>
			</div>

			{roles.includes("staff") && (
				<div className="flex flex-wrap items-start justify-between gap-2 border rounded-md px-3 py-2 mt-1.5">
					<div className="flex flex-col flex-1 min-w-0">
						{positionIds.length === 0 ? (
							<p className="text-sm text-muted-foreground italic">
								Pilih beberapa staff
							</p>
						) : (
							<div className="flex flex-wrap gap-2">
								{positionIds.map((id) => {
									const pos = selectedStaff.find(
										(s) => String(s.position._id) === id
									)?.position;
									return (
										<div
											key={id}
											className="flex items-center gap-1 px-2 py-1 text-sm rounded-md border border-primary text-primary bg-primary/10">
											<span>{pos?.name || "Tidak diketahui"}</span>
											<button
												type="button"
												onClick={() => onTogglePosition(formId, id)}
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
									const id = String(s.position._id);
									const isSelected = positionIds.includes(id);
									return (
										<DropdownMenuItem
											key={id}
											onClick={(e) => {
												e.preventDefault();
												onTogglePosition(formId, id);
											}}
											className="flex justify-between">
											<span>{s.position.name}</span>
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
	);
}
