import React, { useEffect, useState } from "react";
import { getFormsApi } from "../services/formService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewForm: React.FC = () => {
	const [forms, setForms] = useState<Form[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchForms = async (): Promise<void> => {
			try {
				setLoading(true);
				const res = await getFormsApi();
				// console.log("API response:", res);
				setForms(res.data?.forms || []);
			} catch {
				setError("Gagal memuat data form");
			} finally {
				setLoading(false);
			}
		};

		void fetchForms();
	}, []);

	if (loading) {
		return (
			<div className="container py-8 px-10">
				<p>Loading data form...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container py-8 px-10">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<div className="container py-8 px-10">
			<div className="flex items-center justify-between mb-8">
				<div className="flex flex-col space-y-2">
					<h1 className="text-2xl font-bold">List Data Form</h1>
					<p className="text-muted-foreground">
						Berikut merupakan list form yang dimiliki oleh perusahaan.
					</p>
				</div>

				<Button
					className="bg-primary hover:bg-primary/90"
					onClick={() => navigate("/dashboard/owner/form/create")}>
					<Plus className="h-4 w-4" />
					Tambah Form
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{forms.map((form) => (
					<Card key={form._id} className="p-4 flex flex-col justify-between">
						<div>
							<h2 className="text-lg font-semibold">{form.title}</h2>
							<p className="text-sm text-muted-foreground mt-1">
								{form.description}
							</p>
							<p className="text-xs text-muted-foreground mt-2">
								Access: {form.accessType}
							</p>
						</div>

						<Button
							asChild
							variant="outline"
							className="text-primary border-primarymt-4 w-full">
							<a href={`/dashboard/owner/form/${form._id}`}>Lihat Detail</a>
						</Button>
					</Card>
				))}
			</div>
		</div>
	);
};

export default ViewForm;
