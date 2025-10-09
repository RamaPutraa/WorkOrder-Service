import { LoaderCircle } from "lucide-react";
import FormFields from "@/shared/molecules/form-fields";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/authSchema";

import useAuth from "../hooks/useAuth";
import type { FieldConfig } from "@/types/form";
const LoginForm = () => {
	const { login, loading } = useAuth();
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const loginFields: FieldConfig<z.infer<typeof loginSchema>>[] = [
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
	];

	const onSubmit = (data: z.infer<typeof loginSchema>) => login(data);

	return (
		<div>
			<Form {...form}>
				<form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
					<FormFields fields={loginFields} control={form.control} />

					<div className="flex items-center justify-between text-sm py-3">
						<label className="flex items-center gap-2">
							<input type="checkbox" className="rounded border-gray-300" />
							Ingat Saya
						</label>
						<a
							href="/"
							className="text-blue-500 dark:text-blue-300 hover:underline">
							Lupa Password?
						</a>
					</div>

					<Button
						type="submit"
						className="w-full p-6 bg-blue-500"
						disabled={loading}>
						{loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
						Masuk
					</Button>
					<div className="flex items-center text-sm">
						<p className="pr-2">Pengguna Baru?</p>
						<a
							href="/register"
							className="text-blue-500 dark:text-blue-300 hover:underline">
							Daftar
						</a>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default LoginForm;
