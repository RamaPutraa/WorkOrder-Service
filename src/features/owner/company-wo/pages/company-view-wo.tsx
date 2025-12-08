import { useNavigate } from "react-router-dom";
import { useCompanyWo } from "../hooks/use-company-wo";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Briefcase, Calendar, User } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-separator";

const CompanyViewWo = () => {
	const { data, loading, error } = useCompanyWo();
	const navigate = useNavigate();

	if (loading) return <p className="p-4">Loading...</p>;
	if (error) return <p className="p-4 text-red-500">{error}</p>;

	return (
		<div className="p-4 space-y-6">
			<div className="flex items-center space-x-6">
				<Button
					onClick={() => navigate(-1)}
					className="bg-primary hover:bg-primary/90 h-full">
					<ChevronLeft className="size-6" />
				</Button>
				<div className="flex flex-col space-y-2">
					<h1 className="text-xl font-bold tracking-tight">
						Daftar Tugas Kerja
					</h1>
					<p className="text-muted-foreground">
						Berikut merupakan daftar tugas kerja.
					</p>
				</div>
			</div>

			{/* Grid 2 kolom */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{data.map((wo) => {
					const positions =
						[...new Set(wo.assignedStaffs?.map((s) => s.position?.name))]
							.filter(Boolean)
							.join(", ") || "Belum ada posisi yang ditugaskan";

					// Status color mapping
					const statusVariant:
						| "default"
						| "secondary"
						| "destructive"
						| "outline" =
						wo.status === "drafted"
							? "secondary"
							: wo.status === "ongoing"
							? "default"
							: wo.status === "completed"
							? "outline"
							: "destructive"; // fallback untuk status lain

					return (
						<Card
							key={wo._id}
							className="rounded-2xl transition-all hover:shadow-md border">
							<CardHeader>
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-semibold">{wo.service?.title}</h3>

									<Badge variant={statusVariant} className="capitalize">
										{wo.status}
									</Badge>
								</div>

								<p className="text-sm text-muted-foreground">
									{wo.service?.description || "-"}
								</p>
							</CardHeader>

							<CardContent className="space-y-5">
								{/* Client (kiri) — Tanggal (kanan) */}
								<div className="flex items-center justify-between">
									{/* Client */}
									<div className="flex items-center space-x-3">
										<User className="size-5 text-muted-foreground" />
										<div>
											<p className="text-xs font-medium text-muted-foreground">
												Client
											</p>
											<p className="text-sm">{wo.createdBy?.name || "-"}</p>
										</div>
									</div>

									{/* Tanggal */}
									<div className="flex items-center space-x-3">
										<Calendar className="size-5 text-muted-foreground" />
										<div className="text-left">
											<p className="text-xs font-medium text-muted-foreground">
												Dibuat Pada
											</p>
											<p className="text-sm">
												{new Date(wo.createdAt).toLocaleDateString("id-ID", {
													day: "2-digit",
													month: "long",
													year: "numeric",
												})}
											</p>
										</div>
									</div>
								</div>

								<Separator />

								{/* Posisi Dibutuhkan */}
								<div className="flex items-center space-x-3">
									<Briefcase className="size-5 text-muted-foreground" />
									<div>
										<p className="text-xs font-medium text-muted-foreground">
											Posisi Ditugaskan
										</p>
										<p className="text-sm">{positions}</p>
									</div>
								</div>

								<Button
									className="w-full mt-3"
									onClick={() =>
										navigate(`/dashboard/owner/workorders/detail/${wo._id}`)
									}>
									Lihat Detail
								</Button>
							</CardContent>
						</Card>
					);
				})}

				{data.length === 0 && (
					<p className="text-muted-foreground text-center py-10 col-span-2">
						Belum ada data work order.
					</p>
				)}
			</div>
		</div>
	);
};

export default CompanyViewWo;
