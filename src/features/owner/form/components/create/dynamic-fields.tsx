import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { FieldItem } from "./field-item";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
	fields: Field[];
	onRemove: (index: number) => void;
	onUpdate: (index: number, updated: Partial<Field>) => void;
	hasSubmitted?: boolean;
};

export const DynamicFields: React.FC<Props> = ({
	fields,
	onRemove,
	onUpdate,
	hasSubmitted = false,
}) => {
	const [fieldErrors, setFieldErrors] = useState<Record<number, string>>({});

	// === Auto-validate setiap kali fields berubah ===
	useEffect(() => {
		if (!hasSubmitted) return;
		const newErrors: Record<number, string> = {};

		fields.forEach((f, i) => {
			if (!f.label?.trim()) newErrors[i] = "Pertanyaan wajib diisi";
			else if (f.type === "number") {
				if (
					typeof f.min === "number" &&
					typeof f.max === "number" &&
					f.min > f.max
				) {
					newErrors[i] = "Nilai minimum tidak boleh lebih besar dari maksimum";
				}
			} else if (
				(f.type === "multi_select" || f.type === "single_select") &&
				(!f.options || f.options.length === 0)
			) {
				newErrors[i] = "Minimal harus ada 1 opsi jawaban";
			} else if (
				(f.type === "text" || f.type === "textarea") &&
				!f.placeholder?.trim()
			) {
				newErrors[i] = "Placeholder wajib diisi";
			}
		});

		setFieldErrors(newErrors);
	}, [fields, hasSubmitted]);

	return (
		<div className="space-y-6">
			<AnimatePresence>
				{fields.map((field, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3, ease: "easeOut" }}>
						<Card
							className={`rounded-lg shadow-sm border ${
								fieldErrors[index]
									? "border-red-300"
									: "border-gray-200 hover:shadow-md"
							} transition overflow-hidden relative`}>
							{/* Garis biru di kiri */}
							<div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-l-lg" />

							<div className="p-6">
								<FieldItem
									field={field}
									onRemove={() => onRemove(index)}
									onUpdate={(updated) => {
										onUpdate(index, updated);
										if (fieldErrors[index]) {
											setFieldErrors((prev) => {
												const copy = { ...prev };
												delete copy[index];
												return copy;
											});
										}
									}}
									error={fieldErrors[index]}
								/>
							</div>
						</Card>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
};
