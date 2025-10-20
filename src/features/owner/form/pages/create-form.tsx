// src/features/forms/pages/form-create-page.tsx
import React, { useRef, useState } from "react";
import { FormBuilder, type FormBuilderRef } from "../components/form-builder";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
const FormCreatePage: React.FC = () => {
	const formRef = useRef<FormBuilderRef>(null);
	const [fields, setFields] = useState<Field[]>([]);
	const isSubmitting = formRef.current?.isSubmitting;
	const navigate = useNavigate();
	return (
		<div className="container">
			<div className="flex items-center justify-between mb-8">
				<div className="flex flex-col space-y-2">
					<h1 className="text-2xl font-bold">Buat Form Baru</h1>
					<p className="text-muted-foreground">
						Lengkapi detail form dan tambahkan field secara dinamis di bawah.
					</p>
				</div>
				<Button
					onClick={() => navigate(-1)}
					className="bg-primary hover:bg-primary/90">
					<ArrowLeft className="h-4 w-4" />
					Kembali
				</Button>
			</div>

			<div className="flex items-start gap-8">
				{/* Kolom kiri - form */}
				<div className="flex-1">
					<FormBuilder ref={formRef} onFieldsChange={setFields} />
				</div>

				{/* Kolom kanan - tombol aksi sticky */}
				<div className="w-64 sticky top-10 self-start">
					<Card className="p-4 border shadow-sm rounded-xl flex flex-col max-h-[calc(100vh-100px)]">
						<h3 className="font-semibold text-md ">Aksi</h3>

						{/* Tombol */}
						<div className="space-y-2 mb-">
							<Button
								variant="outline"
								className="rounded-full px-6 py-2 text-primary border-primary hover:bg-blue-50 w-full"
								onClick={() => formRef.current?.addField()}
								disabled={isSubmitting}>
								+ Tambah Pertanyaan
							</Button>

							<Button
								className="rounded-full w-full"
								onClick={() => formRef.current?.submitForm()}
								disabled={isSubmitting}>
								{isSubmitting ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Menyimpan...
									</>
								) : (
									"Simpan Form"
								)}
							</Button>
						</div>

						{/* Scroll daftar field */}
						<div className="flex-1 overflow-y-auto">
							<h3 className="font-semibold text-md mb-2">Fields</h3>

							<ScrollArea className="max-h-[calc(100vh-300px)] pr-2">
								<div className="text-sm space-y-1">
									{fields.length ? (
										fields.map((f, i) => (
											<div
												key={i}
												className="text-muted-foreground flex items-center gap-1 hover:bg-muted/30 rounded-md px-2 py-1 transition">
												<ChevronRight className="w-4 h-4 shrink-0" />
												<span className="truncate">{f.type}</span>
											</div>
										))
									) : (
										<p className="text-muted-foreground">Belum ada field</p>
									)}
								</div>
							</ScrollArea>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default FormCreatePage;
