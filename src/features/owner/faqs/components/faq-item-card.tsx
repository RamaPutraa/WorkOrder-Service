import { FileText, Trash2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useDialogStore } from "@/store/dialogStore";

interface FaqItemCardProps {
	item: FaqItem;
	onDelete: (id: number) => Promise<void>;
	onViewText?: (item: FaqItem) => void;
	index: number;
}

const formatDate = (dateStr: string) => {
	if (!dateStr) return "-";
	return new Date(dateStr).toLocaleDateString("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
};

const formatSize = (bytes?: number | null) => {
	if (!bytes) return "-";
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function FaqItemCard({ item, onDelete, onViewText }: FaqItemCardProps) {
	const { showDialog } = useDialogStore();
	const isPdf = item.type === "PDF";

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		showDialog({
			title: "Hapus Item FAQ",
			description: `Apakah Anda yakin ingin menghapus "${item.title}"? Tindakan ini tidak dapat dibatalkan.`,
			confirmText: "Hapus",
			cancelText: "Batal",
			onConfirm: () => onDelete(item.id),
		});
	};

	const handleClickCard = () => {
		if (isPdf && item.file_url) {
			window.open(item.file_url, "_blank", "noopener,noreferrer");
		} else if (!isPdf && onViewText) {
			onViewText(item);
		}
	};

	return (
		<motion.div
			onClick={handleClickCard}
			whileHover={{ scale: 1.02, y: -4 }}
			transition={{ duration: 0.2, ease: "easeOut" }}
			className="group bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 overflow-hidden cursor-pointer">
			<div className="p-5">
				{/* Header row */}
				<div className="flex items-start gap-3">
					{/* Icon */}
					<div
						className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
							isPdf ? "bg-rose-50 text-rose-500" : "bg-blue-50 text-blue-500"
						}`}>
						<FileText className="w-5 h-5" />
					</div>

					{/* Title + badges */}
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 flex-wrap">
							<h3 className="text-sm font-bold text-slate-800 truncate ">
								{item.title}
							</h3>
							<Badge
								className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border-0 shrink-0 ${
									isPdf ?
										"bg-rose-50 text-rose-600"
									:	"bg-blue-50 text-blue-600"
								}`}>
								{isPdf ? "PDF" : "TEXT"}
							</Badge>
						</div>

						{/* Meta info */}
						<div className="flex items-center gap-3 mt-1 flex-wrap">
							<span className="flex items-center gap-1 text-xs text-slate-400">
								<Calendar className="w-3 h-3" />
								{formatDate(item.created_at)}
							</span>
							{isPdf && item.size && (
								<span className="text-xs text-slate-400">
									{formatSize(item.size)}
								</span>
							)}
						</div>
					</div>

					{/* Actions */}
					<div className="flex items-center gap-1.5 shrink-0">
						<button
							id={`faq-delete-${item.id}`}
							onClick={handleDelete}
							title="Hapus FAQ"
							className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150">
							<Trash2 className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
