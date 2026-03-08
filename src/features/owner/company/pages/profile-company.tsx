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
	LayoutDashboard,
	Users2,
} from "lucide-react";
import { useCompanyProfile, useUpdateCompany } from "../hooks/companyHooks";

// Components
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// ── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
	icon: React.ReactNode;
	label: string;
	value: string | number;
	accent?: string;
}
const StatCard = ({
	icon,
	label,
	value,
	accent = "bg-primary/10 text-primary border-primary/20",
}: StatCardProps) => (
	<Card className="shadow-none flex flex-col justify-between overflow-hidden relative">
		<CardContent className="p-5">
			<div className="flex justify-between items-start mb-4">
				<p className="text-sm text-muted-foreground font-medium">{label}</p>
				<div className={`p-2 rounded-lg ${accent}`}>{icon}</div>
			</div>
			<p className="text-3xl font-bold tracking-tight">{value}</p>
		</CardContent>
	</Card>
);

// ── Member Card ──────────────────────────────────────────────────────────────
const MemberCard = ({
	user,
	badge,
	accent = "bg-primary/10 text-primary",
}: {
	user: { _id: string; name: string; email: string };
	badge?: string;
	accent?: string;
}) => (
	<div className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
		<Avatar className="h-10 w-10 border">
			<AvatarFallback className={`${accent} text-sm font-semibold`}>
				{user.name.slice(0, 2).toUpperCase()}
			</AvatarFallback>
		</Avatar>
		<div className="flex-1 min-w-0">
			<div className="flex items-center justify-between gap-2">
				<p className="text-sm font-semibold truncate">{user.name}</p>
				{badge && (
					<Badge
						variant="secondary"
						className="text-[10px] px-1.5 h-5 shrink-0">
						{badge}
					</Badge>
				)}
			</div>
			<p className="text-xs text-muted-foreground truncate">{user.email}</p>
		</div>
	</div>
);

// ── Info Item ────────────────────────────────────────────────────────────────
const InfoItem = ({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: React.ReactNode;
}) => (
	<div className="space-y-1">
		<div className="flex items-center gap-2 text-muted-foreground">
			{icon}
			<p className="text-xs font-medium uppercase tracking-wider">{label}</p>
		</div>
		<div className="text-sm font-medium pl-6">{value}</div>
	</div>
);

// ── Main Page ────────────────────────────────────────────────────────────────
const ProfileCompany = () => {
	const { company, loading, error, refetch } = useCompanyProfile();
	const { updateCompany, loading: updating } = useUpdateCompany(refetch);

	const [openEdit, setOpenEdit] = useState(false);
	const [openToggleConfirm, setOpenToggleConfirm] = useState(false);

	if (loading) return <SectionLoading message="Memuat profil perusahaan.." />;

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
				<div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
					<XCircle className="w-8 h-8 text-destructive" />
				</div>
				<div>
					<p className="font-semibold text-lg">Gagal Memuat Data</p>
					<p className="text-sm text-muted-foreground mt-1">{error}</p>
				</div>
				<Button variant="outline" onClick={refetch} className="gap-2">
					<RefreshCw className="w-4 h-4" />
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
		await updateCompany(String(company._id), {
			name: company.name,
			address: company.address,
			description: company.description ?? "",
			isActive: !company.isActive,
		});
		setOpenToggleConfirm(false);
	};

	return (
		<div className="space-y-6 pb-10">
			{/* ── Header Section ─────────────────────────────────── */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
				<div className="flex items-center gap-4">
					<div className="flex size-14 items-center justify-center rounded-xl bg-primary shadow-sm">
						<Building2 className="size-7 text-primary-foreground" />
					</div>
					<div>
						<div className="flex items-center gap-2.5 mb-1">
							<h1 className="text-2xl font-bold tracking-tight">
								{company.name}
							</h1>
							<Badge
								variant={company.isActive ? "default" : "destructive"}
								className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
									company.isActive ?
										"bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
									:	"bg-red-100 text-red-800 hover:bg-red-200"
								}`}>
								{company.isActive ? "Aktif" : "Non-Aktif"}
							</Badge>
						</div>
						<p className="text-sm text-muted-foreground">
							Kelola informasi dan anggota tim perusahaan Anda.
						</p>
					</div>
				</div>
				<Button className="gap-2" onClick={() => setOpenEdit(true)}>
					<Pencil className="w-4 h-4" />
					Edit Profil
				</Button>
			</div>

			<Tabs defaultValue="overview" className="space-y-6">
				{/* ── Tabs Navigation ────────────────────────────────── */}
				<TabsList className="bg-background border h-auto p-1 max-w-full justify-start overflow-x-auto overflow-y-hidden">
					<TabsTrigger
						value="overview"
						className="gap-2 px-4 py-2 data-[state=active]:bg-muted/60 data-[state=active]:shadow-none rounded-md">
						<LayoutDashboard className="w-4 h-4" />
						Ringkasan
					</TabsTrigger>
					<TabsTrigger
						value="members"
						className="gap-2 px-4 py-2 data-[state=active]:bg-muted/60 data-[state=active]:shadow-none rounded-md">
						<Users2 className="w-4 h-4" />
						Anggota Tim
					</TabsTrigger>
				</TabsList>

				{/* ── Tab: Overview ──────────────────────────────────── */}
				<TabsContent value="overview" className="outline-none space-y-6">
					{/* Stats Grid */}
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						<StatCard
							icon={<Users className="w-4 h-4" />}
							label="Karyawan"
							value={company.staffs?.length ?? 0}
							accent="bg-blue-100 text-blue-700"
						/>
						<StatCard
							icon={<UserCheck className="w-4 h-4" />}
							label="Manager"
							value={company.managers?.length ?? 0}
							accent="bg-violet-100 text-violet-700"
						/>
						<StatCard
							icon={<Crown className="w-4 h-4" />}
							label="Pemilik"
							value={company.owner?.name ?? "–"}
							accent="bg-amber-100 text-amber-700"
						/>
						<StatCard
							icon={<Calendar className="w-4 h-4" />}
							label="Bergabung"
							value={formatDate(company.createdAt).split(" ")[2] ?? "–"}
							accent="bg-emerald-100 text-emerald-700"
						/>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Detail Card */}
						<Card className="lg:col-span-2 shadow-sm">
							<CardContent className="p-6 sm:p-8 space-y-8">
								<div className="space-y-4">
									<h2 className="text-lg font-semibold border-b pb-2">
										Tentang Perusahaan
									</h2>
									<p className="text-sm leading-relaxed text-muted-foreground">
										{company.description ?
											company.description
										:	"Belum ada deskripsi spesifik tentang perusahaan ini. Anda bisa menambahkannya menggunakan tombol Edit Profil."
										}
									</p>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<InfoItem
										icon={<MapPin className="w-4 h-4" />}
										label="Alamat Lengkap"
										value={
											<span className="text-muted-foreground">
												{company.address || "Belum diatur"}
											</span>
										}
									/>
									<InfoItem
										icon={<Calendar className="w-4 h-4" />}
										label="Terdaftar Sejak"
										value={
											<span className="text-muted-foreground">
												{formatDate(company.createdAt)}
											</span>
										}
									/>
									<div className="md:col-span-2">
										<InfoItem
											icon={<Crown className="w-4 h-4 text-amber-500" />}
											label="Informasi Pemilik"
											value={
												<div className="mt-1 flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
													<Avatar className="h-10 w-10">
														<AvatarFallback className="bg-amber-100 text-amber-700 text-sm font-semibold">
															{company.owner?.name.slice(0, 2).toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<div>
														<p className="text-sm font-semibold">
															{company.owner?.name}
														</p>
														<p className="text-xs text-muted-foreground">
															{company.owner?.email}
														</p>
													</div>
												</div>
											}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Settings Sidebar */}
						<div className="space-y-6">
							<Card className="shadow-sm">
								<CardContent className="p-6">
									<h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
										Pengaturan Status
									</h3>
									<div className="flex items-start justify-between gap-4">
										<div className="space-y-1">
											<p className="text-sm font-medium leading-none">
												Akses Profil
											</p>
											<p className="text-[13px] text-muted-foreground leading-relaxed">
												{company.isActive ?
													"Perusahaan sedang aktif dan dapat menerima pekerjaan."
												:	"Semua operasi pekerjaan terhenti sementara."}
											</p>
										</div>
										<Switch
											checked={company.isActive}
											disabled={updating}
											onCheckedChange={() => setOpenToggleConfirm(true)}
											className="mt-1 data-[state=checked]:bg-emerald-600"
										/>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</TabsContent>

				{/* ── Tab: Members ───────────────────────────────────── */}
				<TabsContent value="members" className="outline-none">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Managers */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-lg font-semibold">Daftar Manager</h2>
									<p className="text-sm text-muted-foreground">
										Mengelola operasional perusahaan
									</p>
								</div>
								<Badge variant="outline" className="text-sm px-2">
									{company.managers?.length ?? 0}
								</Badge>
							</div>
							<div className="space-y-3">
								{company.managers && company.managers.length > 0 ?
									company.managers.map((mgr) => (
										<MemberCard
											key={mgr._id}
											user={mgr}
											badge="Manager"
											accent="bg-violet-100 text-violet-700"
										/>
									))
								:	<div className="p-8 text-center rounded-xl border border-dashed bg-muted/20">
										<UserCheck className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
										<p className="text-sm font-medium">Belum ada Manager</p>
										<p className="text-xs text-muted-foreground mt-1">
											Perusahaan belum memiliki manager aktif
										</p>
									</div>
								}
							</div>
						</div>

						{/* Staffs */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-lg font-semibold">Daftar Karyawan</h2>
									<p className="text-sm text-muted-foreground">
										Staff operasional terdaftar
									</p>
								</div>
								<Badge variant="outline" className="text-sm px-2">
									{company.staffs?.length ?? 0}
								</Badge>
							</div>
							<div className="space-y-3">
								{company.staffs && company.staffs.length > 0 ?
									company.staffs.map((staff) => (
										<MemberCard
											key={staff._id}
											user={staff}
											badge="Staff"
											accent="bg-blue-100 text-blue-700"
										/>
									))
								:	<div className="p-8 text-center rounded-xl border border-dashed bg-muted/20">
										<Users2 className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
										<p className="text-sm font-medium">Belum ada Karyawan</p>
										<p className="text-xs text-muted-foreground mt-1">
											Perusahaan belum memiliki karyawan aktif
										</p>
									</div>
								}
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>

			{/* ── Dialogs ────────────────────────────────────── */}
			<EditCompanyDialog
				open={openEdit}
				onOpenChange={setOpenEdit}
				company={company}
				onSuccess={refetch}
			/>

			<AlertDialog open={openToggleConfirm} onOpenChange={setOpenToggleConfirm}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{company.isActive ?
								"Nonaktifkan Perusahaan?"
							:	"Aktifkan Perusahaan?"}
						</AlertDialogTitle>
						<AlertDialogDescription className="leading-relaxed">
							{company.isActive ?
								"Perusahaan akan dinonaktifkan. Seluruh akses operasional akan terhenti sementara. Pastikan tindakan ini sudah sesuai kebutuhan."
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
	);
};

export default ProfileCompany;
