import { useNavigate } from "react-router-dom";
import { useCompanyWo } from "../hooks/use-company-wo";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Badge } from "@/components/ui/badge";

const CompanyDetailWo = () => {
	const { detailData } = useCompanyWo();
	const navigate = useNavigate();

	if (!detailData) {
		return <p className="p-4">Loading detail...</p>;
	}
	return (
		<>
			<div className="space-y-15 p-6">
				{/* HEADER */}
				<div className="flex items-center space-x-6 mb-8">
					<Button
						onClick={() => navigate(-1)}
						className="bg-primary hover:bg-primary/90 h-full">
						<ChevronLeft className="size-6" />
					</Button>

					<div className="flex flex-col space-y-2">
						<h1 className="text-xl font-bold tracking-tight">
							Detail Service {detailData?.service?.title}
						</h1>
						<p className="text-muted-foreground">
							Berikut merupakan detail service {detailData?.service?.title} yang
							dimiliki oleh perusahaan.
						</p>
					</div>
				</div>

				{/* SECTION WORKORDER FORMS */}
				{/* SECTION PAGE BODY */}
				<div className="space-y-6 p-6">
					{/* GRID 2 KOLOM: WORK ORDER + SERVICE */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* CARD WORK ORDER */}
						<Card className="border rounded-xl shadow-sm">
							<CardHeader>
								<div className="flex items-center justify-between">
									<h2 className="text-lg font-semibold">
										Informasi Work Order
									</h2>

									<Badge className="capitalize">{detailData.status}</Badge>
								</div>
								<p className="text-sm text-muted-foreground">
									Detail umum mengenai Work Order ini.
								</p>
							</CardHeader>
							<Separator />

							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									{/* Client */}
									<div className="flex items-center space-x-3">
										<User className="size-5 text-muted-foreground" />
										<div>
											<p className="text-xs font-medium text-muted-foreground">
												Client
											</p>
											<p className="text-sm">
												{detailData.createdBy?.name || "-"}
											</p>
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
												{new Date(detailData.createdAt).toLocaleDateString(
													"id-ID",
													{
														day: "2-digit",
														month: "long",
														year: "numeric",
													}
												)}
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* CARD SERVICE */}
						<Card className="border rounded-xl shadow-sm">
							<CardHeader>
								<h2 className="text-lg font-semibold">Detail Service</h2>
								<p className="text-sm text-muted-foreground">
									Informasi service yang terkait dengan Work Order ini.
								</p>
							</CardHeader>

							<CardContent className="space-y-4">
								{/* TITLE & DESC */}
								<div className="space-y-1">
									<p className="text-base font-medium">
										{detailData.service?.title}
									</p>
									<p className="text-sm text-muted-foreground">
										{detailData.service?.description}
									</p>
								</div>

								{/* REQUIRED STAFF */}
								<div className="mt-3">
									<p className="text-xs text-muted-foreground mb-2">
										Kebutuhan Staff
									</p>

									<div className="space-y-1">
										{detailData.service.requiredStaff.map((rs, idx) => (
											<div
												key={idx}
												className="flex justify-between text-sm border rounded-lg p-2">
												<p className="font-medium">{rs.position.name}</p>
												<p className="text-muted-foreground">
													{rs.minimumStaff} - {rs.maximumStaff} orang
												</p>
											</div>
										))}
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* ASSIGNED STAFF LIST */}
					<Card className="border rounded-xl shadow-sm">
						<CardHeader>
							<h2 className="text-lg font-semibold">Assigned Staff</h2>
							<p className="text-sm text-muted-foreground">
								Daftar staff yang ditugaskan dalam Work Order ini.
							</p>
						</CardHeader>

						<CardContent className="space-y-3">
							{detailData.assignedStaffs.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									Belum ada staff yang ditugaskan.
								</p>
							) : (
								detailData.assignedStaffs.map((staff) => (
									<div
										key={staff._id}
										className="flex justify-between items-center text-sm border-b pb-2">
										<p className="font-medium">{staff.name}</p>
										<p className="text-muted-foreground">
											{staff.position?.name}
										</p>
									</div>
								))
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
};

export default CompanyDetailWo;
