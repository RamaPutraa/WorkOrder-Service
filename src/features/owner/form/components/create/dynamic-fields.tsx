import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { FieldItem } from "./field-item";
import { motion, AnimatePresence } from "framer-motion";

import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	closestCenter,
	type DragEndEvent,
	type UniqueIdentifier,
} from "@dnd-kit/core";

import {
	SortableContext,
	verticalListSortingStrategy,
	arrayMove,
} from "@dnd-kit/sortable";

import { SortableFieldWrapper } from "./sort-field-wrapper";
import { GripHorizontal } from "lucide-react";

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

	const sensors = useSensors(useSensor(PointerSensor));

	// ================= VALIDATION =================
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

	// ================= DRAG HANDLER =================
	const handleDragEnd = (e: DragEndEvent) => {
		const { active, over } = e;
		if (!over || active.id === over.id) return;

		const activeId = active.id as UniqueIdentifier;
		const overId = over.id as UniqueIdentifier;

		const oldIndex = fields.findIndex((f) => f.order === activeId);
		const newIndex = fields.findIndex((f) => f.order === overId);

		if (oldIndex === -1 || newIndex === -1) return;

		const reordered = arrayMove(fields, oldIndex, newIndex).map(
			(f, newOrderIndex) => ({
				...f,
				order: newOrderIndex + 1,
			})
		);

		reordered.forEach((f, i) => onUpdate(i, f));
	};

	const itemsIds = fields.map((f) => f.order);

	return (
		<DndContext
			onDragEnd={handleDragEnd}
			sensors={sensors}
			collisionDetection={closestCenter}>
			<SortableContext items={itemsIds} strategy={verticalListSortingStrategy}>
				<div className="space-y-6">
					<AnimatePresence>
						{fields.map((field, index) => (
							<SortableFieldWrapper key={field.order} id={field.order}>
								{({ listeners, attributes }) => (
									<motion.div
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
											{/* Indikator kiri */}
											<div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-l-lg" />

											{/* DRAG HANDLE BUTTON */}
											<button
												type="button"
												{...listeners}
												{...attributes}
												className="
													absolute 
													top-2 
													left-1/2 
													-translate-x-1/2
													cursor-grab 
													text-gray-500 
													hover:text-gray-700
													bg-white 
													rounded-full 
													p-1 
													shadow
												">
												<GripHorizontal size={18} />
											</button>

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
								)}
							</SortableFieldWrapper>
						))}
					</AnimatePresence>
				</div>
			</SortableContext>
		</DndContext>
	);
};
