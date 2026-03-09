import { ChevronLeft, Building2, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyRegForm from "../components/form-schema/company-reg-form";
import StaffRegForm from "../components/form-schema/staff-reg-form";
import { useNavigate } from "react-router-dom";

const InternalPageForm = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
			<div className="w-full max-w-lg">
				{/* Back + Logo */}
				<div className="mb-8">
					<button
						onClick={() => navigate(-1)}
						className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6 group">
						<ChevronLeft
							size={16}
							className="group-hover:-translate-x-0.5 transition-transform"
						/>
						Kembali
					</button>

					<h2 className="text-2xl font-extrabold text-gray-900 mb-1">
						Pendaftaran Akun
					</h2>
					<p className="text-sm text-gray-500">
						Pilih jenis akun yang ingin Anda daftarkan.
					</p>
				</div>

				{/* Tabs */}
				<Tabs defaultValue="company" className="w-full">
					{/* Custom Tab Triggers */}
					<TabsList className="grid grid-cols-2 w-full h-auto p-1 bg-gray-100 rounded-xl mb-6">
						<TabsTrigger
							value="company"
							className="flex items-center gap-2 py-2.5 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all">
							<Building2 size={15} />
							Perusahaan
						</TabsTrigger>
						<TabsTrigger
							value="staff"
							className="flex items-center gap-2 py-2.5 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all">
							<Users size={15} />
							Pegawai
						</TabsTrigger>
					</TabsList>

					{/* Tab: Perusahaan */}
					<TabsContent value="company">
						<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 ">
							<div className="mb-5 border-b border-slate-100 pb-5">
								<h3 className="text-base font-semibold text-gray-900">
									Akun Perusahaan
								</h3>
								<p className="text-xs text-gray-500 mt-1">
									Akun ini akan otomatis mendapatkan role{" "}
									<span className="font-semibold text-blue-600">Owner</span>.
								</p>
							</div>
							<CompanyRegForm />
						</div>
					</TabsContent>

					{/* Tab: Pegawai */}
					<TabsContent value="staff">
						<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
							<div className="mb-5 border-b border-slate-100 pb-5">
								<h3 className="text-base font-semibold text-gray-900">
									Akun Pegawai
								</h3>
								<p className="text-xs text-gray-500 mt-1">
									Daftarkan pegawai ke dalam perusahaan yang sudah terdaftar.
								</p>
							</div>
							<StaffRegForm />
						</div>
					</TabsContent>
				</Tabs>

				{/* Footer */}
				<p className="text-center text-sm text-gray-500 mt-6">
					Sudah punya akun?{" "}
					<a
						href="/login/"
						className="text-blue-600 font-semibold hover:underline">
						Masuk
					</a>
				</p>
			</div>
		</div>
	);
};

export default InternalPageForm;
