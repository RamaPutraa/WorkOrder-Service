import { useState } from "react";
import {
	Building2,
	MapPin,
	Calendar,
	XCircle,
	RefreshCw,
	Pencil,
	CheckCircle2,
	Text,
	MessageCircleIcon,
} from "lucide-react";
import { useCompanyProfile, useUpdateCompany } from "../hooks/companyHooks";
import { useFaq } from "../../faqs/hooks/useFaq";

// Components
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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

	const {
		isActive: isFaqActive,
		handleToggleActive: handleFaqToggle,
		submitting: faqSubmitting,
	} = useFaq();

	const [openEdit, setOpenEdit] = useState(false);
	const [openToggleConfirm, setOpenToggleConfirm] = useState(false);
	const [openFaqToggleConfirm, setOpenFaqToggleConfirm] = useState(false);

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

	const handleToggleFaqActive = async () => {
		await handleFaqToggle(!isFaqActive);
		setOpenFaqToggleConfirm(false);
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
			<div className="pb-12 space-y-8">
				{/* ── Header Area ───────────────────────────────────────────────────── */}
				<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-border/40">
					<div className="flex items-start gap-5">
						{/* Icon Container: Lebih soft dengan border tipis */}
						<div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
							<Building2 className="w-8 h-8 text-primary stroke-[1.5]" />
						</div>

						<div className="space-y-1.5 mt-0.5">
							<div className="flex items-center gap-3">
								<h1 className="text-2xl font-bold tracking-tight text-foreground">
									{company.name}
								</h1>
								{/* Modern Badge */}
								<span
									className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
										company.isActive ?
											"text-emerald-700 bg-emerald-500/10 border border-emerald-500/20"
										:	"text-destructive bg-destructive/10 border border-destructive/20"
									}`}>
									<span
										className={`w-1.5 h-1.5 rounded-full ${
											company.isActive ?
												"bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
											:	"bg-destructive"
										}`}
									/>
									{company.isActive ? "Aktif" : "Non-Aktif"}
								</span>
							</div>
							<p className="text-sm text-muted-foreground">
								Profil & pengaturan utama perusahaan.
							</p>
						</div>
					</div>
				</div>

				{/* ── Section: Informasi Umum ──────────────────────────────────── */}
				<div className="space-y-3">
					<h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
						Informasi Umum
					</h2>

					{/* Container Flat & Clean */}
					<div className="bg-muted/10 border border-border/40 rounded-2xl overflow-hidden">
						<div className="flex flex-col">
							{/* Item: Deskripsi */}
							<div className="flex flex-col sm:flex-row gap-2 sm:gap-6 p-5 border-b border-border/40">
								<div className="sm:w-48 shrink-0">
									<p className="text-sm font-medium text-muted-foreground">
										Deskripsi
									</p>
								</div>
								<div className="flex-1 flex items-center gap-2.5">
									<Text className="w-4 h-4 text-muted-foreground/70 shrink-0" />
									{company.description ?
										<p className="text-sm text-foreground leading-relaxed">
											{company.description}
										</p>
									:	<p className="text-sm text-muted-foreground/50 italic">
											Belum ada deskripsi.
										</p>
									}
								</div>
							</div>

							{/* Item: Alamat */}
							<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-5 border-b border-border/40">
								<div className="sm:w-48 shrink-0">
									<p className="text-sm font-medium text-muted-foreground">
										Alamat
									</p>
								</div>
								<div className="flex-1 flex items-center gap-2.5">
									<MapPin className="w-4 h-4 text-muted-foreground/70 shrink-0" />
									{company.address ?
										<p className="text-sm text-foreground">{company.address}</p>
									:	<p className="text-sm text-muted-foreground/50 italic">
											Belum diatur
										</p>
									}
								</div>
							</div>

							{/* Item: Terdaftar */}
							<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-5">
								<div className="sm:w-48 shrink-0">
									<p className="text-sm font-medium text-muted-foreground">
										Terdaftar Sejak
									</p>
								</div>
								<div className="flex-1 flex items-center gap-2.5">
									<Calendar className="w-4 h-4 text-muted-foreground/70 shrink-0" />
									<p className="text-sm text-foreground">
										{formatDate(company.createdAt)}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* ── Section: Status / Pengaturan ───────────────────────────────────────────── */}
				<div className="space-y-3">
					<h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
						Pengaturan Sistem
					</h2>

					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 border border-border/40 rounded-2xl bg-card transition-all hover:border-primary/20">
						<div className="space-y-1.5">
							<div className="">
								<p className="text-sm font-bold text-foreground">
									Status Operasional
								</p>
								<p className="text-sm text-muted-foreground leading-relaxed">
									{company.isActive ?
										"Perusahaan aktif dan dapat menerima penugasan pekerjaan."
									:	"Semua operasi pekerjaan terhenti sementara."}
								</p>
								{company.isActive && (
									<p className="text-xs font-medium text-emerald-600 flex items-center gap-1.5 mt-1.5">
										<CheckCircle2 className="w-3.5 h-3.5" />
										Sistem berjalan normal
									</p>
								)}
							</div>
						</div>

						{/* Toggle Switch */}
						<div className="pl-10 sm:pl-0 shrink-0">
							<Switch
								checked={company.isActive}
								disabled={updating}
								onCheckedChange={() => setOpenToggleConfirm(true)}
								className="data-[state=checked]:bg-emerald-600"
							/>
						</div>
					</div>

					{/* ── FAQ Publik Toggle ── */}
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 border border-border/40 rounded-2xl bg-card transition-all hover:border-primary/20">
						<div className="space-y-1.5">
							<div className="">
								<p className="text-sm font-bold text-foreground">
									Status FAQ Publik
								</p>
								<p className="text-sm text-muted-foreground leading-relaxed">
									{isFaqActive ?
										"FAQ saat ini aktif dan dapat dilihat oleh pengguna publik di halaman utama."
									:	"FAQ saat ini disembunyikan dari pengguna publik."}
								</p>
								{isFaqActive && (
									<p className="text-xs font-medium text-emerald-600 flex items-center gap-1.5 mt-1.5">
										<MessageCircleIcon className="w-3.5 h-3.5" />
										Publik dapat melihat FAQ
									</p>
								)}
							</div>
						</div>

						{/* Toggle Switch */}
						<div className="pl-10 sm:pl-0 shrink-0">
							<Switch
								checked={isFaqActive}
								disabled={faqSubmitting}
								onCheckedChange={() => setOpenFaqToggleConfirm(true)}
								className="data-[state=checked]:bg-emerald-600"
							/>
						</div>
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
					<AlertDialogContent className="rounded-2xl">
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
							<AlertDialogCancel disabled={updating} className="rounded-xl">
								Batal
							</AlertDialogCancel>
							<AlertDialogAction
								disabled={updating}
								onClick={handleToggleActive}
								className={`rounded-xl ${
									company.isActive ?
										"bg-destructive hover:bg-destructive/90 text-white"
									:	"bg-emerald-600 hover:bg-emerald-700 text-white"
								}`}>
								{updating ?
									"Memproses..."
								: company.isActive ?
									"Ya, Nonaktifkan"
								:	"Ya, Aktifkan"}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				<AlertDialog
					open={openFaqToggleConfirm}
					onOpenChange={setOpenFaqToggleConfirm}>
					<AlertDialogContent className="rounded-2xl">
						<AlertDialogHeader>
							<AlertDialogTitle>
								{isFaqActive ?
									"Nonaktifkan FAQ Publik?"
								:	"Aktifkan FAQ Publik?"}
							</AlertDialogTitle>
							<AlertDialogDescription className="leading-relaxed">
								{isFaqActive ?
									"FAQ akan disembunyikan dari halaman publik dan tidak dapat diakses oleh umum."
								:	"FAQ akan ditampilkan di halaman publik dan dapat dibaca oleh semua orang."
								}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel disabled={faqSubmitting} className="rounded-xl">
								Batal
							</AlertDialogCancel>
							<AlertDialogAction
								disabled={faqSubmitting}
								onClick={handleToggleFaqActive}
								className={`rounded-xl ${
									isFaqActive ?
										"bg-destructive hover:bg-destructive/90 text-white"
									:	"bg-emerald-600 hover:bg-emerald-700 text-white"
								}`}>
								{faqSubmitting ?
									"Memproses..."
								: isFaqActive ?
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
