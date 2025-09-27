import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RegisterForm = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Password dan Confirm Password harus sama!");
			return;
		}

		console.log("Register data:", { username, email, password });
		// nanti ganti dengan API call register
	};

	return (
		<div>
			<form className="space-y-3" onSubmit={handleSubmit}>
				{/* Username */}
				<div className="space-y-2 ">
					<Label htmlFor="username">Username</Label>
					<Input
						id="username"
						type="text"
						placeholder="johndoe"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>

				{/* Email */}
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="johndoe@gmail.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				{/* Password */}
				<div className="space-y-2">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				{/* Confirm Password */}
				<div className="space-y-2">
					<Label htmlFor="confirmPassword">Confirm Password</Label>
					<Input
						id="confirmPassword"
						type="password"
						placeholder="••••••••"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</div>

				{/* Tombol Submit */}
				<Button type="submit" className="w-full p-6 bg-blue-500">
					Register
				</Button>

				{/* Link ke login */}
				<div className="flex items-center text-sm">
					<p className="pr-2">Already have an account?</p>
					<a
						href="/login"
						className="text-blue-500 dark:text-blue-300 hover:underline">
						Login here
					</a>
				</div>
			</form>
		</div>
	);
};

export default RegisterForm;
