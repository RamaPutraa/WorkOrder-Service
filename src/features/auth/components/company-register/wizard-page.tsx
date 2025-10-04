import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CompanyRegForm from "@/features/auth/components/company-register/main-company-form";
import CompanyIntro from "@/features/auth/components/company-register/company-intro";

const CompanyWizard = () => {
	const [step, setStep] = useState(1);

	return (
		<div className="content-center w-full py-10">
			<AnimatePresence mode="wait">
				{step === 1 && (
					<motion.div
						key="step1"
						initial={{ x: 100, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: -100, opacity: 0 }}>
						<CompanyIntro onNext={() => setStep(2)} />
					</motion.div>
				)}

				{step === 2 && (
					<motion.div
						key="step2"
						initial={{ x: 100, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: -100, opacity: 0 }}>
						<CompanyRegForm onBack={() => setStep(1)} />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default CompanyWizard;
