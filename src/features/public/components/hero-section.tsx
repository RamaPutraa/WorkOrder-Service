import { Download, BookOpen } from "lucide-react";
import bgVector from "../../../assets/images/bg-vector-svg.svg";
import woLogo from "../../../assets/wo-logo-vector.svg";

const HeroSection = () => {
	return (
		<section
			className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

			{/* Animated Background Layers */}
			<style>{`
				@keyframes bgDrift1 {
					0%   { transform: translate(0%, 0%) scale(1.25); }
					25%  { transform: translate(2%, -1.5%) scale(1.27); }
					50%  { transform: translate(-1%, 1%) scale(1.25); }
					75%  { transform: translate(1.5%, 0.5%) scale(1.23); }
					100% { transform: translate(0%, 0%) scale(1.25); }
				}
				@keyframes bgDrift2 {
					0%   { transform: translate(0%, 0%) scale(1.35) rotate(0deg); }
					33%  { transform: translate(-3%, 2%) scale(1.38) rotate(1deg); }
					66%  { transform: translate(2%, -1%) scale(1.33) rotate(-0.5deg); }
					100% { transform: translate(0%, 0%) scale(1.35) rotate(0deg); }
				}
				@keyframes bgDrift3 {
					0%   { transform: translate(0%, 0%) scale(1.15) rotate(0deg); }
					50%  { transform: translate(3%, 1.5%) scale(1.18) rotate(-1deg); }
					100% { transform: translate(0%, 0%) scale(1.15) rotate(0deg); }
				}

				/* Mobile: gentler animation, fewer layers */
				@keyframes bgDriftMobile {
					0%   { transform: translate(0%, 0%) scale(1.6); }
					50%  { transform: translate(1%, -0.5%) scale(1.62); }
					100% { transform: translate(0%, 0%) scale(1.6); }
				}

				@media (max-width: 639px) {
					.hero-bg-layer1 {
						background-size: 280% !important;
						animation: bgDriftMobile 30s ease-in-out infinite !important;
						opacity: 0.45 !important;
					}
					.hero-bg-layer2,
					.hero-bg-layer3 {
						display: none !important;
					}
				}
			`}</style>

			{/* Layer 1 — Primary (main vector lines) */}
			<div
				className="hero-bg-layer1 absolute inset-0 pointer-events-none"
				aria-hidden="true"
				style={{
					backgroundImage: `url(${bgVector})`,
					backgroundSize: "125%",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					opacity: 0.55,
					animation: "bgDrift1 25s ease-in-out infinite",
					willChange: "transform",
				}}
			/>

			{/* Layer 2 — Slower, larger, subtle overlay */}
			<div
				className="hero-bg-layer2 absolute inset-0 pointer-events-none"
				aria-hidden="true"
				style={{
					backgroundImage: `url(${bgVector})`,
					backgroundSize: "135%",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					opacity: 0.15,
					animation: "bgDrift2 35s ease-in-out infinite",
					willChange: "transform",
				}}
			/>

			{/* Layer 3 — Smallest drift, tightest scale */}
			<div
				className="hero-bg-layer3 absolute inset-0 pointer-events-none"
				aria-hidden="true"
				style={{
					backgroundImage: `url(${bgVector})`,
					backgroundSize: "115%",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					opacity: 0.1,
					animation: "bgDrift3 20s ease-in-out infinite",
					willChange: "transform",
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
						href="https://github.com/LianggaRistiana/workorder_company_app/releases"
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
						href="https://docs.lianggaristiana.site/work-order-testing"
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
						Dokumentasi Testing
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
