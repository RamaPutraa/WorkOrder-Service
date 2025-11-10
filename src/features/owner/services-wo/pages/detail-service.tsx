import { Button } from "@/components/ui/button";
import {
	CheckCircle,
	ChevronLeft,
	ClipboardList,
	Edit,
	FileText,
	Trash,
	Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateService } from "../hooks/useCreateService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label"; // gunakan komponen Label dari shadcn-ui
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-separator";

const DetailService = () => {
	const navigate = useNavigate();
	const { detailService } = useCreateService();

	return (
		<>
			{/* Header Navigasi */}
			<div className="flex items-center space-x-6 mb-8">
				<Button
					onClick={() => navigate(-1)}
					className="bg-primary hover:bg-primary/90 h-full">
					<ChevronLeft className="size-6" />
				</Button>
				<div className="flex flex-col space-y-2">
					<h1 className="text-xl font-bold tracking-tight">
						Detail Service {detailService?.title}
					</h1>
					<p className="text-muted-foreground">
						Berikut merupakan detail service {detailService?.title} yang
						dimiliki oleh perusahaan.
					</p>
				</div>
			</div>

			<div className="space-y-8">
				{/* Informasi Utama */}
				<Card className="shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle className="text-lg font-semibold flex items-center gap-2">
								<FileText className="size-5 text-primary" />
								{detailService?.title}
								{detailService?.isActive ? (
									<Badge variant="default" className="ml-2">
										Aktif
									</Badge>
								) : (
									<Badge variant="secondary" className="ml-2">
										Nonaktif
									</Badge>
								)}
							</CardTitle>
							<p className="text-sm text-muted-foreground mt-1">
								{detailService?.description}
							</p>
						</div>
						<div className="flex gap-2">
							<Button variant="outline" size="sm">
								<Edit className="w-4 h-4 mr-1" /> Edit
							</Button>
							<Button variant="destructive" size="sm">
								<Trash className="w-4 h-4 mr-1" /> Delete
							</Button>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex flex-wrap gap-4">
							<div>
								<Label className="text-xs text-muted-foreground">
									Tipe Akses
								</Label>
								<p className="font-medium capitalize">
									{detailService?.accessType}
								</p>
							</div>
							<div>
								<Label className="text-xs text-muted-foreground">
									ID Layanan
								</Label>
								<p className="font-mono text-sm">{detailService?._id || "-"}</p>
							</div>
						</div>

						<Separator className="my-4" />

						{/* Required Staff */}
						<div className="space-y-2">
							<h3 className="font-semibold flex items-center gap-2">
								<Users className="size-4 text-primary" />
								Pegawai yang Diperlukan
							</h3>
							{detailService?.requiredStaff?.length ? (
								<div className="grid gap-3">
									{detailService.requiredStaff.map((staff, i) => (
										<div
											key={i}
											className="border rounded-md p-3 bg-muted/50 flex justify-between items-center">
											<div>
												<p className="font-medium">{staff.position?.name}</p>
												<p className="text-xs text-muted-foreground">
													Minimal {staff.minimumStaff} - Maksimal{" "}
													{staff.maximumStaff} orang
												</p>
											</div>
											<CheckCircle className="size-5 text-green-600" />
										</div>
									))}
								</div>
							) : (
								<p className="text-sm text-muted-foreground">
									Tidak ada kebutuhan staf spesifik.
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Client Intake Forms */}
				{(detailService?.clientIntakeForms?.length ?? 0) > 0 && (
					<Card className="shadow-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<ClipboardList className="size-5 text-primary" />
								Client Intake Forms
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							{detailService?.clientIntakeForms?.map((item, i) => (
								<div
									key={i}
									className="border rounded-md p-4 bg-muted/40 flex flex-col">
									<span className="font-medium">
										#{item.order}. {item.form.title}
									</span>
									<p className="text-xs text-muted-foreground">
										{item.form.description}
									</p>
									<Badge
										variant="outline"
										className="mt-2 w-fit capitalize text-xs">
										{item.form.formType}
									</Badge>
								</div>
							))}
						</CardContent>
					</Card>
				)}

				{/* Work Order Forms */}
				{(detailService?.workOrderForms?.length ?? 0) > 0 && (
					<Card className="shadow-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileText className="size-5 text-primary" />
								Work Order Forms
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							{detailService?.workOrderForms?.map((wo, i) => (
								<div
									key={i}
									className="border rounded-md p-4 bg-muted/40 flex flex-col">
									<span className="font-medium">
										#{wo.order}. {wo.form.title}
									</span>
									<p className="text-xs text-muted-foreground">
										{wo.form.description}
									</p>
									<Badge
										variant="outline"
										className="mt-2 w-fit capitalize text-xs">
										{wo.form.formType}
									</Badge>
								</div>
							))}
						</CardContent>
					</Card>
				)}

				{/* Report Forms */}
				{(detailService?.reportForms?.length ?? 0) > 0 && (
					<Card className="shadow-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileText className="size-5 text-primary" />
								Report Forms
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3">
							{detailService?.reportForms?.map((rf, i) => (
								<div
									key={i}
									className="border rounded-md p-4 bg-muted/40 flex flex-col">
									<span className="font-medium">
										#{rf.order}. {rf.form.title}
									</span>
									<p className="text-xs text-muted-foreground">
										{rf.form.description}
									</p>
									<Badge
										variant="outline"
										className="mt-2 w-fit capitalize text-xs">
										{rf.form.formType}
									</Badge>
								</div>
							))}
						</CardContent>
					</Card>
				)}
			</div>
		</>
	);
};

export default DetailService;
