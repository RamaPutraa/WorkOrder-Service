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
import { GripVertical } from "lucide-react";

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
				(f.type === "text" || f.type === "textarea" || f.type === "date") &&
				!f.placeholder?.trim()
			) {
				newErrors[i] = "Placeholder wajib diisi";
			}
		});
		setFieldErrors(newErrors);
	}, [fields, hasSubmitted]);

	const handleDragEnd = (e: DragEndEvent) => {
		const { active, over } = e;
		if (!over || active.id === over.id) return;
		const activeId = active.id as UniqueIdentifier;
		const overId = over.id as UniqueIdentifier;
		const oldIndex = fields.findIndex((f) => f.order === activeId);
		const newIndex = fields.findIndex((f) => f.order === overId);
		if (oldIndex === -1 || newIndex === -1) return;
		const reordered = arrayMove(fields, oldIndex, newIndex).map(
			(f, newOrderIndex) => ({ ...f, order: newOrderIndex + 1 }),
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
				<div className="space-y-3">
					<AnimatePresence>
						{fields.map((field, index) => (
							<SortableFieldWrapper key={field.order} id={field.order}>
								{({ listeners, attributes }) => (
									<motion.div
										initial={{ opacity: 0, y: 16 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -12 }}
										transition={{ duration: 0.25, ease: "easeOut" }}>
										<Card
											className={`rounded-2xl shadow-sm border overflow-hidden transition-shadow py-0 ${fieldErrors[index] ?
													"border-red-300 shadow-red-100"
													: "border-slate-200/80 hover:shadow-md"
												}`}>
											{/* Drag handle strip */}
											<div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-muted/20">
												{/* Field number badge */}
												<div className="flex items-center gap-2">
													<span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
														{index + 1}
													</span>
													<span className="text-xs text-muted-foreground font-medium">
														Pertanyaan {index + 1}
													</span>
												</div>

												<div className="flex items-center gap-2">
													<span className="text-xs text-muted-foreground font-medium">
														Ubah urutan pertanyaan
													</span>
													{/* Drag grip */}
													<button
														type="button"
														{...listeners}
														{...attributes}
														className="cursor-grab active:cursor-grabbing p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
														<GripVertical size={16} />
													</button>
												</div>
											</div>

											{/* Field content */}
											<div className="p-5 sm:p-6">
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
