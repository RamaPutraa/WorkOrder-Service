import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { UniqueIdentifier } from "@dnd-kit/core";

// Dapatkan tipe asli dari useSortable():
type SortableReturn = ReturnType<typeof useSortable>;

type DragHandleProps = {
	listeners: SortableReturn["listeners"];
	attributes: SortableReturn["attributes"];
};

type Props = {
	id: UniqueIdentifier;
	children: (drag: DragHandleProps) => React.ReactNode;
};

export const SortableFieldWrapper: React.FC<Props> = ({ id, children }) => {
	const sortable = useSortable({ id });

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(sortable.transform),
		transition: sortable.transition,
	};

	return (
		<div ref={sortable.setNodeRef} style={style}>
			{children({
				listeners: sortable.listeners,
				attributes: sortable.attributes,
			})}
		</div>
	);
};
