import { useState } from "react";
import { useGetDashboardSR } from "../services/dashboard-queries";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { FileQuestion, TrendingUp } from "lucide-react";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Bar,
	BarChart,
	CartesianGrid,
	XAxis,
	Pie,
	PieChart,
	Label,
	LabelList,
} from "recharts";

// ── Chart configs ────────────────────────────────────────────────────────────

const barChartConfig: ChartConfig = {
	jumlah: {
		label: "Jumlah",
		color: "hsl(var(--chart-1))",
	},
};

const pieChartConfig: ChartConfig = {
	received: { label: "Diterima", color: "#93c5fd" },
	approved: { label: "Disetujui", color: "#60a5fa" },
	on_progress: { label: "Sedang Dikerjakan", color: "#3b82f6" },
	partial_completed: { label: "Sebagian Selesai", color: "#2563eb" },
	completed: { label: "Selesai", color: "#1d4ed8" },
	closed: { label: "Ditutup", color: "#1e40af" },
	rejected: { label: "Ditolak", color: "#818cf8" },
	cancelled: { label: "Dibatalkan", color: "#4f46e5" },
	unprocessable: { label: "Tidak Dapat Diproses", color: "#312e81" },
};

// ── Label mapping ─────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
	received: "Diterima",
	approved: "Disetujui",
	on_progress: "Sedang Dikerjakan",
	partial_completed: "Sebagian Selesai",
	completed: "Selesai",
	closed: "Ditutup",
	rejected: "Ditolak",
	cancelled: "Dibatalkan",
	unprocessable: "Tidak Diproses",
};

const PERIOD_LABELS: Record<string, string> = {
	current_day: "Hari Ini",
	current_week: "Minggu Ini",
	current_month: "Bulan Ini",
	current_year: "Tahun Ini",
};

// ── Helper: warna per status ──────────────────────────────────────────────────

const STATUS_FILL: Record<string, string> = {
	received: "#93c5fd",
	approved: "#60a5fa",
	on_progress: "#3b82f6",
	partial_completed: "#2563eb",
	completed: "#1d4ed8",
	closed: "#1e40af",
	rejected: "#818cf8",
	cancelled: "#4f46e5",
	unprocessable: "#312e81",
};

// ── Component ─────────────────────────────────────────────────────────────────

const DsServiceRequest = () => {
	const [period, setPeriod] = useState("current_day");
	const { data, isLoading } = useGetDashboardSR(period);

	// MOCK DATA SEMENTARA
	// const isLoading = false;
	// const data = {
	// 	data: {
	// 		total_count: 220,
	// 		status_count: {
	// 			received: 15,
	// 			approved: 25,
	// 			on_progress: 40,
	// 			partial_completed: 10,
	// 			completed: 85,
	// 			closed: 30,
	// 			rejected: 8,
	// 			cancelled: 5,
	// 			unprocessable: 80,
	// 		},
	// 	},
	// };

	// BarChart data — all 9 statuses
	const barData =
		data?.data ?
			(
				Object.entries(data.data.status_count) as [
					keyof typeof data.data.status_count,
					number,
				][]
			).map(([key, value]) => ({
				status: STATUS_LABELS[key] ?? key,
				jumlah: value,
			}))
		:	[];

	// PieChart data — filter out zero
	const pieData =
		data?.data ?
			(
				Object.entries(data.data.status_count) as [
					keyof typeof data.data.status_count,
					number,
				][]
			)
				.map(([key, value]) => ({
					name: key,
					label: STATUS_LABELS[key] ?? key,
					value,
					fill: STATUS_FILL[key] ?? "hsl(var(--chart-1))",
				}))
				.filter((d) => d.value > 0)
		:	[];

	const total = data?.data?.total_count ?? 0;

	return (
		<div className="space-y-4">
			{/* ── Header ── */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 shadow-sm">
						<FileQuestion className="h-6 w-6 text-primary" />
					</div>
					<div>
						<h2 className="text-lg font-semibold tracking-tight">
							Permintaan Layanan
						</h2>
						<p className="text-xs text-muted-foreground">
							Statistik berdasarkan periode
						</p>
					</div>
				</div>
				<Select value={period} onValueChange={setPeriod}>
					<SelectTrigger className="w-[160px] h-8 text-xs">
						<SelectValue placeholder="Pilih Periode" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="current_day">Hari Ini</SelectItem>
						<SelectItem value="current_week">Minggu Ini</SelectItem>
						<SelectItem value="current_month">Bulan Ini</SelectItem>
						<SelectItem value="current_year">Tahun Ini</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* ── Content ── */}
			{isLoading ?
				<div className="space-y-4">
					<div className="grid gap-4 md:grid-cols-[1fr_280px]">
						<Skeleton className="h-72 w-full rounded-xl" />
						<Skeleton className="h-72 w-full rounded-xl" />
					</div>
				</div>
			: data?.data ?
				<div className="flex flex-col gap-4">
					{/* ── MOBILE: Donut chart di atas ── */}
					<div className="md:hidden">
						<Card className="border-none shadow-sm flex flex-col">
							<CardHeader className="pb-0 pt-4 px-5">
								<CardTitle className="text-sm font-semibold">
									Kontribusi Status
								</CardTitle>
								<CardDescription className="text-xs">
									{PERIOD_LABELS[period]}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-1 flex items-center justify-center pb-0 pt-2">
								{pieData.length > 0 ?
									<ChartContainer
										config={pieChartConfig}
										className="h-[180px] w-full max-w-[320px] mx-auto">
										<PieChart>
											<ChartTooltip
												cursor={false}
												content={
													<ChartTooltipContent
														hideLabel
														formatter={(value, _name, props) => (
															<div className="flex items-center gap-1.5 min-w-[140px]">
																<span
																	className="h-2.5 w-2.5 rounded-full shrink-0"
																	style={{ background: props.payload.fill }}
																/>
																<span className="text-muted-foreground">
																	{props.payload.label}
																</span>
																<span className="ml-auto font-semibold tabular-nums">
																	{value}
																</span>
															</div>
														)}
													/>
												}
											/>
											<Pie
												data={pieData}
												dataKey="value"
												nameKey="name"
												cx="50%"
												cy="50%"
												innerRadius={55}
												outerRadius={80}
												strokeWidth={2}>
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
																		y={(viewBox.cy ?? 0) - 6}
																		className="fill-foreground text-2xl font-bold"
																		fontSize={24}
																		fontWeight={700}>
																		{total}
																	</tspan>
																	<tspan
																		x={viewBox.cx}
																		y={(viewBox.cy ?? 0) + 14}
																		className="fill-muted-foreground"
																		fontSize={11}>
																		Total
																	</tspan>
																</text>
															);
														}
													}}
												/>
											</Pie>
										</PieChart>
									</ChartContainer>
								:	<div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
										<div className="text-center">
											<TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-30" />
											Belum ada data
										</div>
									</div>
								}
							</CardContent>
							{pieData.length > 0 && (
								<CardFooter className="flex-col gap-1 pt-3 pb-4 px-5">
									<div className="w-full grid grid-cols-2 gap-x-4 gap-y-1.5">
										{pieData.map((item) => {
											const pct =
												total > 0 ? Math.round((item.value / total) * 100) : 0;
											return (
												<div
													key={item.name}
													className="flex items-center gap-1.5 min-w-0">
													<span
														className="h-2 w-2 rounded-full shrink-0"
														style={{ background: item.fill }}
													/>
													<span className="text-[11px] text-muted-foreground truncate">
														{item.label}
													</span>
													<span className="ml-auto text-[11px] font-semibold tabular-nums shrink-0">
														{pct}%
													</span>
												</div>
											);
										})}
									</div>
								</CardFooter>
							)}
						</Card>
					</div>

					{/* ── DESKTOP: Side-by-side layout ── */}
					<div className="hidden md:grid gap-4 lg:grid-cols-[1fr_300px]">
						{/* LEFT: Bar Chart */}
						<Card className="border-none shadow-sm">
							<CardHeader className="pb-2 pt-4 px-5">
								<CardTitle className="text-sm font-semibold">
									Distribusi permintaan layanan berdasarkan status
								</CardTitle>
								<CardDescription className="text-xs">
									{PERIOD_LABELS[period]} · Statistik Diagram Batang
								</CardDescription>
							</CardHeader>
							<CardContent className="px-3 pb-2">
								{barData.some((d) => d.jumlah > 0) ?
									<ChartContainer
										config={barChartConfig}
										className="h-[350px] w-full">
										<BarChart
											accessibilityLayer
											data={barData}
											margin={{
												top: 30,
											}}>
											<CartesianGrid vertical={false} />
											<defs>
												<defs>
													<linearGradient
														id="primaryGradient"
														x1="0"
														y1="0"
														x2="0"
														y2="1">
														<stop offset="0%" stopColor="#2563eb" />
														<stop offset="100%" stopColor="#60a5fa" />
													</linearGradient>
												</defs>
											</defs>
											<XAxis
												dataKey="status"
												tickLine={false}
												tickMargin={10}
												axisLine={false}
												interval={0} // Memaksa semua label tampil
												tickFormatter={(value) =>
													// Memotong teks lebih dari 12 huruf agar muat sejajar
													value.length > 12 ?
														value.substring(0, 12) + "..."
													:	value
												}
											/>
											<ChartTooltip
												cursor={false}
												content={<ChartTooltipContent hideLabel />}
											/>
											<Bar
												dataKey="jumlah"
												radius={8}
												fill="url(#primaryGradient)"
												barSize={46}
												background={{ fill: "#f1f5f9", radius: 8 }}>
												<LabelList
													position="top"
													offset={12}
													className="fill-foreground"
													fontSize={12}
													fontWeight={600}
												/>
											</Bar>
										</BarChart>
									</ChartContainer>
								:	<div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
										<div className="text-center">
											<TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-30" />
											Belum ada data
										</div>
									</div>
								}
							</CardContent>
						</Card>

						{/* RIGHT: Donut Pie Chart */}
						<Card className="border-none shadow-sm flex flex-col">
							<CardHeader className="pb-0 pt-4 px-5">
								<CardTitle className="text-sm font-semibold">
									Kontribusi Status
								</CardTitle>
								<CardDescription className="text-xs">
									{PERIOD_LABELS[period]}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-1 flex items-center justify-center pb-0 pt-2">
								{pieData.length > 0 ?
									<ChartContainer
										config={pieChartConfig}
										className="h-[180px] w-full">
										<PieChart>
											<ChartTooltip
												cursor={false}
												content={
													<ChartTooltipContent
														hideLabel
														formatter={(value, _name, props) => (
															<div className="flex items-center gap-1.5 min-w-[140px]">
																<span
																	className="h-2.5 w-2.5 rounded-full shrink-0"
																	style={{ background: props.payload.fill }}
																/>
																<span className="text-muted-foreground">
																	{props.payload.label}
																</span>
																<span className="ml-auto font-semibold tabular-nums">
																	{value}
																</span>
															</div>
														)}
													/>
												}
											/>
											<Pie
												data={pieData}
												dataKey="value"
												nameKey="name"
												cx="50%"
												cy="50%"
												innerRadius={55}
												outerRadius={80}
												strokeWidth={2}>
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
																		y={(viewBox.cy ?? 0) - 6}
																		className="fill-foreground text-2xl font-bold"
																		fontSize={24}
																		fontWeight={700}>
																		{total}
																	</tspan>
																	<tspan
																		x={viewBox.cx}
																		y={(viewBox.cy ?? 0) + 14}
																		className="fill-muted-foreground"
																		fontSize={11}>
																		Total
																	</tspan>
																</text>
															);
														}
													}}
												/>
											</Pie>
										</PieChart>
									</ChartContainer>
								:	<div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
										<div className="text-center">
											<TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-30" />
											Belum ada data
										</div>
									</div>
								}
							</CardContent>

							{/* Legend / Keterangan */}
							{pieData.length > 0 && (
								<CardFooter className="flex-col gap-1 pt-3 pb-4 px-5">
									<div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
										{pieData.map((item) => {
											const pct =
												total > 0 ? Math.round((item.value / total) * 100) : 0;
											return (
												<div
													key={item.name}
													className="flex items-center gap-1.5 min-w-0">
													<span
														className="h-2 w-2 rounded-full shrink-0"
														style={{ background: item.fill }}
													/>
													<span className="text-[11px] text-muted-foreground truncate">
														{item.label}
													</span>
													<span className="ml-auto text-[11px] font-semibold tabular-nums shrink-0">
														{pct}%
													</span>
												</div>
											);
										})}
									</div>
								</CardFooter>
							)}
						</Card>
					</div>
				</div>
			:	null}
		</div>
	);
};

export default DsServiceRequest;
