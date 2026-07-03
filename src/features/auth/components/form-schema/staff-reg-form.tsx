import { useForm } from "react-hook-form";
import { registerStaffSchema } from "../../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormFields from "@/shared/molecules/form-fields";
import { LoaderCircle, ArrowRight } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { Form } from "@/components/ui/form";

const StaffRegForm = () => {
	const { loading, staffRegister } = useAuth();
	const form = useForm<z.infer<typeof registerStaffSchema>>({
		resolver: zodResolver(registerStaffSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const registerStaffFields: FieldConfig[] = [
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
			name: "confirmPassword",
			label: "Konfirmasi Password",
			type: "password",
			placeholder: "••••••••",
		},
	];

	const onSubmit = (data: z.infer<typeof registerStaffSchema>) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { confirmPassword: _confirm, ...payload } = data;
		staffRegister({ ...payload, role: "staff_unassigned" });
	};

	return (
		<Form {...form}>
			<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
				<FormFields fields={registerStaffFields} control={form.control} />

				<button
					type="submit"
					disabled={loading}
					className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm">
					{loading ?
						<LoaderCircle className="h-4 w-4 animate-spin" />
					:	<ArrowRight size={15} />}
					{loading ? "Mendaftarkan..." : "Daftar sebagai Pegawai"}
				</button>
			</form>
		</Form>
	);
};

export default StaffRegForm;
