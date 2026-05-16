import { useState, useEffect } from "react";
import {
	Building2,
	MapPin,
	Calendar,
	Pencil,
	CheckCircle2,
	Text,
	MessageCircleIcon,
	Link2,
	KeyRound,
	ShieldCheck,
	ChevronDown,
	ChevronUp,
	Save,
	Loader2,
} from "lucide-react";
import { useCompanyProfile, useUpdateCompany } from "../hooks/companyHooks";
import { useFaq } from "../../faqs/hooks/useFaq";
import { useIntegrationConfig } from "../../pairing-company/hooks/useIntegrationConfig";

// Components
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { EmptyData } from "@/shared/molecules/empty-data";

const ProfileCompany = () => {
	const { company, loading, error, refetch } = useCompanyProfile();
	const { updateCompany, loading: updating } = useUpdateCompany(refetch);

	const {
		isActive: isFaqActive,
		handleToggleActive: handleFaqToggle,
		submitting: faqSubmitting,
	} = useFaq();

	const {
		config,
		loading: configLoading,
		submitting: configSubmitting,
		handleUpdate: updateIntegration,
	} = useIntegrationConfig();

	// Local form state untuk edit konfigurasi integrasi
	const [integrationForm, setIntegrationForm] = useState<IntegrationConfig>({
		external_login_url: "",
		external_verify_url: "",
		external_check_membership_url: "",
		secret_key: "",
		is_integration_active: false,
	});
	const [showIntegrationForm, setShowIntegrationForm] = useState(false);
	const [isDirty, setIsDirty] = useState(false);

	// Sync form saat config berhasil di-load
	useEffect(() => {
		if (config) {
			setIntegrationForm(config);
			setIsDirty(false);
		}
	}, [config]);

	const handleFormChange = (field: keyof IntegrationConfig, value: string) => {
		setIntegrationForm((prev) => ({ ...prev, [field]: value }));
		setIsDirty(true);
	};

	const handleSaveIntegration = async () => {
		const success = await updateIntegration(integrationForm);
		if (success) {
			setIsDirty(false);
		}
	};

	const [openEdit, setOpenEdit] = useState(false);
	const [openToggleConfirm, setOpenToggleConfirm] = useState(false);
	const [openFaqToggleConfirm, setOpenFaqToggleConfirm] = useState(false);
	const [openIntegrationToggleConfirm, setOpenIntegrationToggleConfirm] =
		useState(false);

	if (loading) return <SectionLoading message="Memuat profil perusahaan.." />;

	if (error) {
		return <EmptyData />;
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

	const handleConfirmToggleIntegration = async () => {
		const newValue = !integrationForm.is_integration_active;
		await updateIntegration({
			...integrationForm,
			is_integration_active: newValue,
		});
		setOpenIntegrationToggleConfirm(false);
	};

	const isIntegrationActive = integrationForm.is_integration_active;

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
								Profil &amp; pengaturan utama perusahaan.
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
						Pengaturan Operasional Perusahaan
					</h2>

					<div className="shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 border border-border/40 rounded-2xl bg-card transition-all hover:border-primary/20">
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
					<div className="shadow-sm  flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 border border-border/40 rounded-2xl bg-card transition-all hover:border-primary/20">
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

				{/* ── Section: Integrasi Antar Sistem ─────────────────────────── */}
				<div className="space-y-3">
					<h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
						Integrasi Antar Sistem
					</h2>

					{/* Toggle Integrasi Aktif */}
					<div className="shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 border border-border/40 rounded-2xl bg-card transition-all hover:border-primary/20">
						<div className="space-y-1.5">
							<p className="text-sm font-bold text-foreground">
								Aktifkan Integrasi
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Hubungkan sisitem internal perusahaan anda dengan platform kami
								agar pelanggan dapat mengaitkan akun mereka dan memperoleh akses
								ke layanan khusus pelanggan secara otomatis
							</p>
							{isIntegrationActive && (
								<p className="text-xs font-medium text-emerald-600 flex items-center gap-1.5 mt-1.5">
									<CheckCircle2 className="w-3.5 h-3.5" />
									Sistem integrasi aktif
								</p>
							)}
						</div>

						<div className="pl-10 sm:pl-0 shrink-0">
							{configLoading ?
								<Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
							:	<Switch
									checked={isIntegrationActive}
									disabled={configSubmitting}
									onCheckedChange={() => setOpenIntegrationToggleConfirm(true)}
									className="data-[state=checked]:bg-emerald-600"
								/>
							}
						</div>
					</div>

					{/* Konfigurasi URL & Secret Key */}
					<div className="border border-border/40 rounded-2xl bg-card overflow-hidden shadow-sm">
						{/* Header accordion */}
						<button
							type="button"
							onClick={() => setShowIntegrationForm((prev) => !prev)}
							className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/20 transition-colors">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center">
									<Link2 className="w-4 h-4 text-primary" />
								</div>
								<div>
									<p className="text-sm font-bold text-foreground">
										Konfigurasi URL & Kunci Integrasi
									</p>
									<p className="text-xs text-muted-foreground mt-0.5">
										Atur endpoint dan kunci rahasia untuk koneksi sistem
										eksternal
									</p>
								</div>
							</div>
							{showIntegrationForm ?
								<ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
							:	<ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
							}
						</button>

						{/* Form collapse */}
						{showIntegrationForm && (
							<div className="border-t border-border/40 p-5 space-y-5">
								{configLoading ?
									<div className="flex items-center justify-center py-8">
										<Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
										<span className="ml-2 text-sm text-muted-foreground">
											Memuat konfigurasi...
										</span>
									</div>
								:	<>
										{/* External Login URL */}
										<div className="space-y-2">
											<Label
												htmlFor="external_login_url"
												className="text-sm font-medium flex items-center gap-2">
												<Link2 className="w-3.5 h-3.5 text-muted-foreground" />
												URL Login Eksternal
											</Label>
											<Input
												id="external_login_url"
												placeholder="Contoh: https://external-service.com/api/login"
												value={integrationForm.external_login_url}
												onChange={(e) =>
													handleFormChange("external_login_url", e.target.value)
												}
												className="rounded-xl font-mono text-sm"
											/>
											<p className="text-sm text-muted-foreground">
												URL halaman login sistem perusahaan yang akan digunakan
												pelanggan saat menghubungkan akun mereka
											</p>
										</div>

										{/* External Verify URL */}
										<div className="space-y-2">
											<Label
												htmlFor="external_verify_url"
												className="text-sm font-medium flex items-center gap-2">
												<ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
												URL Verifikasi Token
											</Label>
											<Input
												id="external_verify_url"
												placeholder="Contoh: https://external-service.com/api/verify"
												value={integrationForm.external_verify_url}
												onChange={(e) =>
													handleFormChange(
														"external_verify_url",
														e.target.value,
													)
												}
												className="rounded-xl font-mono text-sm"
											/>
											<p className="text-sm text-muted-foreground">
												URL yang digunakan sistem kami untuk memverifikasi akun
												pelanggan pada sistem perusahaan anda
											</p>
										</div>

										{/* External Check Membership URL */}
										<div className="space-y-2">
											<Label
												htmlFor="external_check_membership_url"
												className="text-sm font-medium flex items-center gap-2">
												<Link2 className="w-3.5 h-3.5 text-muted-foreground" />
												URL Cek Keanggotaan
											</Label>
											<Input
												id="external_check_membership_url"
												placeholder="Contoh: https://external-service.com/api/membership"
												value={integrationForm.external_check_membership_url}
												onChange={(e) =>
													handleFormChange(
														"external_check_membership_url",
														e.target.value,
													)
												}
												className="rounded-xl font-mono text-sm"
											/>
											<p className="text-sm text-muted-foreground">
												URL yang digunakan untuk memeriksa status membership
												atau keanggotaan pelanggan pada sistem perusahaan anda
											</p>
										</div>

										{/* Secret Key */}
										<div className="space-y-2">
											<Label
												htmlFor="secret_key"
												className="text-sm font-medium flex items-center gap-2">
												<KeyRound className="w-3.5 h-3.5 text-muted-foreground" />
												Secret Key
											</Label>
											<Input
												id="secret_key"
												type="password"
												placeholder="••••••••••••••••"
												value={integrationForm.secret_key}
												onChange={(e) =>
													handleFormChange("secret_key", e.target.value)
												}
												className="rounded-xl font-mono text-sm"
											/>
											<p className="text-sm text-muted-foreground">
												Kunci rahasia yang digunakan untuk mengamankan
												komunikasi antara sistem perusahaan anda dan platform
												kami
											</p>
										</div>

										{/* Save Button */}
										<div className="flex justify-end pt-2">
											<Button
												onClick={handleSaveIntegration}
												disabled={configSubmitting || !isDirty}
												size="sm"
												className="rounded-xl gap-2 py-5 hover:cursor-pointer">
												{configSubmitting ?
													<>
														<Loader2 className="w-3.5 h-3.5 animate-spin" />
														Menyimpan...
													</>
												:	<>
														<Save className="w-3.5 h-3.5" />
														Simpan Konfigurasi
													</>
												}
											</Button>
										</div>
									</>
								}
							</div>
						)}
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
							<AlertDialogCancel
								disabled={faqSubmitting}
								className="rounded-xl">
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

				{/* ── Dialog: Konfirmasi Toggle Integrasi ── */}
				<AlertDialog
					open={openIntegrationToggleConfirm}
					onOpenChange={setOpenIntegrationToggleConfirm}>
					<AlertDialogContent className="rounded-2xl">
						<AlertDialogHeader>
							<AlertDialogTitle>
								{isIntegrationActive ?
									"Nonaktifkan Integrasi Sistem?"
								:	"Aktifkan Integrasi Sistem?"}
							</AlertDialogTitle>
							<AlertDialogDescription className="leading-relaxed">
								{isIntegrationActive ?
									"Integrasi akan dinonaktifkan. Fitur pairing dan koneksi ke sistem eksternal akan terhenti."
								:	"Integrasi akan diaktifkan. Sistem ini akan terhubung dengan layanan eksternal sesuai konfigurasi yang telah diatur."
								}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel
								disabled={configSubmitting}
								className="rounded-xl">
								Batal
							</AlertDialogCancel>
							<AlertDialogAction
								disabled={configSubmitting}
								onClick={handleConfirmToggleIntegration}
								className={`rounded-xl ${
									isIntegrationActive ?
										"bg-destructive hover:bg-destructive/90 text-white"
									:	"bg-emerald-600 hover:bg-emerald-700 text-white"
								}`}>
								{configSubmitting ?
									"Memproses..."
								: isIntegrationActive ?
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
