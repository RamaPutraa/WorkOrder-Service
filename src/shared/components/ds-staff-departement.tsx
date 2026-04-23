import { useEffect, useState } from "react";
import {
	CheckCircle2,
	Clock,
	ClipboardList,
	User2,
	Briefcase,
	Building2,
	Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCompanyEmployees } from "@/features/owner/staff-master/services/staff-service";
import { getPositionsApi } from "@/features/owner/position/services/positionService";
import { handleApi } from "@/lib/handle-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const DsStaffDepartement = () => {
	const navigate = useNavigate();
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [positions, setPositions] = useState<Position[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const [empRes, posRes] = await Promise.all([
				handleApi(() => getCompanyEmployees()),
				handleApi(() => getPositionsApi()),
			]);

			if (!empRes.error && empRes.data) {
				setEmployees(empRes.data.data ?? []);
			}

			if (!posRes.error && posRes.data) {
				setPositions(posRes.data.data ?? []);
			}
			setLoading(false);
		};

		void fetchData();
	}, []);

	// Hitung Statistik Pegawai
	const totalEmployees = employees.length;
	const totalManagers = employees.filter(
		(e) => e.role === "manager_company",
	).length;
	const totalStaff = employees.filter((e) => e.role === "staff_company").length;

	// Hitung Statistik Departemen
	const activePositions = positions.filter((p) => p.isActive).length;
	const inactivePositions = positions.filter((p) => !p.isActive).length;

	const statCards = [
		{
			label: "Total Sumber Daya Manusia",
			value: loading ? "0" : totalEmployees.toString(),
			icon: ClipboardList,
		},
		{
			label: "Manager Perusahaan",
			value: loading ? "0" : totalManagers.toString(),
			icon: CheckCircle2,
		},
		{
			label: "Pegawai Perusahaan",
			value: loading ? "0" : totalStaff.toString(),
			icon: Clock,
		},
	];

	const statDepartement = [
		{
			label: "Aktif",
			value: loading ? "0" : activePositions.toString(),
			icon: Briefcase,
		},
		{
			label: "Tidak Aktif",
			value: loading ? "0" : inactivePositions.toString(),
			icon: Briefcase,
		},
	];

	return (
		<>
			<div className="grid gap-7 sm:grid-cols-2">
				{/* ── Pegawai Section ────────────────────────────────────────────────── */}
				<div className="space-y-2">
					<div className="grid grid-cols-1 gap-3 pb-4 sm:grid-cols-3">
						{statCards.map((stat) => (
							<div
								key={stat.label}
								className="shadow-xs relative overflow-hidden rounded-lg bg-muted border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
								<div className="p-1.5">
									<div className="flex items-start justify-between p-2">
										<div className="space-y-1">
											<p className="text-sm font-medium text-muted-foreground leading-tight">
												{stat.label}
											</p>
										</div>
										<stat.icon className="h-4 w-4 text-muted-foreground" />
									</div>
									<div className="bg-white rounded-lg px-2 pt-5">
										{loading ?
											<Skeleton className="h-8 w-12 mb-1" />
										:	<p className="text-2xl font-bold">{stat.value}</p>}
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Custom List Pegawai */}
					<div className="w-full bg-muted border shadow-sm rounded-lg flex flex-col h-[350px]">
						<div className="p-4  flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="p-1.5 bg-primary/10 rounded-md text-primary">
									<User2 className="h-4 w-4" />
								</div>
								<div>
									<h3 className="text-sm font-semibold text-foreground">
										Daftar Nama Pegawai
									</h3>
									<p className="text-xs text-muted-foreground mt-0.5">
										{totalEmployees} Anggota tim terdaftar
									</p>
								</div>
							</div>
						</div>

						<div className="p-3 overflow-y-auto flex-1 space-y-2 bg-white border rounded-xl mx-2 mb-2">
							{loading ?
								Array.from({ length: 4 }).map((_, i) => (
									<div
										key={i}
										className="flex items-center gap-3 p-2 border rounded-lg">
										<Skeleton className="h-10 w-10 rounded-full shrink-0" />
										<div className="space-y-2 flex-1">
											<Skeleton className="h-4 w-1/2" />
											<Skeleton className="h-3 w-1/3" />
										</div>
									</div>
								))
							: employees.length === 0 ?
								<div className="flex flex-col items-center justify-center h-full text-muted-foreground">
									<User2 className="h-8 w-8 mb-2 opacity-20" />
									<p className="text-sm">Belum ada pegawai terdaftar</p>
								</div>
							:	employees.slice(0, 5).map((emp) => (
									<div
										key={emp._id}
										className="group flex items-center gap-3 p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all duration-200">
										<div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase">
											{emp.name.charAt(0)}
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex justify-between items-start mb-0.5">
												<h4 className="text-sm font-semibold text-slate-800 truncate pr-2">
													{emp.name}
												</h4>
												<Badge
													variant={
														emp.role === "manager_company" ?
															"default"
														:	"secondary"
													}
													className="text-xs px-1.5 py-0 capitalize shrink-0">
													{emp.role === "manager_company" ?
														"Manager Perusahaan"
													:	"Pegawai Perusahaan"}
												</Badge>
											</div>
											<div className="flex items-center gap-3 text-xs text-slate-500">
												<span className="flex items-center gap-1 truncate">
													<Mail className="h-3 w-3" />
													<span className="truncate">{emp.email}</span>
												</span>
											</div>
										</div>
									</div>
								))
							}
						</div>

						{/* Redirect Footer Pegawai */}
						<div className="border-t p-2 text-center bg-muted/20">
							<button
								onClick={() => navigate("/dashboard/internal/staff")}
								className="text-xs font-medium text-primary hover:underline">
								Kelola Data Pegawai →
							</button>
						</div>
					</div>
				</div>

				{/* ── Departemen Section ──────────────────────────────────────────────── */}
				<div className="space-y-2">
					<div className="grid grid-cols-1 gap-3 pb-4 sm:grid-cols-2 ">
						{statDepartement.map((stat) => (
							<div
								key={stat.label}
								className="shadow-xs relative overflow-hidden rounded-lg bg-muted border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
								<div className="p-1.5">
									<div className="flex items-start justify-between p-2">
										<div className="space-y-1">
											<p className="text-sm font-medium text-muted-foreground leading-tight">
												{stat.label}
											</p>
										</div>
										<stat.icon className="h-4 w-4 text-muted-foreground" />
									</div>
									<div className="bg-white rounded-lg px-2 pt-5">
										{loading ?
											<Skeleton className="h-8 w-12 mb-1" />
										:	<p className="text-2xl font-bold">{stat.value}</p>}
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Custom List Departemen */}
					<div className="w-full bg-muted border shadow-sm rounded-lg flex flex-col h-[350px]">
						<div className="p-4  flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="p-1.5 bg-primary/10 rounded-md text-primary">
									<Building2 className="h-4 w-4" />
								</div>
								<div>
									<h3 className="text-sm font-semibold text-foreground">
										Daftar Departemen
									</h3>
									<p className="text-xs text-muted-foreground mt-0.5">
										{positions.length} Departemen / Posisi terdaftar
									</p>
								</div>
							</div>
						</div>

						<div className="p-3 overflow-y-auto flex-1 space-y-2 bg-white border rounded-xl mx-2 mb-2">
							{loading ?
								Array.from({ length: 4 }).map((_, i) => (
									<div
										key={i}
										className="flex items-center gap-3 p-3 border rounded-lg">
										<Skeleton className="h-10 w-10 rounded-md shrink-0" />
										<div className="space-y-2 flex-1">
											<Skeleton className="h-4 w-1/3" />
											<Skeleton className="h-3 w-1/2" />
										</div>
									</div>
								))
							: positions.length === 0 ?
								<div className="flex flex-col items-center justify-center h-full text-muted-foreground">
									<Building2 className="h-8 w-8 mb-2 opacity-20" />
									<p className="text-sm">Belum ada departemen terdaftar</p>
								</div>
							:	positions.slice(0, 5).map((pos) => (
									<div
										key={pos._id}
										className="group flex items-start gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all duration-200">
										<div className="h-9 w-9 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
											<Briefcase className="h-4 w-4" />
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex justify-between items-center mb-1">
												<h4 className="text-sm font-bold text-slate-800 truncate pr-2">
													{pos.name}
												</h4>
												<Badge
													variant="outline"
													className={`text-xs px-1.5 py-0 capitalize shrink-0 ${
														pos.isActive ?
															"bg-emerald-50 text-emerald-600 border-emerald-200"
														:	"bg-rose-50 text-rose-600 border-rose-200"
													}`}>
													{pos.isActive ? "Aktif" : "Non-Aktif"}
												</Badge>
											</div>
											<p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
												{pos.description || "Tidak ada deskripsi."}
											</p>
										</div>
									</div>
								))
							}
						</div>

						{/* Redirect Footer Departemen */}
						<div className="border-t p-2 text-center bg-muted/20">
							<button
								onClick={() => navigate("/dashboard/internal/positions")}
								className="text-xs font-medium text-primary hover:underline">
								Kelola Data Departemen →
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DsStaffDepartement;
