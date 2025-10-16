import React, { useEffect, useState } from "react";
import { getFormsApi } from "../services/formService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

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
				setForms(res.data?.forms || []);
			} catch {
				setError("Gagal memuat data form");
			} finally {
				setLoading(false);
			}
		};

		void fetchForms();
	}, []);

	if (error) {
		return (
			<div className="container py-8 px-10">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<div className="container">
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
					<Plus className="h-4 w-4 mr-2" />
					Tambah Form
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<AnimatePresence mode="wait">
					{loading ? (
						Array.from({ length: 6 }).map((_, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}>
								<Card className="p-4 flex flex-col justify-between animate-pulse">
									<div>
										<Skeleton className="h-5 w-3/4 mb-3" />
										<Skeleton className="h-4 w-full mb-2" />
										<Skeleton className="h-4 w-2/3" />
									</div>
									<Skeleton className="h-9 w-full mt-4" />
								</Card>
							</motion.div>
						))
					) : forms.length > 0 ? (
						forms.map((form) => (
							<motion.div
								key={form._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								whileHover={{ scale: 1.03, y: -4 }}
								transition={{ duration: 0.3, ease: "easeOut" }}>
								<Card className="p-4 flex flex-col justify-between border shadow-sm transition-all">
									<div>
										<h2 className="text-lg font-semibold">{form.title}</h2>
										<p className="text-sm text-muted-foreground mt-1">
											{form.description}
										</p>
										<p className="text-xs text-muted-foreground mt-2">
											Access: {form.formType}
										</p>
									</div>

									<Button
										asChild
										variant="outline"
										className="text-primary border-primary mt-4 w-full">
										<a href={`/dashboard/owner/form/${form._id}`}>
											Lihat Detail
										</a>
									</Button>
								</Card>
							</motion.div>
						))
					) : (
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="text-muted-foreground text-center col-span-full py-6">
							Tidak ada data form.
						</motion.p>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default ViewForm;
