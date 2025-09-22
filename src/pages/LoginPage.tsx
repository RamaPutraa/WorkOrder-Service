import ToogleTheme from "@/components/atoms/toogle-theme";

const LoginPage = () => {
	return (
		<>
			<div className="w-full max-w-3xl p-8 rounded-lg shadow border bg-background">
				<div className="grid grid-cols-2">
					<div className="left-side">
						<ToogleTheme />
					</div>
					<div className="right-side">
						<div className="flex justify-center">
							<h3>Login</h3>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
