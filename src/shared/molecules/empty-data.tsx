import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { FileQuestionMark } from "lucide-react";

export function EmptyData() {
	return (
		<Empty className="border-2 border-dashed">
			<EmptyHeader>
				<EmptyMedia variant="icon" className="bg-primary/5 text-primary ">
					<FileQuestionMark />
				</EmptyMedia>
				<EmptyTitle className="text-sm">Tidak ada data.</EmptyTitle>
				<EmptyDescription className="text-sm">
					Data yang anda cari belum tersedia.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
