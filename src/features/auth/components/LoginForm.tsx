import { LoaderCircle } from "lucide-react";
import FormFields from "@/components/molecules/FormFields";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import type { FieldConfig } from "@/types/";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/authSchema";

import useAuth from "../hooks/useAuth";
const LoginForm = () => {
	const { login, loading } = useAuth();
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const loginFields: FieldConfig[] = [
		{
			name: "email",
			label: "Email",
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
							Remember Me
						</label>
						<a
							href="/"
							className="text-blue-500 dark:text-blue-300 hover:underline">
							Forgot Password?
						</a>
					</div>

					<Button
						type="submit"
						className="w-full p-6 bg-blue-500"
						disabled={loading}>
						{loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
						Login
					</Button>
					<div className="flex items-center text-sm">
						<p className="pr-2">New User?</p>
						<a
							href="/register"
							className="text-blue-500 dark:text-blue-300 hover:underline">
							Create an account
						</a>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default LoginForm;
