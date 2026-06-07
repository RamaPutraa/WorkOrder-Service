import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Building2,
	Calendar,
	Mail,
	ShieldCheck,
	User,
	UserX,
	Briefcase,
} from "lucide-react";
import PageHeader from "@/shared/atoms/header-content";
import { LoadingState } from "@/shared/atoms/loading-state";
import ErrorPage from "@/shared/errors/templates/error-page";
import { useDetailStaff } from "../hooks/use-detail-staff";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/store/dialogStore";
import { Badge } from "@/components/ui/badge";

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string | null) => {
	if (!dateStr) return "-";
	return new Date(dateStr).toLocaleDateString("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

const roleLabel: Record<string, string> = {
	staff_company: "Pegawai Perusahaan",
	manager_company: "Manager Perusahaan",
	owner_company: "Owner Perusahaan",
	staff_unassigned: "Unassigned",
};

const roleColor: Record<string, string> = {
	staff_company: "bg-blue-50 text-blue-700 border-blue-200",
	manager_company: "bg-violet-50 text-violet-700 border-violet-200",
	owner_company: "bg-amber-50 text-amber-700 border-amber-200",
	staff_unassigned: "bg-slate-50 text-slate-600 border-slate-200",
};

// ── Component ─────────────────────────────────────────────────────────────────

const DetailStaff = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { employee, canKick, loading, error, fetchDetailEmployee, kickEmployee } =
		useDetailStaff();
	const { showDialog } = useDialogStore();

	useEffect(() => {
		if (id) void fetchDetailEmployee(id);
	}, [id, fetchDetailEmployee]);

	const handleKick = () => {
		if (!employee || !id) return;
		showDialog({
			title: "Keluarkan Pegawai",
			description: `Apakah Anda yakin ingin mengeluarkan "${employee.name}" dari perusahaan? Tindakan ini tidak dapat dibatalkan.`,
			confirmText: "Keluarkan",
			cancelText: "Batal",
			onConfirm: async () => {
				const success = await kickEmployee(employee.email);
				if (success) {
					navigate(-1);
				}
			},
		});
	};

	if (error) return <ErrorPage />;

	return (
		<div className="space-y-6 pb-8">
			{/* ── Header ── */}
			<PageHeader
				title={
					loading ? "Memuat detail..." : (employee?.name ?? "Detail Pegawai")
				}
				subtitle={
					loading ? undefined : (employee?.email ?? "Informasi pegawai")
				}
				backPath={true}
				actionButtons={
					!loading && employee && canKick ? (
						<Button
							onClick={handleKick}
							className="bg-red-600 hover:bg-red-700 text-white hover:cursor-pointer flex items-center gap-2 rounded-xl h-10 px-4 text-sm font-semibold shadow-sm md:w-auto w-full active:scale-95 transition-all">
							<UserX className="w-4 h-4" />
							Keluarkan Pegawai
						</Button>
					) : undefined
				}
			/>

			{loading ? (
				<LoadingState
					variant="inline"
					size="lg"
					message="Memuat detail pegawai..."
				/>
			) : employee ? (
				<>
					{/* ── Info Cards ── */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
						{/* Role */}
						<div className="flex items-center gap-3 p-4 rounded-2xl border bg-white shadow-sm">
							<div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
								<ShieldCheck className="w-4.5 h-4.5 text-violet-600" />
							</div>
							<div className="min-w-0">
								<p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
									Role
								</p>
								<p className="text-sm font-bold text-slate-900 mt-0.5">
									{roleLabel[employee.role] ?? employee.role}
								</p>
							</div>
						</div>

						{/* Posisi / Departemen */}
						<div className="flex items-center gap-3 p-4 rounded-2xl border bg-white shadow-sm">
							<div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
								<Briefcase className="w-4.5 h-4.5 text-primary" />
							</div>
							<div className="min-w-0">
								<p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
									Departemen
								</p>
								<p className="text-sm font-bold text-slate-900 mt-0.5">
									{employee.position?.name ?? "-"}
								</p>
							</div>
						</div>

						{/* Bergabung */}
						<div className="flex items-center gap-3 p-4 rounded-2xl border bg-white shadow-sm">
							<div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
								<Calendar className="w-4.5 h-4.5 text-sky-500" />
							</div>
							<div className="min-w-0">
								<p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
									Bergabung
								</p>
								<p className="text-sm font-bold text-slate-900 mt-0.5">
									{formatDate(employee.createdAt)}
								</p>
							</div>
						</div>

						{/* Diperbarui */}
						<div className="flex items-center gap-3 p-4 rounded-2xl border bg-white shadow-sm">
							<div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
								<Building2 className="w-4.5 h-4.5 text-orange-500" />
							</div>
							<div className="min-w-0">
								<p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
									Diperbarui
								</p>
								<p className="text-sm font-bold text-slate-900 mt-0.5">
									{formatDate(employee.updatedAt)}
								</p>
							</div>
						</div>
					</div>

					{/* ── Detail Card ── */}
					<div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
						<div className="px-6 py-5 border-b bg-muted/20">
							<h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
								<User className="w-4.5 h-4.5 text-muted-foreground" />
								Informasi Pegawai
							</h2>
							<p className="text-sm text-muted-foreground mt-1">
								Detail lengkap data pegawai
							</p>
						</div>

						<div className="p-6 space-y-5">
							{/* Nama */}
							<div className="flex items-start gap-4">
								<div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
									<span className="text-lg font-bold text-primary">
										{employee.name.charAt(0).toUpperCase()}
									</span>
								</div>
								<div>
									<p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
										Nama Lengkap
									</p>
									<p className="text-base font-semibold text-slate-900 mt-0.5">
										{employee.name}
									</p>
								</div>
							</div>

							<hr className="border-slate-100" />

							{/* Email */}
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
									<Mail className="w-4 h-4 text-sky-500" />
								</div>
								<div>
									<p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
										Email
									</p>
									<p className="text-sm font-medium text-slate-700 mt-0.5">
										{employee.email}
									</p>
								</div>
							</div>

							<hr className="border-slate-100" />

							{/* Role */}
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
									<ShieldCheck className="w-4 h-4 text-violet-600" />
								</div>
								<div>
									<p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
										Role
									</p>
									<Badge
										variant="outline"
										className={`mt-1 rounded-full text-xs font-semibold ${roleColor[employee.role] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
										{roleLabel[employee.role] ?? employee.role}
									</Badge>
								</div>
							</div>

							<hr className="border-slate-100" />

							{/* Departemen */}
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
									<Briefcase className="w-4 h-4 text-primary" />
								</div>
								<div>
									<p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
										Departemen
									</p>
									<p className="text-sm font-medium text-slate-700 mt-0.5">
										{employee.position ? (
											<span>{employee.position.name}</span>
										) : (
											<span className="text-muted-foreground italic">Belum ditentukan</span>
										)}
									</p>
								</div>
							</div>
						</div>
					</div>
				</>
			) : null}
		</div>
	);
};

export default DetailStaff;