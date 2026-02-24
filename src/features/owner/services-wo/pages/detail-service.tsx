import { useEffect } from "react";
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
import { Card } from "@/components/ui/card";

const DetailService = () => {
	const navigate = useNavigate();
	const { detailService, getDetailService } = useCreateService();

	// Lazy loading - fetch service details on mount
	useEffect(() => {
		void getDetailService();
	}, []);

	return (
		<>
			{/* Header Navigasi */}
			<div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
				<div className="flex items-center space-x-4">
					<Button
						onClick={() => navigate(-1)}
						className="bg-primary hover:bg-primary/90 h-full">
						<ChevronLeft className="size-6" />
					</Button>
					<div className="flex flex-col space-y-1">
						<h1 className="text-2xl font-bold">
							Detail Service {detailService?.title}
						</h1>
						<p className="text-muted-foreground text-sm sm:text-base">
							Berikut merupakan detail service {detailService?.title} yang
							dimiliki oleh perusahaan.
						</p>
					</div>
				</div>
			</div>

			<div className="space-y-8">
				{/* Informasi Utama */}
				<Card className="shadow-md border rounded-lg overflow-hidden">
					{/* Card Header with Actions */}
					<div className="p-5 lg:p-6 border-b bg-gradient-to-br from-background to-muted/20">
						<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
							<div className="flex-1 space-y-3">
								<div className="flex items-center gap-3 flex-wrap">
									<FileText className="size-6 text-primary shrink-0" />
									<h2 className="text-xl font-bold">{detailService?.title}</h2>
									{detailService?.isActive ?
										<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-50 text-green-700 border border-green-200">
											<CheckCircle className="w-3.5 h-3.5" />
											<span className="text-xs font-semibold">Aktif</span>
										</div>
									:	<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-50 text-gray-700 border border-gray-200">
											<span className="text-xs font-semibold">Nonaktif</span>
										</div>
									}
								</div>
								<p className="text-sm text-muted-foreground leading-relaxed">
									{detailService?.description}
								</p>
								<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 w-fit">
									<span className="text-xs font-semibold">Tipe Akses:</span>
									<span className="text-xs font-bold capitalize">
										{detailService?.accessType}
									</span>
								</div>
							</div>

							<div className="flex gap-2 sm:flex-shrink-0">
								<Button
									variant="outline"
									size="sm"
									className="flex-1 sm:flex-none h-10 px-4 rounded-lg border-2 hover:bg-muted transition-colors">
									<Edit className="w-4 h-4 sm:mr-2" />
									<span className="hidden sm:inline">Edit</span>
								</Button>
								<Button
									variant="destructive"
									size="sm"
									className="flex-1 sm:flex-none h-10 px-4 rounded-lg transition-colors">
									<Trash className="w-4 h-4 sm:mr-2" />
									<span className="hidden sm:inline">Delete</span>
								</Button>
							</div>
						</div>
					</div>

					{/* Card Content */}
					<div className="p-5 lg:p-6">
						{/* Required Staff */}
						<div className="space-y-3">
							<h3 className="font-semibold text-base flex items-center gap-2">
								<Users className="size-5 text-primary" />
								Pegawai yang Diperlukan
							</h3>
							{detailService?.requiredStaffs?.length ?
								<div className="grid gap-3 sm:grid-cols-2">
									{detailService.requiredStaffs.map((staff, i) => (
										<div
											key={i}
											className="border rounded-lg p-4 bg-muted/30 hover:bg-muted/50 transition-colors flex justify-between items-center">
											<div className="flex-1">
												<p className="font-semibold text-sm">
													{staff.position?.name}
												</p>
												<p className="text-xs text-muted-foreground mt-1">
													Min: {staff.minimumStaff} - Max: {staff.maximumStaff}{" "}
													orang
												</p>
											</div>
											<CheckCircle className="size-5 text-green-600 shrink-0 ml-2" />
										</div>
									))}
								</div>
							:	<p className="text-sm text-muted-foreground italic">
									Tidak ada kebutuhan staf spesifik.
								</p>
							}
						</div>
					</div>
				</Card>

				{/* Client Intake Forms */}
				{(detailService?.clientIntakeForms?.length ?? 0) > 0 && (
					<Card className="shadow-md border rounded-lg overflow-hidden">
						<div className="p-5 lg:p-6 border-b bg-gradient-to-br from-background to-muted/20">
							<h3 className="font-semibold text-lg flex items-center gap-2">
								<ClipboardList className="size-5 text-primary" />
								Client Intake Forms
							</h3>
						</div>
						<div className="p-5 lg:p-6 grid gap-3 sm:grid-cols-2">
							{detailService?.clientIntakeForms?.map((item, i) => (
								<div
									key={i}
									className="border rounded-lg p-4 bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col space-y-2">
									<div className="flex items-start gap-2">
										<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
											{item.order}
										</div>
										<div className="flex-1">
											<span className="font-semibold text-sm">
												{item.form.title}
											</span>
											<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
												{item.form.description}
											</p>
										</div>
									</div>
									<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 w-fit">
										<span className="text-xs font-semibold capitalize">
											{item.form.formType}
										</span>
									</div>
								</div>
							))}
						</div>
					</Card>
				)}

				{/* Work Order Forms */}
				{(detailService?.workOrderForms?.length ?? 0) > 0 && (
					<Card className="shadow-md border rounded-lg overflow-hidden">
						<div className="p-5 lg:p-6 border-b bg-gradient-to-br from-background to-muted/20">
							<h3 className="font-semibold text-lg flex items-center gap-2">
								<FileText className="size-5 text-primary" />
								Work Order Forms
							</h3>
						</div>
						<div className="p-5 lg:p-6 grid gap-3 sm:grid-cols-2">
							{detailService?.workOrderForms?.map((wo, i) => (
								<div
									key={i}
									className="border rounded-lg p-4 bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col space-y-2">
									<div className="flex items-start gap-2">
										<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
											{wo.order}
										</div>
										<div className="flex-1">
											<span className="font-semibold text-sm">
												{wo.form.title}
											</span>
											<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
												{wo.form.description}
											</p>
										</div>
									</div>
									<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 w-fit">
										<span className="text-xs font-semibold capitalize">
											{wo.form.formType}
										</span>
									</div>
								</div>
							))}
						</div>
					</Card>
				)}

				{/* Report Forms */}
				{(detailService?.reportForms?.length ?? 0) > 0 && (
					<Card className="shadow-md border rounded-lg overflow-hidden">
						<div className="p-5 lg:p-6 border-b bg-gradient-to-br from-background to-muted/20">
							<h3 className="font-semibold text-lg flex items-center gap-2">
								<FileText className="size-5 text-primary" />
								Report Forms
							</h3>
						</div>
						<div className="p-5 lg:p-6 grid gap-3 sm:grid-cols-2">
							{detailService?.reportForms?.map((rf, i) => (
								<div
									key={i}
									className="border rounded-lg p-4 bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col space-y-2">
									<div className="flex items-start gap-2">
										<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
											{rf.order}
										</div>
										<div className="flex-1">
											<span className="font-semibold text-sm">
												{rf.form.title}
											</span>
											<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
												{rf.form.description}
											</p>
										</div>
									</div>
									<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 w-fit">
										<span className="text-xs font-semibold capitalize">
											{rf.form.formType}
										</span>
									</div>
								</div>
							))}
						</div>
					</Card>
				)}
			</div>
		</>
	);
};

export default DetailService;
