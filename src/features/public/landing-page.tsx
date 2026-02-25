import HeroSection from "./components/hero-section";
import StatsSection from "./components/stats-section";
import FeaturesSection from "./components/features-section";
import BenefitsSection from "./components/benefits-section";
import CtaSection from "./components/cta-section";

const LandingPage = () => {
	return (
		<div className="w-full overflow-x-hidden">
			<HeroSection />
			<StatsSection />
			<FeaturesSection />
			<BenefitsSection />
			<CtaSection />
		</div>
	);
};

export default LandingPage;
