import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function PairingCallback() {
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const code = searchParams.get("code");
		const state = searchParams.get("state");
		const companyId = searchParams.get("company_id");
		const error = searchParams.get("error");

		// Kirim data kembali ke window parent (halaman utama)
		if (window.opener) {
			window.opener.postMessage(
				{
					type: "OAUTH_CALLBACK",
					payload: { company_id: companyId, code, state, error },
				},
				window.location.origin,
			);

			// Menutup jendela popup secara otomatis
			window.close();
		}
	}, [searchParams]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
			<div className="text-center bg-white p-8 rounded-xl shadow-sm border border-slate-100">
				<div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4 mx-auto"></div>
				<h2 className="text-lg font-medium text-slate-800">
					Menyelesaikan Autentikasi...
				</h2>
				<p className="text-slate-500 mt-2 text-sm">
					Jendela ini akan segera tertutup secara otomatis.
				</p>
				{!window.opener && (
					<p className="text-red-500 mt-4 text-sm bg-red-50 p-3 rounded text-left">
						Terjadi kesalahan komunikasi dengan halaman utama. Anda dapat
						menutup jendela/tab ini secara manual.
					</p>
				)}
			</div>
		</div>
	);
}
