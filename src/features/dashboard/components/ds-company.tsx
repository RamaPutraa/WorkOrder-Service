import { useGetDashboardCompany } from "../services/dashboard-queries";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

// ─── RADIAL CHART STACKED (Formulir / Layanan / Departemen) ──────────────────
const RadialChartCard = ({
	title,
	active,
	inActive,
	total,
}: {
	title: string;
	active: number;
	inActive: number;
	total: number;
}) => {
	const chartConfig = {
		active: { label: "Aktif", color: "#2563eb" },
		inActive: { label: "Nonaktif", color: "#93c5fd" },
	} satisfies ChartConfig;

	const chartData = [{ active, inActive }];

	return (
		<Card className="border-border/50 shadow-sm flex flex-col h-full">
			<CardHeader className="pb-1 pt-4 px-5">
				<CardTitle className="text-sm font-semibold">{title}</CardTitle>
				<CardDescription className="text-xs">Aktif & Nonaktif</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-1 items-center justify-center pb-0 px-3">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square w-full max-w-[220px]">
					<RadialBarChart
						data={chartData}
						endAngle={180}
						innerRadius={75}
						outerRadius={105}>
						<RadialBar
							dataKey="inActive"
							fill="var(--color-inActive)"
							stackId="a"
							cornerRadius={5}
							className="stroke-transparent stroke-2"
						/>
						<RadialBar
							dataKey="active"
							stackId="a"
							cornerRadius={5}
							fill="var(--color-active)"
							className="stroke-transparent stroke-2"
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) - 12}
													fontSize={24}
													fontWeight={700}
													className="fill-foreground">
													{total.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 6}
													fontSize={11}
													className="fill-muted-foreground">
													Total
												</tspan>
											</text>
										);
									}
								}}
							/>
						</PolarRadiusAxis>
					</RadialBarChart>
				</ChartContainer>
			</CardContent>

			<CardFooter className="flex items-center justify-center gap-5 text-xs text-muted-foreground pt-2 pb-4 px-5">
				<div className="flex items-center gap-1.5">
					<span className="inline-block w-2.5 h-2.5 rounded-full bg-[#2563eb] shrink-0" />
					<span>Aktif</span>
					<span className="font-semibold text-foreground ml-1">{active}</span>
				</div>
				<div className="flex items-center gap-1.5">
					<span className="inline-block w-2.5 h-2.5 rounded-full bg-[#93c5fd] shrink-0" />
					<span>Nonaktif</span>
					<span className="font-semibold text-foreground ml-1">{inActive}</span>
				</div>
			</CardFooter>
		</Card>
	);
};

// ─── EMPLOYEE STACKED CHART (4 ring lapis) ────────────────────────────────────
const EmployeeStackedChartCard = ({
	active,
	inActive,
	managers,
	staffs,
	total,
}: {
	active: number;
	inActive: number;
	managers: number;
	staffs: number;
	total: number;
}) => {
	const chartConfig = {
		managers: { label: "Manajer", color: "#1e40af" },
		staffs: { label: "Staff", color: "#3b82f6" },
		active: { label: "Aktif", color: "#60a5fa" },
		inActive: { label: "Nonaktif", color: "#bfdbfe" },
	} satisfies ChartConfig;

	const chartData = [
		{ role: "inActive", jumlah: inActive, fill: "var(--color-inActive)" },
		{ role: "active", jumlah: active, fill: "var(--color-active)" },
		{ role: "staffs", jumlah: staffs, fill: "var(--color-staffs)" },
		{ role: "managers", jumlah: managers, fill: "var(--color-managers)" },
	];

	return (
		<Card className="border-border/50 shadow-sm flex flex-col h-full">
			<CardHeader className="pb-1 pt-4 px-5">
				<CardTitle className="text-sm font-semibold">
					Status & Peran Karyawan
				</CardTitle>
				<CardDescription className="text-xs">
					Aktif, Nonaktif, Manajer & Staff
				</CardDescription>
			</CardHeader>

			<CardContent className="flex items-center justify-center pb-0 px-3">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square w-full max-h-[190px]">
					<RadialBarChart
						data={chartData}
						innerRadius={28}
						outerRadius={98}
						barSize={12}>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<RadialBar
							dataKey="jumlah"
							background={{ fill: "hsl(var(--muted))" }}
							cornerRadius={8}
						/>
						<PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle">
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) - 6}
													fontSize={18}
													fontWeight={700}
													className="fill-foreground">
													{total.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 10}
													fontSize={10}
													className="fill-muted-foreground">
													Total
												</tspan>
											</text>
										);
									}
								}}
							/>
						</PolarRadiusAxis>
					</RadialBarChart>
				</ChartContainer>
			</CardContent>

			<CardFooter className="flex flex-col gap-1.5 pt-2 pb-4 px-5">
				<div className="flex items-center justify-center gap-5 text-xs text-muted-foreground">
					<div className="flex items-center gap-1.5">
						<span className="inline-block w-2 h-2 rounded-full bg-[#60a5fa] shrink-0" />
						<span>Aktif</span>
						<span className="font-semibold text-foreground ml-1">{active}</span>
					</div>
					<div className="flex items-center gap-1.5">
						<span className="inline-block w-2 h-2 rounded-full bg-[#bfdbfe] shrink-0" />
						<span>Nonaktif</span>
						<span className="font-semibold text-foreground ml-1">
							{inActive}
						</span>
					</div>
				</div>
				<div className="flex items-center justify-center gap-5 text-xs text-muted-foreground">
					<div className="flex items-center gap-1.5">
						<span className="inline-block w-2 h-2 rounded-full bg-[#1e40af] shrink-0" />
						<span>Manajer</span>
						<span className="font-semibold text-foreground ml-1">
							{managers}
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<span className="inline-block w-2 h-2 rounded-full bg-[#3b82f6] shrink-0" />
						<span>Staff</span>
						<span className="font-semibold text-foreground ml-1">{staffs}</span>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
};

// ─── KOMPONEN UTAMA ───────────────────────────────────────────────────────────
const DsCompany = () => {
	const { data, isLoading } = useGetDashboardCompany();

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<Skeleton className="h-12 w-12 rounded-xl" />
					<div className="space-y-1.5">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-3 w-48" />
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{[...Array(4)].map((_, i) => (
						<Skeleton key={i} className="h-72 w-full rounded-xl" />
					))}
				</div>
			</div>
		);
	}

	const stat = data?.data;
	// const stat = {
	// 	forms_stat: { active: 10, inActive: 5, total: 15 },
	// 	services_stat: { active: 8, inActive: 2, total: 10 },
	// 	positions_stat: { active: 25, inActive: 5, total: 30 },
	// 	employees_stat: {
	// 		active: 100,
	// 		inActive: 20,
	// 		total: 120,
	// 		managers_count: 10,
	// 		staffs_count: 110,
	// 	},
	// };
	if (!stat) return null;

	return (
		<div className="space-y-4">
			{/* ── Header ── */}
			<div className="flex items-center gap-2">
				<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 shadow-sm shrink-0">
					<Building2 className="h-6 w-6 text-primary" />
				</div>
				<div>
					<h2 className="text-lg font-semibold tracking-tight">
						Data Perusahaan
					</h2>
					<p className="text-xs text-muted-foreground">
						Statistik aktif & nonaktif per kategori
					</p>
				</div>
			</div>

			{/* ── Grid 4 Kolom Radial Charts ── */}
			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
				<RadialChartCard
					title="Statistik Formulir"
					active={stat.forms_stat.active}
					inActive={stat.forms_stat.inActive}
					total={stat.forms_stat.total}
				/>
				<RadialChartCard
					title="Statistik Layanan"
					active={stat.services_stat.active}
					inActive={stat.services_stat.inActive}
					total={stat.services_stat.total}
				/>
				<RadialChartCard
					title="Statistik Departemen"
					active={stat.positions_stat.active}
					inActive={stat.positions_stat.inActive}
					total={stat.positions_stat.total}
				/>
				<EmployeeStackedChartCard
					active={stat.employees_stat.active}
					inActive={stat.employees_stat.inActive}
					managers={stat.employees_stat.managers_count}
					staffs={stat.employees_stat.staffs_count}
					total={stat.employees_stat.total}
				/>
			</div>
		</div>
	);
};

export default DsCompany;
