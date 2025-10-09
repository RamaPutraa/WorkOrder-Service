import React, { useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Field } from "../../types/form";

type Props = {
	field: Field;
	onUpdate: (updated: Partial<Field>) => void;
};

export const FieldCheckbox: React.FC<Props> = ({ field, onUpdate }) => {
	const options = field.options ?? [];
	const lastInputRef = useRef<HTMLInputElement | null>(null);

	// Saat pertama kali render, jika belum ada opsi -> tambahkan 1 otomatis
	useEffect(() => {
		if (options.length === 0) {
			onUpdate?.({ options: [{ value: "" }] });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleOptionChange = (index: number, value: string) => {
		const newOptions = options.map((opt, i) =>
			i === index ? { ...opt, value } : opt
		);
		onUpdate?.({ options: newOptions });
	};

	const handleAddOption = () => {
		onUpdate?.({ options: [...options, { value: "" }] });
	};

	const handleRemoveOption = (index: number) => {
		onUpdate?.({ options: options.filter((_, i) => i !== index) });
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
						<div key={idx} className="flex items-center gap-2">
							<Checkbox disabled />
							<Input
								ref={idx === options.length - 1 ? lastInputRef : null}
								className="flex-1"
								value={opt.value}
								onChange={(e) => handleOptionChange(idx, e.target.value)}
								placeholder={`Opsi ${idx + 1}`}
							/>
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
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<Checkbox disabled />
						<button
							type="button"
							onClick={handleAddOption}
							className="text-primary hover:underline">
							Tambahkan opsi
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
