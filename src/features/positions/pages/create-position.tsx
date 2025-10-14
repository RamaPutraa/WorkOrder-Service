import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CreatePosition: React.FC = () => {
	const navigate = useNavigate();
	return (
		<div className="container py-10 px-6">
			<div className="flex items-center justify-between mb-8">
				<div className="flex flex-col space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">
						Tambah Data Posisi Pegawai
					</h1>
					<p className="text-muted-foreground">
						Berikut merupakan form tambah posisi pegawai yang dimiliki oleh
						perusahaan.
					</p>
				</div>
				<Button
					onClick={() => navigate(-1)}
					className="bg-primary hover:bg-primary/90">
					<ArrowLeft className="h-4 w-4" />
					Kembali
				</Button>
			</div>

			<Card className="p-6 border shadow-md rounded-2xl "></Card>
		</div>
	);
};

export default CreatePosition;
