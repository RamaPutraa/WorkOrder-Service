import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

export const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-950 text-white">
			<div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
				{/* Top grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
					{/* Brand */}
					<div>
						<div className="flex items-center gap-2 mb-4">
							<div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
								<span className="text-white font-bold text-sm">W</span>
							</div>
							<span className="font-bold text-white text-lg tracking-tight">
								WorkOrder
							</span>
						</div>
						<p className="text-sm text-gray-400 leading-relaxed max-w-xs">
							Platform manajemen work order digital yang membantu organisasi
							beroperasi lebih efisien dan modern.
						</p>
					</div>

					{/* Navigation */}
					<div>
						<h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
							Navigasi
						</h3>
						<ul className="space-y-2.5">
							{[
								{ label: "Beranda", href: "/" },
								{ label: "Tentang Kami", href: "/about" },
								{ label: "Kontak", href: "/contact" },
							].map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Contact & Social */}
					<div>
						<h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
							Hubungi Kami
						</h3>
						<a
							href="mailto:support@workorder.xyz"
							className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-5">
							<Mail className="h-4 w-4 text-blue-400 shrink-0" />
							support@workorder.xyz
						</a>
						<div className="flex gap-2">
							{[
								{ Icon: Facebook, label: "Facebook" },
								{ Icon: Twitter, label: "Twitter" },
								{ Icon: Instagram, label: "Instagram" },
							].map(({ Icon, label }) => (
								<button
									key={label}
									aria-label={label}
									className="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-600 flex items-center justify-center transition-all duration-200 group">
									<Icon className="h-4 w-4 text-gray-400 group-hover:text-white" />
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Divider */}
				<Separator className="my-8 bg-white/10" />

				{/* Bottom bar */}
				<div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500">
					<p>© {currentYear} WorkOrder. Semua hak dilindungi.</p>
					<div className="flex gap-5">
						<a
							href="/privacy"
							className="hover:text-gray-300 transition-colors">
							Kebijakan Privasi
						</a>
						<a href="/terms" className="hover:text-gray-300 transition-colors">
							Syarat & Ketentuan
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
