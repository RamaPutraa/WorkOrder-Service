// src/features/forms/pages/form-create-page.tsx
import React, { useRef, useState } from "react";
import {
	FormBuilder,
	type FormBuilderRef,
} from "../components/create/form-builder";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
const FormCreatePage: React.FC = () => {
	const formRef = useRef<FormBuilderRef>(null);
	const [fields, setFields] = useState<Field[]>([]);
	const isSubmitting = formRef.current?.isSubmitting;
	const navigate = useNavigate();
	return (
		<>
			<div className="flex items-center gap-4 mb-8">
				<Button
					onClick={() => navigate(-1)}
					className="bg-primary hover:bg-primary/90 h-full shrink-0">
					<ChevronLeft className="size-6" />
				</Button>
				<div className="flex-1">
					<h1 className="text-2xl font-bold">Buat Formulir Baru</h1>
					<p className="text-muted-foreground text-sm mt-0.5">
						Lengkapi detail formulir dan tambahkan field secara dinamis di bawah.
					</p>
				</div>
			</div>

			{/* Main Content - Responsive Layout */}
			<div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-6">
				{/* Form Builder - Full width on mobile, flex-1 on desktop */}
				<div className="w-full lg:flex-1">
					<FormBuilder ref={formRef} onFieldsChange={setFields} />
				</div>

				{/* Action Panel - Bottom fixed on mobile, sticky sidebar on desktop */}
				<div className="w-full lg:w-72 lg:sticky lg:top-6 lg:self-start">
					<Card className="border shadow-md rounded-lg overflow-hidden">
						{/* Actions Section */}
						<div className="p-4 lg:p-5 space-y-3 bg-gradient-to-br from-background to-muted/20">
							<h3 className="font-semibold text-base mb-3">Aksi</h3>

							<Button
								variant="outline"
								className="w-full h-11 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 font-medium"
								onClick={() => formRef.current?.addField()}
								disabled={isSubmitting}>
								<Plus className="w-4 h-4 mr-2" />
								Tambah Pertanyaan
							</Button>

							<Button
								className="w-full h-11 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium"
								onClick={() => formRef.current?.submitForm()}
								disabled={isSubmitting}>
								{isSubmitting ?
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Menyimpan...
									</>
								:	"Simpan Form"}
							</Button>
						</div>

						{/* Fields List Section */}
						<div className="border-t bg-muted/10">
							<div className="p-4 lg:p-5">
								<h3 className="font-semibold text-base mb-3">
									Daftar Field ({fields.length})
								</h3>

								<ScrollArea className="h-[200px]">
									<div className="space-y-1.5 pr-3">
										{fields.length > 0 ?
											fields.map((f, i) => (
												<div
													key={i}
													className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-background border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all duration-150 group">
													<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
														{i + 1}
													</div>
													<ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
													<span className="text-sm font-medium truncate capitalize">
														{f.type.replace(/_/g, " ")}
													</span>
												</div>
											))
										:	<div className="text-center py-8">
												<p className="text-sm text-muted-foreground">
													Belum ada field
												</p>
												<p className="text-xs text-muted-foreground mt-1">
													Klik tombol di atas untuk menambah
												</p>
											</div>
										}
									</div>
								</ScrollArea>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</>
	);
};

export default FormCreatePage;
