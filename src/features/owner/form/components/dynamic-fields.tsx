import React from "react";
import { Card } from "@/components/ui/card";
import { FieldItem } from "./field-item";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
	fields: Field[];
	onRemove: (index: number) => void;
	onUpdate: (index: number, updated: Partial<Field>) => void;
};

export const DynamicFields: React.FC<Props> = ({
	fields,
	onRemove,
	onUpdate,
}) => {
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
						<Card className="rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden relative">
							{/* Garis biru di kiri */}
							<div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-l-lg" />

							<div className="p-6">
								<FieldItem
									field={field}
									onRemove={() => onRemove(index)}
									onUpdate={(updated) => onUpdate(index, updated)}
								/>
							</div>
						</Card>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
};
