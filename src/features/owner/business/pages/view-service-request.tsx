import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBusiness } from "../hooks/use-business";
import { Button } from "@/components/ui/button";
import {
	Calendar,
	Clock,
	ClipboardList,
	Eye,
	CheckCircle,
	XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewServiceRequest = () => {
	const { data, loading, error } = useBusiness();
	const navigate = useNavigate();

	if (loading) return <p className="p-4">Loading...</p>;
	if (error) return <p className="p-4 text-red-500">{error}</p>;

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "approved":
				return "border-l-4 border-l-green-600";
			case "rejected":
				return "border-l-4 border-l-red-600";
			default:
				return "border-l-4 border-l-yellow-500";
		}
	};

	const renderStatusBadge = (status: string) => {
		const s = status.toLowerCase();
		if (s === "approved")
			return (
				<Badge className="bg-green-600 hover:bg-green-700">Approved</Badge>
			);
		if (s === "rejected")
			return <Badge className="bg-red-600 hover:bg-red-700">Rejected</Badge>;
		return (
			<Badge className="bg-yellow-500 hover:bg-yellow-600">Received</Badge>
		);
	};

	return (
		<div className="p-4 space-y-6">
			<h1 className="text-xl font-semibold flex items-center gap-2">
				<ClipboardList className="size-5 text-primary" />
				Daftar Service Request
			</h1>

			{data.length === 0 ? (
				<p className="text-muted-foreground">Belum ada service request.</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{data.map((item) => (
						<Card
							key={item._id}
							className={`shadow-sm border hover:shadow-md transition-all duration-200 ${getStatusColor(
								item.status
							)}`}>
							<CardHeader>
								<CardTitle className="text-lg font-semibold">
									{item.service?.title}
								</CardTitle>
								<CardDescription className="line-clamp-2">
									{item.service?.description || "Tidak ada deskripsi"}
								</CardDescription>
							</CardHeader>

							<CardContent className="text-sm space-y-3">
								<div className="grid grid-cols-2 gap-4">
									{/* KIRI */}
									<div className="space-y-1">
										<p className="flex items-center gap-2">
											<span className="font-medium">Status:</span>
											{renderStatusBadge(item.status)}
										</p>

										<p className="flex items-center gap-2">
											<span className="font-medium">Pelanggan:</span>
											{item.client?.name}
										</p>
									</div>

									{/* KANAN */}
									<div className="space-y-1 text-right">
										<p className="flex items-center gap-2 justify-end">
											<Calendar className="size-4 text-blue-600" />
											<span className="font-medium">Dibuat:</span>
											{new Date(item.createdAt).toLocaleString()}
										</p>

										<p className="flex items-center gap-2 justify-end">
											<Clock className="size-4 text-green-600" />
											<span className="font-medium">Diperbarui:</span>
											{new Date(item.updatedAt).toLocaleString()}
										</p>
									</div>
								</div>

								<div className="grid grid-cols-6 gap-2 mt-6">
									{/* Lihat Detail → col-span-4 */}
									<Button
										variant="outline"
										className="flex items-center gap-1 col-span-4 text-xs py-1 h-8"
										onClick={() =>
											navigate(
												`/dashboard/owner/business/services/request/detail/${item._id}`
											)
										}>
										<Eye size={14} />
										Lihat Detail
									</Button>

									{/* Approved */}
									<Button
										variant="outline"
										className="
                                            col-span-1 text-xs py-1 h-8 flex items-center gap-1
                                            border-green-600 text-green-600
                                            hover:bg-green-600 hover:text-white
                                        ">
										<CheckCircle size={14} />
										Approved
									</Button>

									{/* Rejected */}
									<Button
										variant="outline"
										className="
                                            col-span-1 text-xs py-1 h-8 flex items-center gap-1
                                            border-red-600 text-red-600
                                            hover:bg-red-600 hover:text-white
                                        ">
										<XCircle size={14} />
										Rejected
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
};

export default ViewServiceRequest;
