import { useEffect } from "react";
import {
	Building2,
	MapPin,
	Calendar,
	Crown,
	Users,
	UserCheck,
	CheckCircle2,
	XCircle,
	RefreshCw,
	Loader2,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCompanyById } from "@/features/owner/company/hooks/companyHooks";

// ─── Props ────────────────────────────────────────────────────────────────────
interface CompanyDetailDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	companyId: string;
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = ({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: React.ReactNode;
}) => (
	<div className="flex items-start gap-3">
		<div className="mt-0.5 p-1.5 rounded-md bg-muted/60 text-muted-foreground shrink-0">
			{icon}
		</div>
		<div className="min-w-0">
			<p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">
				{label}
			</p>
			<div className="text-sm font-medium text-foreground">{value}</div>
		</div>
	</div>
);

// ─── Component ────────────────────────────────────────────────────────────────
const CompanyDetailDialog = ({
	open,
	onOpenChange,
	companyId,
}: CompanyDetailDialogProps) => {
	const { company, loading, error, refetch } = useCompanyById(companyId, {
		lazy: true,
	});

	// Fetch saat dialog dibuka untuk pertama kalinya
	useEffect(() => {
		if (open && !company) {
			refetch();
		}
	}, [open]);

	const formatDate = (dateStr?: string) => {
		if (!dateStr) return "–";
		return new Date(dateStr).toLocaleDateString("id-ID", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[520px] p-0 overflow-hidden rounded-2xl">
				{/* ── Header ─────────────────────────────────────────────── */}
				<div className="bg-gradient-to-br from-blue-600 to-blue-500 px-6 pt-6 pb-5">
					<div className="flex items-center gap-3 mb-1">
						<div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
							<Building2 className="w-4 h-4 text-white" />
						</div>
						<div>
							<DialogTitle className="text-white text-lg font-semibold leading-tight">
								Detail Perusahaan
							</DialogTitle>
						</div>
					</div>
					<DialogDescription className="text-blue-100/80 text-sm pl-12">
						Informasi lengkap tentang perusahaan Anda
					</DialogDescription>
				</div>

				{/* ── Body ───────────────────────────────────────────────── */}
				<div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
					{/* Loading State */}
					{loading && (
						<div className="flex flex-col items-center justify-center py-12 gap-3">
							<div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
								<Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
							</div>
							<p className="text-sm text-muted-foreground">
								Memuat data perusahaan...
							</p>
						</div>
					)}

					{/* Error State */}
					{!loading && error && (
						<div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
							<div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
								<XCircle className="w-5 h-5 text-destructive" />
							</div>
							<div>
								<p className="text-sm font-semibold">Gagal Memuat Data</p>
								<p className="text-xs text-muted-foreground mt-1">{error}</p>
							</div>
							<Button
								size="sm"
								variant="outline"
								onClick={refetch}
								className="gap-2 mt-1">
								<RefreshCw className="w-3.5 h-3.5" />
								Coba Lagi
							</Button>
						</div>
					)}

					{/* Data State */}
					{!loading && !error && company && (
						<>
							{/* Company Name & Status */}
							<div className="flex items-center justify-between gap-3 pb-1">
								<div>
									<h2 className="text-xl font-bold tracking-tight">
										{company.name}
									</h2>
								</div>
								<Badge
									variant={company.isActive ? "default" : "destructive"}
									className={`shrink-0 px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold ${
										company.isActive ?
											"bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-0"
										:	"bg-red-100 text-red-800 hover:bg-red-200 border-0"
									}`}>
									{company.isActive ?
										<CheckCircle2 className="w-3 h-3 mr-1" />
									:	<XCircle className="w-3 h-3 mr-1" />}
									{company.isActive ? "Aktif" : "Non-Aktif"}
								</Badge>
							</div>

							{/* Description */}
							{company.description && (
								<p className="text-sm text-muted-foreground leading-relaxed bg-muted/40 rounded-lg px-4 py-3 border">
									{company.description}
								</p>
							)}

							<Separator />

							{/* Info Grid */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<InfoRow
									icon={<MapPin className="w-3.5 h-3.5" />}
									label="Alamat"
									value={
										<span className="text-muted-foreground">
											{company.address || "Belum diatur"}
										</span>
									}
								/>
								<InfoRow
									icon={<Calendar className="w-3.5 h-3.5" />}
									label="Terdaftar Sejak"
									value={
										<span className="text-muted-foreground">
											{formatDate(company.createdAt)}
										</span>
									}
								/>
								<InfoRow
									icon={<Users className="w-3.5 h-3.5" />}
									label="Total Karyawan"
									value={
										<span className="font-semibold text-foreground">
											{company.staffs?.length ?? 0} orang
										</span>
									}
								/>
								<InfoRow
									icon={<UserCheck className="w-3.5 h-3.5" />}
									label="Total Manager"
									value={
										<span className="font-semibold text-foreground">
											{company.managers?.length ?? 0} orang
										</span>
									}
								/>
							</div>

							<Separator />

							{/* Owner Info */}
							<div>
								<div className="flex items-center gap-2 mb-3">
									<Crown className="w-3.5 h-3.5 text-amber-500" />
									<p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
										Pemilik Perusahaan
									</p>
								</div>
								{company.owner ?
									<div className="flex items-center gap-3 p-3 rounded-xl border bg-amber-50/50">
										<Avatar className="h-10 w-10 border border-amber-200">
											<AvatarFallback className="bg-amber-100 text-amber-700 text-sm font-semibold">
												{company.owner.name.slice(0, 2).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="min-w-0">
											<p className="text-sm font-semibold truncate">
												{company.owner.name}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												{company.owner.email}
											</p>
										</div>
									</div>
								:	<p className="text-sm text-muted-foreground">
										Tidak ada informasi pemilik
									</p>
								}
							</div>
						</>
					)}
				</div>

				{/* ── Footer ─────────────────────────────────────────────── */}
				{!loading && (
					<div className="px-6 py-4 border-t flex justify-end gap-2 bg-muted/20">
						<Button
							size="sm"
							variant="ghost"
							onClick={() => onOpenChange(false)}
							className="text-muted-foreground">
							Tutup
						</Button>
						{company && (
							<Button
								size="sm"
								variant="outline"
								onClick={refetch}
								className="gap-1.5">
								<RefreshCw className="w-3.5 h-3.5" />
								Refresh
							</Button>
						)}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default CompanyDetailDialog;
