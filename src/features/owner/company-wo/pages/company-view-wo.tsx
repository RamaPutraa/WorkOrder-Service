import { useNavigate } from "react-router-dom";
import { useCompanyWo } from "../hooks/use-company-wo";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

			<div className="grid gap-4">
				{data.map((wo) => (
					<Card key={wo._id} className="rounded-2xl shadow-sm border">
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<span>{wo.service?.title}</span>
								<Badge variant="outline" className="capitalize">
									{wo.status}
								</Badge>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm">
							<p>
								<span className="font-semibold">Client:</span>{" "}
								{wo.createdBy?.name}
							</p>
							<p>
								<span className="font-semibold">Created:</span>{" "}
								{new Date(wo.createdAt).toLocaleString()}
							</p>

							<div className="pt-2">
								<Button
									className="w-full bg-primary hover:bg-primary/90"
									onClick={() => navigate(`/company/work-order/${wo._id}`)}>
									Lihat Detail
								</Button>
							</div>
						</CardContent>
					</Card>
				))}

				{data.length === 0 && (
					<p className="text-muted-foreground text-center py-10">
						Belum ada data work order.
					</p>
				)}
			</div>
		</div>
	);
};

export default CompanyViewWo;
