import LoginForm from "@/features/auth/components/login-form";
import loginImage from "@/assets/images/auth_image.webp";
const LoginPage = () => {
	return (
		<>
			<div className="w-full max-w-4xl rounded-lg shadow border bg-card ">
				<div className="grid grid-cols-1 md:grid-cols-2 text-sm">
					<div className="relative hidden md:block ">
						<img
							src={loginImage}
							alt="Login Illustration"
							className="w-full h-full object-cover rounded-l-lg"
						/>
					</div>
					{/* Left side */}

					{/* Right side */}
					<div className="flex flex-col justify-center p-12 ">
						<div className="mb-4">
							<h3 className="text-2xl font-bold text-blue-500 dark:text-blue-500">
								Masuk
							</h3>
							<p className="mt-7 ">Selamat Datang! Masukan akun anda.</p>
						</div>
						<div className="mt-4 text-sm  text-center">
							<LoginForm />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
