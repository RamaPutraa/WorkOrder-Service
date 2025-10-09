import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldItem } from "./field-item";

type Props = {
	fields: Field[];
	onAdd: () => void;
	onRemove: (index: number) => void;
	onUpdate: (index: number, updated: Partial<Field>) => void;
};

export const DynamicFields: React.FC<Props> = ({
	fields,
	onAdd,
	onRemove,
	onUpdate,
}) => {
	return (
		<div className="space-y-6">
			{fields.map((field, index) => (
				<Card
					key={index}
					className="rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden relative">
					{/* Garis biru di kiri */}
					<div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-l-lg" />

					<div className="p-6">
						<FieldItem
							field={field}
							onRemove={() => onRemove(index)}
							onUpdate={(updated) => onUpdate(index, updated)}
						/>
					</div>
				</Card>
			))}

			{/* Tombol Tambah */}
			<div className="flex justify-center pt-4">
				<Button
					type="button"
					variant="outline"
					className="rounded-full px-6 py-2 text-blue-600 border-blue-500 hover:bg-blue-50"
					onClick={onAdd}>
					+ Tambah Pertanyaan
				</Button>
			</div>
		</div>
	);
};
