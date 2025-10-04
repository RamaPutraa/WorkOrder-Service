import type { FieldConfig } from "@/types";
import { useForm } from "react-hook-form";
import { registerCompanySchema } from "../../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormFields from "@/shared/molecules/form-fields";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { Form } from "@/components/ui/form";
const CompanyRegForm = () => {
	const { loading, registerCompany } = useAuth();
	const form = useForm<z.infer<typeof registerCompanySchema>>({
		resolver: zodResolver(registerCompanySchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			companyName: "",
		},
	});

	const registerCompanyFields: FieldConfig[] = [
		{
			name: "name",
			label: "Username",
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
			name: "companyName",
			label: "Nama Perusahaan",
			type: "text",
			placeholder: "PT Citra Abadi",
		},
	];

	const onSubmit = (data: z.infer<typeof registerCompanySchema>) =>
		registerCompany(data);

	return (
		<div>
			<Form {...form}>
				<form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
					<FormFields fields={registerCompanyFields} control={form.control} />
					{/* Tombol Submit */}
					<div className="flex justify-center">
						<Button
							type="submit"
							className="w-full sm:w-auto px-6 py-5 mt-3 bg-primary"
							disabled={loading}>
							{loading && (
								<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
							)}
							Daftar
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default CompanyRegForm;
