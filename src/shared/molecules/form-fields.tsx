import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Control, FieldValues } from "react-hook-form";
import type { FieldConfig } from "@/types/form";

type Props<T extends FieldValues> = {
	fields: FieldConfig<T>[];
	control: Control<T>;
};

export default function FormFields<T extends FieldValues>({
	fields,
	control,
}: Props<T>) {
	return (
		<>
			{fields.map((field) => (
				<FormField
					key={field.name}
					control={control}
					name={field.name}
					render={({ field: inputField }) => (
						<FormItem>
							<FormLabel>{field.label}</FormLabel>
							<FormControl>
								{field.type === "textarea" ? (
									<Textarea {...inputField} placeholder={field.placeholder} />
								) : (
									<Input
										{...inputField}
										type={field.type}
										placeholder={field.placeholder}
									/>
								)}
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			))}
		</>
	);
}
