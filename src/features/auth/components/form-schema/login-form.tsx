import { LoaderCircle, ArrowRight } from "lucide-react";
import FormFields from "@/shared/molecules/form-fields";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schemas/authSchema";
import useAuth from "../../hooks/useAuth";

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
		<Form {...form}>
			<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
				<FormFields fields={loginFields} control={form.control} />

				<div className="flex items-center justify-between text-xs text-gray-500 pt-1">
					<label className="flex items-center gap-1.5 cursor-pointer select-none">
						<input
							type="checkbox"
							className="rounded border-gray-300 accent-blue-600"
						/>
						Ingat Saya
					</label>
					<a href="/" className="text-blue-600 hover:underline font-medium">
						Lupa Password?
					</a>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full mt-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm">
					{loading ?
						<LoaderCircle className="h-4 w-4 animate-spin" />
					:	<ArrowRight size={15} />}
					{loading ? "Memproses..." : "Masuk"}
				</button>
			</form>
		</Form>
	);
};

export default LoginForm;
