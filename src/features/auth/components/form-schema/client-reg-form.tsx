import { LoaderCircle, ArrowRight } from "lucide-react";
import { Form } from "@/components/ui/form";
import FormFields from "@/shared/molecules/form-fields";
import useAuth from "../../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { clientRegisterSchema } from "../../schemas/authSchema";
import { z } from "zod";

const ClientRegForm = () => {
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

	const registerFields: FieldConfig[] = [
		{
			name: "name",
			label: "Nama Lengkap",
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

	const onSubmit = (data: z.infer<typeof clientRegisterSchema>) => {
		clientRegister({ ...data, role: "client" });
	};

	return (
		<Form {...form}>
			<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
				<FormFields fields={registerFields} control={form.control} />

				<button
					type="submit"
					disabled={loading}
					className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm">
					{loading ?
						<LoaderCircle className="h-4 w-4 animate-spin" />
					:	<ArrowRight size={15} />}
					{loading ? "Mendaftarkan..." : "Daftar Sekarang"}
				</button>
			</form>
		</Form>
	);
};

export default ClientRegForm;
