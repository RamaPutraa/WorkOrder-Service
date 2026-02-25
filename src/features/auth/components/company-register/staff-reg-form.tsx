import { ArrowRight } from "lucide-react";

// TODO: Sambungkan dengan schema dan useAuth ketika siap
const StaffRegForm = () => {
	return (
		<form className="space-y-4">
			{/* Company Code */}
			<div className="space-y-1.5">
				<label className="block text-sm font-medium text-gray-700">
					Kode Perusahaan
				</label>
				<input
					type="text"
					placeholder="Contoh: COMP-XXXX"
					className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
				/>
			</div>

			{/* Name */}
			<div className="space-y-1.5">
				<label className="block text-sm font-medium text-gray-700">
					Nama Lengkap
				</label>
				<input
					type="text"
					placeholder="John Doe"
					className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
				/>
			</div>

			{/* Email */}
			<div className="space-y-1.5">
				<label className="block text-sm font-medium text-gray-700">
					Alamat Email
				</label>
				<input
					type="email"
					placeholder="johndoe@gmail.com"
					className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
				/>
			</div>

			{/* Password */}
			<div className="space-y-1.5">
				<label className="block text-sm font-medium text-gray-700">
					Password
				</label>
				<input
					type="password"
					placeholder="••••••••"
					className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
				/>
			</div>

			{/* Submit */}
			<button
				type="submit"
				className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm">
				<ArrowRight size={15} />
				Daftar sebagai Pegawai
			</button>
		</form>
	);
};

export default StaffRegForm;
