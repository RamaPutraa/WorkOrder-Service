import React, { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Props = {
	field: Field;
	onUpdate: (updated: Partial<Field>) => void;
	error?: string;
};

export const FieldOption: React.FC<Props> = ({ field, onUpdate, error }) => {
	const options = field.options ?? [];
	const lastInputRef = useRef<HTMLInputElement | null>(null);

	// Tambahkan satu opsi otomatis saat pertama kali render
	useEffect(() => {
		if (options.length === 0) {
			onUpdate({
				options: [{ key: "option_1", value: "" }],
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleOptionChange = (index: number, value: string) => {
		const newOptions = options.map((opt, i) =>
			i === index ? { ...opt, value } : opt
		);
		onUpdate({ options: newOptions });
	};

	const handleAddOption = () => {
		const newKey = `option_${options.length + 1}`;
		onUpdate({
			options: [...options, { key: newKey, value: "" }],
		});
	};

	const handleRemoveOption = (index: number) => {
		onUpdate({
			options: options.filter((_, i) => i !== index),
		});
	};

	// Fokus otomatis ke input terakhir ketika opsi baru ditambahkan
	useEffect(() => {
		if (lastInputRef.current) {
			lastInputRef.current.focus();
		}
	}, [options.length]);

	return (
		<div className="grid grid-cols-4">
			<div className="space-y-1 col-span-3">
				<div className="space-y-3">
					{options.map((opt, idx) => (
						<div key={opt.key ?? idx} className="flex items-center gap-2">
							{/* Nomor urut di kiri */}
							<div className="w-6 text-center text-gray-500 text-sm">
								{idx + 1}.
							</div>

							{/* Input opsi */}
							<Input
								ref={idx === options.length - 1 ? lastInputRef : null}
								className={`flex-1 focus-visible:ring-0 focus-visible:border-primary ${
									error ? "border-red-300" : ""
								}`}
								value={opt.value}
								onChange={(e) => handleOptionChange(idx, e.target.value)}
								placeholder={`Opsi ${idx + 1}`}
							/>

							{/* Tombol hapus */}
							<Button
								variant="ghost"
								size="icon"
								onClick={() => handleRemoveOption(idx)}
								type="button"
								className="text-gray-500 hover:text-red-500">
								<X size={16} />
							</Button>
						</div>
					))}

					{/* Tombol ala Google Form */}
					<div className="flex items-center gap-2 text-sm text-gray-600 ml-6">
						<button
							type="button"
							onClick={handleAddOption}
							className="text-primary hover:underline">
							Tambahkan opsi
						</button>
					</div>
				</div>
				{error && <p className="text-sm text-red-500 mt-2 ml-6">{error}</p>}
			</div>
		</div>
	);
};
