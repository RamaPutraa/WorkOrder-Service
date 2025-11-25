import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
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

const ViewServiceRequest = () => {
	const { data, loading, error } = useBusiness();

	if (loading) return <p className="p-4">Loading...</p>;
	if (error) return <p className="p-4 text-red-500">{error}</p>;

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
							className="shadow-sm border hover:shadow-md transition-all duration-200">
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
											{item.status}
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
									{/* Lihat Detail → col-span-2 */}
									<Button
										variant="outline"
										className="flex items-center gap-1 col-span-4 text-xs py-1 h-8">
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
