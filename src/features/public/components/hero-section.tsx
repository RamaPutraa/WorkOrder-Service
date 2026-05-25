import { Download, BookOpen } from "lucide-react";
import bgVector from "../../../assets/images/bg-vector-svg.svg";
import woLogo from "../../../assets/wo-logo-vector.svg";

const HeroSection = () => {
	return (
		<section
			className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
			{/* Background Vector — stretched across full section */}
			<div
				className="absolute inset-0 pointer-events-none"
				aria-hidden="true"
				style={{
					backgroundImage: `url(${bgVector})`,
					backgroundSize: "125%",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					opacity: 0.65,
				}}
			/>



			{/* Hero Content */}
			<div className="relative z-10 flex flex-col items-center text-center px-6 max-w-6xl mx-auto -mt-20">
				{/* Logo */}
				<div className="mb-8 flex items-center justify-center">
					<div
						className="flex items-center justify-center">
						<img
							src={woLogo}
							alt="Work Order Logo"
							className="w-7 h-7 object-contain drop-shadow-md pr-2"
						/>
						<span className="text-2xl font-semibold" style={{
							color: "#0f172a",
						}}>Work Order</span>
					</div>
				</div>



				{/* Main Title */}
				<h1
					className="text-4xl sm:text-5xl lg:text-8xl font-light leading-tight tracking-tight mb-6"
					style={{
						color: "#0f172a",
						letterSpacing: "-0.02em",
					}}>
					Sistem Manajemen{" "}
					<br />
					<span
						style={{
							background: "linear-gradient(90deg, #2563eb, #3b82f6)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
						}}>
						Work Order
					</span>
				</h1>



				{/* CTA Buttons */}
				<div className="flex flex-wrap items-center justify-center gap-4">
					{/* Left: Download Android */}
					<a
						href="#"
						id="btn-download-android"
						className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200"
						style={{
							background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
							boxShadow: "0 4px 18px rgba(37,99,235,0.45)",
						}}
						onMouseEnter={e => {
							(e.currentTarget as HTMLAnchorElement).style.boxShadow =
								"0 8px 28px rgba(37,99,235,0.55)";
							(e.currentTarget as HTMLAnchorElement).style.transform =
								"translateY(-2px)";
						}}
						onMouseLeave={e => {
							(e.currentTarget as HTMLAnchorElement).style.boxShadow =
								"0 4px 18px rgba(37,99,235,0.45)";
							(e.currentTarget as HTMLAnchorElement).style.transform =
								"translateY(0)";
						}}>
						<Download size={18} />
						Unduh Versi Aplikasi Android
					</a>

					{/* Right: Documentation */}
					<a
						href="#"
						id="btn-documentation"
						className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 border"
						style={{
							background: "rgba(255,255,255,0.85)",
							borderColor: "rgba(59,130,246,0.25)",
							color: "#1e40af",
							backdropFilter: "blur(8px)",
							boxShadow: "0 2px 12px rgba(59,130,246,0.1)",
						}}
						onMouseEnter={e => {
							(e.currentTarget as HTMLAnchorElement).style.background =
								"rgba(239,246,255,0.95)";
							(e.currentTarget as HTMLAnchorElement).style.borderColor =
								"rgba(59,130,246,0.45)";
							(e.currentTarget as HTMLAnchorElement).style.transform =
								"translateY(-2px)";
							(e.currentTarget as HTMLAnchorElement).style.boxShadow =
								"0 6px 20px rgba(59,130,246,0.18)";
						}}
						onMouseLeave={e => {
							(e.currentTarget as HTMLAnchorElement).style.background =
								"rgba(255,255,255,0.85)";
							(e.currentTarget as HTMLAnchorElement).style.borderColor =
								"rgba(59,130,246,0.25)";
							(e.currentTarget as HTMLAnchorElement).style.transform =
								"translateY(0)";
							(e.currentTarget as HTMLAnchorElement).style.boxShadow =
								"0 2px 12px rgba(59,130,246,0.1)";
						}}>
						<BookOpen size={18} />
						Dokumentasi
					</a>
				</div>


			</div>

			{/* Bottom decorative fade */}
			<div
				className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
				aria-hidden="true"
				style={{
					background:
						"linear-gradient(to top, rgba(240,246,255,0.6) 0%, transparent 100%)",
				}}
			/>
		</section>
	);
};

export default HeroSection;
