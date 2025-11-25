import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { useBusiness } from "../hooks/use-business";

const ViewServiceRequest = () => {
	const { data, loading, error } = useBusiness();

	if (loading) return <p className="p-4">Loading...</p>;
	if (error) return <p className="p-4 text-red-500">{error}</p>;

	return (
		<div className="p-4 space-y-6">
			<h1 className="text-xl font-semibold">Daftar Service Request</h1>

			{data.length === 0 ? (
				<p className="text-muted-foreground">Belum ada service request.</p>
			) : (
				<div className="space-y-4">
					{data.map((item) => (
						<Card key={item._id} className="shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg">{item.service?.title}</CardTitle>
								<CardDescription>
									{item.service?.description || "Tidak ada deskripsi"}
								</CardDescription>
							</CardHeader>

							<CardContent className="text-sm space-y-1">
								<p>
									<span className="font-medium">Status:</span> {item.status}
								</p>
								<p>
									<span className="font-medium">Dibuat:</span>{" "}
									{new Date(item.createdAt).toLocaleString()}
								</p>
								<p>
									<span className="font-medium">Diperbarui:</span>{" "}
									{new Date(item.updatedAt).toLocaleString()}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
};

export default ViewServiceRequest;
