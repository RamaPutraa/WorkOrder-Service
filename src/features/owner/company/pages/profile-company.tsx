import { useState } from "react";
import {
	Building2,
	MapPin,
	Calendar,
	Users,
	UserCheck,
	Crown,
	XCircle,
	RefreshCw,
	Pencil,
	Power,
	Mail,
	CheckCircle2,
} from "lucide-react";
import { useCompanyProfile, useUpdateCompany } from "../hooks/companyHooks";

// Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SectionLoading } from "@/shared/atoms";
import EditCompanyDialog from "../components/edit-company-dialog";
import PageHeader from "@/shared/atoms/header-content";

const ProfileCompany = () => {
	const { company, loading, error, refetch } = useCompanyProfile();
	const { updateCompany, loading: updating } = useUpdateCompany(refetch);

	const [openEdit, setOpenEdit] = useState(false);
	const [openToggleConfirm, setOpenToggleConfirm] = useState(false);

	if (loading) return <SectionLoading message="Memuat profil perusahaan.." />;

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
				<div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
					<XCircle className="w-7 h-7 text-destructive" />
				</div>
				<div>
					<p className="font-semibold text-base">Gagal Memuat Data</p>
					<p className="text-sm text-muted-foreground mt-1">{error}</p>
				</div>
				<Button
					variant="outline"
					onClick={refetch}
					size="sm"
					className="gap-2 mt-1">
					<RefreshCw className="w-3.5 h-3.5" />
					Coba Lagi
				</Button>
			</div>
		);
	}

	if (!company) return null;

	const formatDate = (dateStr: string) => {
		if (!dateStr) return "–";
		return new Date(dateStr).toLocaleDateString("id-ID", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	const handleToggleActive = async () => {
		await updateCompany({
			name: company.name,
			address: company.address,
			description: company.description ?? "",
			isActive: !company.isActive,
		});
		setOpenToggleConfirm(false);
	};

	return (
		<>
			<PageHeader
				title="Profil Perusahaan"
				subtitle="Informasi detail perusahaan dan pengaturan."
				backPath={true}
				addLabel="Edit Profile"
				onAddClick={() => setOpenEdit(true)}
				addIcon={<Pencil className="w-3.5 h-3.5" />}
			/>
			<div className="pb-12 space-y-0">
				{/* ── Header ───────────────────────────────────────────────────── */}
				<div className="flex items-start justify-between pb-8">
					<div className="flex items-center gap-4">
						<div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
							<Building2 className="w-7 h-7 text-primary-foreground" />
						</div>
						<div>
							<div className="flex items-center gap-2.5 mb-0.5">
								<h1 className="text-xl font-semibold leading-tight">
									{company.name}
								</h1>
								<span
									className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
										company.isActive ?
											"text-emerald-700 bg-emerald-50 border border-emerald-200"
										:	"text-red-600 bg-red-50 border border-red-200"
									}`}>
									<span
										className={`w-1.5 h-1.5 rounded-full ${company.isActive ? "bg-emerald-500" : "bg-red-500"}`}
									/>
									{company.isActive ? "Aktif" : "Non-Aktif"}
								</span>
							</div>
							<p className="text-sm text-muted-foreground">
								Profil &amp; pengaturan perusahaan
							</p>
						</div>
					</div>
				</div>

				{/* ── Section: Informasi Umum ──────────────────────────────────── */}
				<div>
					<p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-3">
						Informasi Umum
					</p>

					<div className="space-y-0 divide-y divide-border/60">
						{/* Deskripsi */}
						<div className="py-4 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-8">
							<p className="text-sm text-muted-foreground w-32 shrink-0 pt-0.5">
								Deskripsi
							</p>
							<p className="text-sm leading-relaxed">
								{company.description || (
									<span className="text-muted-foreground/50 italic">
										Belum ada deskripsi.
									</span>
								)}
							</p>
						</div>

						{/* Alamat */}
						<div className="py-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-8">
							<p className="text-sm text-muted-foreground w-32 shrink-0">
								Alamat
							</p>
							<div className="flex items-center gap-2">
								<MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
								<p className="text-sm">
									{company.address || (
										<span className="text-muted-foreground/50 italic">
											Belum diatur
										</span>
									)}
								</p>
							</div>
						</div>

						{/* Terdaftar sejak */}
						<div className="py-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-8">
							<p className="text-sm text-muted-foreground w-32 shrink-0">
								Terdaftar
							</p>
							<div className="flex items-center gap-2">
								<Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
								<p className="text-sm">{formatDate(company.createdAt)}</p>
							</div>
						</div>
					</div>
				</div>

				<div className="py-6">
					<Separator />
				</div>

				{/* ── Section: Tim ─────────────────────────────────────────────── */}
				<div>
					<p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-3">
						Tim Perusahaan
					</p>

					<div className="space-y-0 divide-y divide-border/60">
						{/* Owner */}
						<div className="py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
							<p className="text-sm text-muted-foreground w-32 shrink-0">
								Pemilik
							</p>
							<div className="flex items-center gap-3">
								<Avatar className="h-8 w-8 border">
									<AvatarFallback className="bg-amber-50 text-amber-700 text-xs font-semibold">
										{company.owner?.name.slice(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div>
									<div className="flex items-center gap-1.5">
										<p className="text-sm font-medium">{company.owner?.name}</p>
										<Crown className="w-3 h-3 text-amber-500" />
									</div>
									<p className="text-xs text-muted-foreground flex items-center gap-1">
										<Mail className="w-2.5 h-2.5" />
										{company.owner?.email}
									</p>
								</div>
							</div>
						</div>

						{/* Jumlah Manager */}
						<div className="py-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-8">
							<p className="text-sm text-muted-foreground w-32 shrink-0">
								Manager
							</p>
							<div className="flex items-center gap-2">
								<UserCheck className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
								<p className="text-sm">
									<span className="font-semibold">
										{company.managers?.length ?? 0}
									</span>
									<span className="text-muted-foreground ml-1">
										orang terdaftar
									</span>
								</p>
							</div>
						</div>

						{/* Jumlah Karyawan */}
						<div className="py-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-8">
							<p className="text-sm text-muted-foreground w-32 shrink-0">
								Karyawan
							</p>
							<div className="flex items-center gap-2">
								<Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
								<p className="text-sm">
									<span className="font-semibold">
										{company.staffs?.length ?? 0}
									</span>
									<span className="text-muted-foreground ml-1">
										orang terdaftar
									</span>
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="py-6">
					<Separator />
				</div>

				{/* ── Section: Status ───────────────────────────────────────────── */}
				<div className="bg-card rounded-xl p-6 shadow-sm">
					<p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-3">
						Pengaturan
					</p>

					<div className="py-4 flex items-start justify-between gap-6">
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<Power className="w-3.5 h-3.5 text-muted-foreground" />
								<p className="text-sm font-medium">Status Aktif</p>
							</div>
							<p className="text-xs text-muted-foreground leading-relaxed pl-5">
								{company.isActive ?
									"Perusahaan aktif dan dapat menerima pekerjaan."
								:	"Semua operasi pekerjaan terhenti sementara."}
							</p>
							{company.isActive && (
								<p className="text-xs text-emerald-600 flex items-center gap-1 pl-5 pt-0.5">
									<CheckCircle2 className="w-3 h-3" />
									Semua sistem berjalan normal
								</p>
							)}
						</div>
						<Switch
							checked={company.isActive}
							disabled={updating}
							onCheckedChange={() => setOpenToggleConfirm(true)}
							className="mt-0.5 data-[state=checked]:bg-emerald-600 shrink-0"
						/>
					</div>
				</div>

				{/* ── Dialogs ─────────────────────────────────────────────────── */}
				<EditCompanyDialog
					open={openEdit}
					onOpenChange={setOpenEdit}
					company={company}
					onSuccess={refetch}
				/>

				<AlertDialog
					open={openToggleConfirm}
					onOpenChange={setOpenToggleConfirm}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{company.isActive ?
									"Nonaktifkan Perusahaan?"
								:	"Aktifkan Perusahaan?"}
							</AlertDialogTitle>
							<AlertDialogDescription className="leading-relaxed">
								{company.isActive ?
									"Perusahaan akan dinonaktifkan. Seluruh akses operasional akan terhenti sementara."
								:	"Perusahaan akan diaktifkan kembali. Semua staff dan akses operasional akan kembali berfungsi normal."
								}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel disabled={updating}>Batal</AlertDialogCancel>
							<AlertDialogAction
								disabled={updating}
								onClick={handleToggleActive}
								className={
									company.isActive ?
										"bg-destructive hover:bg-destructive/90 text-white"
									:	"bg-emerald-600 hover:bg-emerald-700 text-white"
								}>
								{updating ?
									"Memproses..."
								: company.isActive ?
									"Ya, Nonaktifkan"
								:	"Ya, Aktifkan"}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</>
	);
};

export default ProfileCompany;
