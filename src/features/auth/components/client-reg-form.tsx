import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormFields from "@/shared/molecules/form-fields";
import useAuth from "../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { clientRegisterSchema } from "../schemas/authSchema";
import { z } from "zod";
import { LoaderCircle } from "lucide-react";
import type { FieldConfig } from "@/types/form";
const RegisterForm = () => {
	const { clientRegister, loading } = useAuth();
	const form = useForm<z.infer<typeof clientRegisterSchema>>({
		resolver: zodResolver(clientRegisterSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			password_confirmation: "",
		},
	});

	const registerFields: FieldConfig<z.infer<typeof clientRegisterSchema>>[] = [
		{
			name: "name",
			label: "Nama Pengguna",
			type: "text",
			placeholder: "John Doe",
		},
		{
			name: "email",
			label: "Alamat Email",
			type: "email",
			placeholder: "johndoe@gmail.com",
		},
		{
			name: "password",
			label: "Password",
			type: "password",
			placeholder: "••••••••",
		},
		{
			name: "password_confirmation",
			label: "Konfirmasi Password",
			type: "password",
			placeholder: "••••••••",
		},
	];

	const onSubmit = (data: z.infer<typeof clientRegisterSchema>) =>
		clientRegister(data);

	return (
		<div>
			<Form {...form}>
				<form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
					<FormFields fields={registerFields} control={form.control} />
					{/* Tombol Submit */}
					<Button
						type="submit"
						className="w-full p-6 bg-blue-500"
						disabled={loading}>
						{loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
						Daftar
					</Button>

					{/* Link ke login */}
					<div className="flex items-center text-sm">
						<p className="pr-2">Sudah punya akun?</p>
						<a
							href="/login"
							className="text-blue-500 dark:text-blue-300 hover:underline">
							Masuk
						</a>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default RegisterForm;
