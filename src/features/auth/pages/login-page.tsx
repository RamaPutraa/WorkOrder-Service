import LoginForm from "@/features/auth/components/form-schema/login-form";

const LoginPage = () => {
	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
			<div className="w-full max-w-lg px-4 py-10">
				{/* Logo + Heading */}
				<div className="mb-8">
					<h2 className="text-2xl font-extrabold text-gray-900 mb-1">
						Masuk ke Akun Anda
					</h2>
					<p className="text-sm text-gray-500">
						Selamat datang kembali! Masukkan kredensial Anda untuk melanjutkan.
					</p>
				</div>

				{/* Form Card */}
				<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
					{/* Card Header */}
					<div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-100">
						<div>
							<h3 className="text-base font-semibold text-gray-900">
								Login Akun
							</h3>
							<p className="text-xs text-gray-500 mt-0.5">
								Gunakan email dan password yang terdaftar.
							</p>
						</div>
					</div>

					<LoginForm />
				</div>

				{/* Footer */}
				<p className="text-center text-sm text-gray-500 mt-6">
					Pengguna baru?{" "}
					<a
						href="/hero-regis"
						className="text-blue-600 font-semibold hover:underline">
						Daftar sekarang
					</a>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
