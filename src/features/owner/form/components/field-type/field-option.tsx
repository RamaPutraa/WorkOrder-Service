import React, { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus, AlertCircle } from "lucide-react";

type Props = {
	field: Field;
	onUpdate: (updated: Partial<Field>) => void;
	error?: string;
};

export const FieldOption: React.FC<Props> = ({ field, onUpdate, error }) => {
	const options = field.options ?? [];
	const lastInputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (options.length === 0) {
			onUpdate({ options: [{ key: Date.now().toString(), value: "" }] });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleOptionChange = (index: number, value: string) => {
		const newOptions = options.map((opt, i) =>
			i === index ? { ...opt, value } : opt,
		);
		onUpdate({ options: newOptions });
	};

	const handleAddOption = () => {
		const newKey = Date.now().toString();
		onUpdate({ options: [...options, { key: newKey, value: "" }] });
	};

	const handleRemoveOption = (index: number) => {
		onUpdate({ options: options.filter((_, i) => i !== index) });
	};

	useEffect(() => {
		if (lastInputRef.current) lastInputRef.current.focus();
	}, [options.length]);

	return (
		<div className="space-y-2">
			<div className="space-y-2 max-w-sm">
				{options.map((opt, idx) => (
					<div key={opt.key ?? idx} className="flex items-center gap-2">
						{/* Number */}
						<span className="w-5 text-center text-xs text-muted-foreground shrink-0">
							{idx + 1}.
						</span>

						{/* Input */}
						<Input
							ref={idx === options.length - 1 ? lastInputRef : null}
							className={`h-9 flex-1 rounded-lg text-sm ${
								error ?
									"border-red-300 focus-visible:ring-red-300"
								:	"focus-visible:ring-primary/30"
							}`}
							value={opt.value}
							onChange={(e) => handleOptionChange(idx, e.target.value)}
							placeholder={`Opsi ${idx + 1}`}
						/>

						{/* Remove */}
						<Button
							variant="ghost"
							size="icon"
							onClick={() => handleRemoveOption(idx)}
							type="button"
							className="h-8 w-8 shrink-0 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
							<X size={14} />
						</Button>
					</div>
				))}

				{/* Add option */}
				<button
					type="button"
					onClick={handleAddOption}
					className="flex items-center gap-1.5 ml-7 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
					<Plus size={13} />
					Tambahkan opsi
				</button>
			</div>

			{error && (
				<p className="text-xs text-red-500 flex items-center gap-1">
					<AlertCircle className="w-3 h-3 shrink-0" />
					{error}
				</p>
			)}
		</div>
	);
};
