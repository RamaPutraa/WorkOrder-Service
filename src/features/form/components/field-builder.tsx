import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DynamicFields } from "./dynamic-fields";
import type { FormPayload, Field } from "../types/form";

export const FormBuilder = () => {
	const [formData, setFormData] = useState<FormPayload>({
		title: "",
		description: "",
		accessType: "",
		accessibleBy: [],
		allowedPositions: [],
		fields: [],
	});

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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form Data:", formData);
		alert("Form dikirim! Cek console.log untuk hasilnya");
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-6 p-6 bg-background rounded-lg shadow-sm border">
			{/* --- Input utama --- */}
			<div className="space-y-2">
				<Label>Judul Form</Label>
				<Input
					value={formData.title}
					onChange={(e) => setFormData({ ...formData, title: e.target.value })}
					placeholder="Masukkan judul form"
				/>
			</div>

			<div className="space-y-2">
				<Label>Deskripsi</Label>
				<Textarea
					value={formData.description}
					onChange={(e) =>
						setFormData({ ...formData, description: e.target.value })
					}
					placeholder="Tuliskan deskripsi form"
				/>
			</div>

			<div className="space-y-2">
				<Label>Tipe Akses</Label>
				<Input
					value={formData.accessType}
					onChange={(e) =>
						setFormData({ ...formData, accessType: e.target.value })
					}
					placeholder="Contoh: publik, privat, internal"
				/>
			</div>

			<Separator />

			{/* --- Field Dinamis --- */}
			<DynamicFields
				fields={formData.fields}
				onAdd={handleAddField}
				onRemove={handleRemoveField}
				onUpdate={handleUpdateField}
			/>

			<Separator />

			<Button type="submit" className="w-full">
				Simpan Form
			</Button>
		</form>
	);
};
