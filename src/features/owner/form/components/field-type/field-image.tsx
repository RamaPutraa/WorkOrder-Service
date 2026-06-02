import React from "react";
import { ImageIcon, AlertCircle } from "lucide-react";

type Props = {
	field: Field;
	onUpdate: (updated: Partial<Field>) => void;
	error?: string;
};

export const FieldImage: React.FC<Props> = ({ error }) => (
	<div className="space-y-1.5">
		<div
			className={`flex flex-col  items-center justify-center gap-2 p-5 w-full rounded-xl border-2 border-dashed transition-colors ${error ?
				"border-red-200 bg-red-50/30 text-red-400"
				: "border-muted bg-muted/5"
				}`}>
			<div className="p-2 rounded-xl bg-muted text-muted-foreground">
				<ImageIcon className="w-5 h-5" />
			</div>
			<span className="text-xs font-medium  tracking-wider ">
				Upload Gambar
			</span>
			<span className="text-xs text-muted-foreground font-medium  tracking-wider ">
				Gambar maksimal 5MB (JPG/PNG/JPEG)
			</span>
		</div>
		{error && (
			<p className="text-xs text-red-500 flex items-center gap-1">
				<AlertCircle className="w-3 h-3 shrink-0" />
				{error}
			</p>
		)}
	</div>
);

export default FieldImage;
