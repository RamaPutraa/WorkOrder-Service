import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
	return (
		<footer className="bg-primary text-background mt-12">
			<div className="max-w-7xl mx-auto px-6 py-12">
				{/* Bagian atas */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Brand */}
					<div>
						<h2 className="text-2xl font-bold">Manpits</h2>
						<p className="text-sm text-blue-100 mt-2">
							Platform manajemen digital yang membantu organisasi beroperasi
							dengan efisien dan modern.
						</p>
					</div>

					{/* Navigasi */}
					<div>
						<h3 className="text-lg font-semibold mb-3">Navigasi</h3>
						<ul className="space-y-2 text-blue-100">
							<li>
								<a href="/" className="hover:text-white transition-colors">
									Beranda
								</a>
							</li>
							<li>
								<a href="/about" className="hover:text-white transition-colors">
									Tentang Kami
								</a>
							</li>
							<li>
								<a
									href="/services"
									className="hover:text-white transition-colors">
									Layanan
								</a>
							</li>
							<li>
								<a
									href="/contact"
									className="hover:text-white transition-colors">
									Kontak
								</a>
							</li>
						</ul>
					</div>

					{/* Kontak & Sosial */}
					<div>
						<h3 className="text-lg font-semibold mb-3">Hubungi Kami</h3>
						<p className="text-sm text-blue-100 mb-3 flex items-center gap-2">
							<Mail className="h-4 w-4" /> support@manpits.xyz
						</p>

						<div className="flex gap-3">
							<Button
								size="icon"
								variant="secondary"
								className="bg-white/10 hover:bg-white/20">
								<Facebook className="h-4 w-4 text-white" />
							</Button>
							<Button
								size="icon"
								variant="secondary"
								className="bg-white/10 hover:bg-white/20">
								<Twitter className="h-4 w-4 text-white" />
							</Button>
							<Button
								size="icon"
								variant="secondary"
								className="bg-white/10 hover:bg-white/20">
								<Instagram className="h-4 w-4 text-white" />
							</Button>
							<Button
								size="icon"
								variant="secondary"
								className="bg-white/10 hover:bg-white/20">
								<Github className="h-4 w-4 text-white" />
							</Button>
						</div>
					</div>
				</div>

				{/* Garis pemisah */}
				<Separator className="my-8 bg-blue-400/40" />

				{/* Bagian bawah */}
				<div className="flex flex-col md:flex-row justify-between items-center text-sm text-blue-100">
					<p>© {new Date().getFullYear()} Manpits. Semua hak dilindungi.</p>
					<div className="flex gap-4 mt-3 md:mt-0">
						<a href="/privacy" className="hover:text-white transition-colors">
							Kebijakan Privasi
						</a>
						<a href="/terms" className="hover:text-white transition-colors">
							Syarat & Ketentuan
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
