import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicFields } from "./dynamic-fields";
import {
	createFormApi,
	getAllowedPositions,
	getAccessTypes,
} from "../services/formService";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { CircleCheckBigIcon as Check } from "lucide-react"; // ✅ Tambahkan ikon centang

export const FormBuilder = () => {
	const [loading, setLoading] = useState(false);
	const [positions, setPositions] = useState<{ _id: string; name: string }[]>(
		[]
	);
	const [accessList, setAccessList] = useState<{ key: string; name: string }[]>(
		[]
	);

	const [formData, setFormData] = useState<CreateFormRequest>({
		title: "",
		description: "",
		accessType: "",
		accessibleBy: [],
		allowedPositions: [],
		fields: [],
	});

	useEffect(() => {
		(async () => {
			const pos = await getAllowedPositions();
			const acc = await getAccessTypes();
			setPositions(pos);
			setAccessList(acc);
		})();
	}, []);

	const handleAddField = () => {
		const newField: Field = {
			order: formData.fields.length + 1,
			label: "",
			type: "text",
			required: false,
			placeholder: "",
			min: null,
			max: null,
			options: [],
		};
		setFormData((prev) => ({
			...prev,
			fields: [...prev.fields, newField],
		}));
	};

	const handleRemoveField = (index: number) => {
		setFormData((prev) => ({
			...prev,
			fields: prev.fields.filter((_, i) => i !== index),
		}));
	};

	const handleUpdateField = (index: number, updatedField: Partial<Field>) => {
		setFormData((prev) => {
			const newFields = [...prev.fields];
			newFields[index] = { ...newFields[index], ...updatedField };
			return { ...prev, fields: newFields };
		});
	};

	const handleSelectAccessType = (type: string) => {
		setFormData((prev) => ({
			...prev,
			accessType: prev.accessType === type ? "" : type,
		}));
	};

	const handleToggleAccess = (key: string) => {
		setFormData((prev) => {
			const exists = prev.accessibleBy.includes(key);
			return {
				...prev,
				accessibleBy: exists
					? prev.accessibleBy.filter((k) => k !== key)
					: [...prev.accessibleBy, key],
			};
		});
	};

	const handleTogglePosition = (id: string) => {
		setFormData((prev) => {
			const exists = prev.allowedPositions.includes(id);
			return {
				...prev,
				allowedPositions: exists
					? prev.allowedPositions.filter((p) => p !== id)
					: [...prev.allowedPositions, id],
			};
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await createFormApi(formData);
			toast.success("Form berhasil disimpan!");
			console.log("Response:", res);
		} catch (error) {
			console.error(error);
			toast.error("Gagal menyimpan form!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="w-full space-y-6 pb-10">
			{/* ====== Kartu Utama ====== */}
			<Card className="rounded-2xl shadow-sm border border-gray-200">
				<CardContent className="p-6 space-y-5">
					{/* Judul */}
					<div className="space-y-2">
						<Label className="text-base font-medium">Judul Form</Label>
						<Input
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							placeholder="Contoh: Formulir Pendaftaran"
						/>
					</div>

					{/* Deskripsi */}
					<div className="space-y-2">
						<Label>Deskripsi</Label>
						<Textarea
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							placeholder="Tuliskan deskripsi singkat form..."
						/>
					</div>

					{/* ====== Tipe Akses ====== */}
					<div className="space-y-2">
						<Label>Tipe Akses</Label>
						<div className="flex flex-wrap gap-2">
							{["public", "internal", "private"].map((type) => {
								const active = formData.accessType === type;
								return (
									<Badge
										key={type}
										onClick={() => handleSelectAccessType(type)}
										variant={active ? "default" : "outline"}
										className="cursor-pointer px-4 py-2 capitalize flex items-center gap-1.5 select-none">
										<span>{type}</span>
										{active && <Check className="w-4 h-4 stroke-[3] ml-1" />}
									</Badge>
								);
							})}
						</div>
					</div>

					{/* ====== Dapat Diakses Oleh ====== */}
					<div className="space-y-2">
						<Label>Dapat Diakses Oleh</Label>
						<div className="flex flex-wrap gap-2">
							{accessList.map((acc) => {
								const active = formData.accessibleBy.includes(acc.key);
								return (
									<Badge
										key={acc.key}
										onClick={() => handleToggleAccess(acc.key)}
										variant={active ? "default" : "outline"}
										className="cursor-pointer select-none px-4 py-2 flex items-center gap-1.5 transition">
										<span>{acc.name}</span>
										{active && <Check className="w-4 h-4 stroke-[3]" />}
									</Badge>
								);
							})}
						</div>
					</div>

					{/* ====== Posisi yang Diizinkan (jika staff dipilih) ====== */}
					<AnimatePresence>
						{formData.accessibleBy.includes("staff") && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.3 }}
								className="space-y-2">
								<Label>Posisi yang Diizinkan</Label>
								<div className="flex flex-wrap gap-2">
									{positions.map((pos) => {
										const active = formData.allowedPositions.includes(pos._id);
										return (
											<Badge
												key={pos._id}
												onClick={() => handleTogglePosition(pos._id)}
												variant={active ? "default" : "outline"}
												className="cursor-pointer select-none px-4 py-2 flex items-center gap-1.5 transition">
												<span>{pos.name}</span>
												{active && <Check className="w-4 h-4 stroke-[3]" />}
											</Badge>
										);
									})}
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					<Separator className="my-4" />

					<div className="flex justify-end">
						<Button type="submit" disabled={loading}>
							{loading ? "Menyimpan..." : "Simpan Form"}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* ====== Bagian Pertanyaan ====== */}
			<DynamicFields
				fields={formData.fields}
				onAdd={handleAddField}
				onRemove={handleRemoveField}
				onUpdate={handleUpdateField}
			/>
		</form>
	);
};
