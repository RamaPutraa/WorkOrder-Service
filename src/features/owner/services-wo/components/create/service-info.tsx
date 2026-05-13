import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Info, Globe, Lock, Users } from "lucide-react";

type Status = {
	value: string;
	label: string;
};

type CardServiceInfoProps = {
	title: string;
	description: string;
	accessType: string;
	selectedStatus: Status | null;
	statuses: Status[];

	setTitle: (val: string) => void;
	setDescription: (val: string) => void;
	setAccessType: (val: string) => void;
	setSelectedStatus: (val: Status | null) => void;
	draftingWorkOrderType: draftingWorkOrderType;
	setDraftingWorkOrderType: (val: draftingWorkOrderType) => void;
	isEditMode?: boolean;
};

const accessTypeOptions = [
	{
		value: "public",
		label: "Publik",
		description: "Siapapun dapat mengakses layanan ini",
		icon: Globe,
	},
	{
		value: "member_only",
		label: "Member Only",
		description: "Hanya untuk pengguna terdaftar",
		icon: Users,
	},
	{
		value: "internal",
		label: "Internal",
		description: "Hanya untuk staff internal",
		icon: Lock,
	},
];

export const CardServiceInfo: React.FC<CardServiceInfoProps> = ({
	title,
	description,
	accessType,
	selectedStatus,
	statuses,
	setTitle,
	setDescription,
	setAccessType,
	setSelectedStatus,
	draftingWorkOrderType,
	setDraftingWorkOrderType,
	isEditMode = false,
}) => {
	const isActive = selectedStatus?.value === "true";

	return (
		<div className="h-full overflow-y-auto">
			<div className="max-w-full space-y-8 p-8">
				{/* Section header */}
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-lg bg-primary/5 text-primary">
						<Info className="w-5 h-5" />
					</div>
					<div>
						<h2 className="text-base font-semibold text-slate-900">
							Informasi Layanan
						</h2>
						<p className="text-sm text-slate-500">
							Isi informasi dasar layanan yang akan dibuat.
						</p>
					</div>
				</div>

				{/* Title */}
				<div className="space-y-2">
					<Label className="text-sm font-medium text-slate-700">
						Judul Layanan <span className="text-red-500">*</span>
					</Label>
					<Input
						placeholder="Contoh: Cleaning Service"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="h-11"
					/>
				</div>

				{/* Description */}
				<div className="space-y-2">
					<Label className="text-sm font-medium text-slate-700">
						Deskripsi Layanan <span className="text-red-500">*</span>
					</Label>
					<Textarea
						placeholder="Jelaskan layanan ini secara singkat…"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						rows={4}
						className="resize-none"
					/>
				</div>

				{/* Access Type */}
				<div className="space-y-3">
					<Label className="text-sm font-medium text-slate-700">
						Tipe Akses <span className="text-red-500">*</span>
					</Label>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						{accessTypeOptions.map((opt) => {
							const Icon = opt.icon;
							const isSelected = accessType === opt.value;
							return (
								<button
									key={opt.value}
									type="button"
									onClick={() => setAccessType(opt.value)}
									className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
										isSelected ?
											"border-primary bg-primary/5 shadow-sm"
										:	"border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
									}`}>
									<div
										className={`p-1.5 rounded-lg ${isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}>
										<Icon className="w-4 h-4" />
									</div>
									<span
										className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-slate-700"}`}>
										{opt.label}
									</span>
									<span className="text-xs text-slate-500 leading-snug">
										{opt.description}
									</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Status */}
				{!isEditMode && (
					<div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
						<div className="space-y-0.5">
							<p className="text-sm font-medium text-slate-700">
								Status Layanan
							</p>
							<p className="text-xs text-slate-500">
								{isActive ?
									"Layanan aktif dan tersedia"
								:	"Layanan dinonaktifkan"}
							</p>
						</div>
						<Switch
							checked={isActive}
							onCheckedChange={(checked) => {
								const match = statuses.find((s) => s.value === String(checked));
								setSelectedStatus(match ?? null);
							}}
						/>
					</div>
				)}

				{/* Drafting Mode */}
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<p className="text-sm font-medium text-slate-700">
							Tipe Pengerjaan Layanan
						</p>
					</div>
					<p className="text-xs text-slate-500 mb-3">
						Tentukan apakah instruksi kerja langsung diterbitkan atau disimpan
						sebagai draf terlebih dahulu.
					</p>
					<div className="grid grid-cols-2 gap-3">
						{(
							[
								{
									value: "auto",
									label: "Otomatis",
									desc: "Langsung diterbitkan",
								},
								{
									value: "manual",
									label: "Manual (Perlu dikonfigurasi)",
									desc: "Disimpan sebagai draf",
								},
							] as const
						).map((opt) => {
							const isSelected = draftingWorkOrderType === opt.value;
							return (
								<button
									key={opt.value}
									type="button"
									onClick={() => setDraftingWorkOrderType(opt.value)}
									className={`flex flex-col items-start gap-1 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
										isSelected ?
											"border-primary bg-primary/5 shadow-sm"
										:	"border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
									}`}>
									<span
										className={`text-sm font-semibold ${
											isSelected ? "text-primary" : "text-slate-700"
										}`}>
										{opt.label}
									</span>
									<span className="text-xs text-slate-500">{opt.desc}</span>
								</button>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};
