import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function MockExternalAuth() {
	const [searchParams] = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);

	const state = searchParams.get("state");
	const companyId = searchParams.get("company_id");
	const redirectUri = searchParams.get("redirect_uri") || "/dashboard/client/pairing/callback";

	const handleAuthorize = (allow: boolean) => {
		setIsLoading(true);
		setTimeout(() => {
			try {
				const url = new URL(redirectUri, window.location.origin);
				if (allow) {
					url.searchParams.set("code", "mock_success_code");
				} else {
					url.searchParams.set("error", "access_denied");
				}
				if (state) url.searchParams.set("state", state);
				if (companyId) url.searchParams.set("company_id", companyId);
				
				window.location.href = url.toString();
			} catch (e) {
				console.error("Invalid redirect URI");
				window.location.href = "/";
			}
		}, 1500);
	};

	return (
		<div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
			<div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-slate-100">
				{/* Header */}
				<div className="bg-slate-900 p-6 text-center">
					<h1 className="text-white text-xl font-semibold">
						Sistem Pihak Ketiga (Mock)
					</h1>
					<p className="text-slate-400 text-sm mt-1">Halaman Otorisasi Eksternal</p>
				</div>

				{/* Body */}
				<div className="p-8">
					<div className="flex justify-center mb-6">
						<div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl shadow-inner">
							🔗
						</div>
					</div>

					<h2 className="text-lg font-medium text-center text-slate-800 mb-2">
						Permintaan Akses Akun
					</h2>
					<p className="text-slate-500 text-center text-sm mb-8 leading-relaxed">
						Aplikasi Anda sedang meminta akses untuk melakukan integrasi dengan sistem pihak ketiga ini. 
						<br /><br />
						<span className="bg-slate-100 px-2 py-1 rounded text-xs font-mono text-slate-600">State: {state || "Unknown"}</span>
					</p>

					{/* Actions */}
					<div className="space-y-3">
						<button
							disabled={isLoading}
							onClick={() => handleAuthorize(true)}
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
						>
							{isLoading ? "Memproses..." : "Izinkan Akses"}
						</button>
						<button
							disabled={isLoading}
							onClick={() => handleAuthorize(false)}
							className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
						>
							Batal / Tolak
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
