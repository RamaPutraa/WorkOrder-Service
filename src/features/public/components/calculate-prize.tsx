import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LandingPage = () => {
	return (
		<section className="bg-primary flex flex-col items-center justify-center text-center text-white py-15">
			{/* Headline */}
			<h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
				Optimize preventive maintenance <br />
				for <span className="text-yellow-500">peak production</span>
			</h1>

			{/* Subheadline */}
			<p className="mt-6 text-lg text-gray-300 max-w-2xl">
				Slash downtime, simplify work orders, and give your team real-time
				visibility to stay ahead of failures—so operations never miss a beat.
			</p>

			{/* Buttons */}
			<div className="mt-10 flex flex-wrap items-center justify-center gap-4">
				<Button
					asChild
					size="lg"
					variant="outline"
					className="bg-transparent text-background border-background hover:bg-amber-400">
					<Link to="/dashboard/client">WORK ORDER →</Link>
				</Button>
				<Button
					asChild
					size="lg"
					className="bg-background text-primary hover:text-stone-900 hover:bg-amber-400 px-6">
					<Link to="/company-regis">DAFTAR PERUSAHAAN →</Link>
				</Button>
			</div>
		</section>
	);
};

export default LandingPage;
