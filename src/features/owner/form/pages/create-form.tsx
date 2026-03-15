import React, { useRef, useState } from "react";
import {
	FormBuilder,
	type FormBuilderRef,
} from "../components/create/form-builder";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Plus, Loader2, Save, LayoutList } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageHeader from "@/shared/atoms/header-content";

const FormCreatePage: React.FC = () => {
	const formRef = useRef<FormBuilderRef>(null);
	const [fields, setFields] = useState<Field[]>([]);
	const isSubmitting = formRef.current?.isSubmitting;

	const fieldsType = (type: string) => {
		switch (type) {
			case "text":
				return "Jawaban singkat";
			case "textarea":
				return "Paragraf";
			case "number":
				return "Angka";
			case "date":
				return "Tanggal";
			case "multi_select":
				return "Pilihan Ganda";
			case "single_select":
				return "Pilihan Tunggal";
		}
	};
	return (
		<>
			{/* Header */}
			<PageHeader
				title="Buat Formulir Baru"
				subtitle="Lengkapi detail formulir dan tambahkan pertanyaan secara dinamis di bawah."
				backPath={true}
			/>

			{/* Main Layout */}
			<div className="flex flex-col lg:flex-row items-start gap-6">
				{/* Form Builder — full width mobile, flex-1 desktop */}
				<div className="w-full lg:flex-1 min-w-0">
					<FormBuilder ref={formRef} onFieldsChange={setFields} />
				</div>

				{/* Action Sidebar — full width mobile, sticky sidebar desktop */}
				<div className="w-full lg:w-72 lg:sticky lg:top-6 lg:self-start">
					<Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
						{/* Actions Section */}
						<div className="p-5 space-y-3 bg-gradient-to-br from-background to-muted/30">
							<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
								Aksi
							</p>

							<Button
								variant="outline"
								className="w-full h-10 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 font-medium gap-2"
								onClick={() => formRef.current?.addField()}
								disabled={isSubmitting}>
								<Plus className="w-4 h-4 shrink-0" />
								Tambah Pertanyaan
							</Button>

							<Button
								className="w-full h-10 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-medium gap-2"
								onClick={() => formRef.current?.submitForm()}
								disabled={isSubmitting}>
								{isSubmitting ?
									<>
										<Loader2 className="w-4 h-4 animate-spin shrink-0" />
										Menyimpan...
									</>
								:	<>
										<Save className="w-4 h-4 shrink-0" />
										Simpan Form
									</>
								}
							</Button>
						</div>

						{/* Field Summary */}
						<div className="border-t border-slate-100">
							<div className="p-5">
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center gap-2">
										<LayoutList className="w-4 h-4 text-muted-foreground" />
										<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
											Daftar Field
										</p>
									</div>
									<Badge variant="secondary" className="text-xs tabular-nums">
										{fields.length}
									</Badge>
								</div>

								<ScrollArea className="h-[180px]">
									<div className="space-y-1.5 pr-2">
										{fields.length > 0 ?
											fields.map((f, i) => (
												<div
													key={i}
													className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-background border border-border/50 hover:border-primary/40 hover:bg-muted/40 transition-all duration-150 group">
													<div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
														{i + 1}
													</div>
													<ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
													<span className="text-xs font-medium truncate capitalize text-slate-600">
														{fieldsType(f.type)}
													</span>
												</div>
											))
										:	<div className="text-center py-8">
												<p className="text-xs text-muted-foreground">
													Belum ada field
												</p>
												<p className="text-xs text-muted-foreground/70 mt-1">
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
