import { Button } from "@/components/ui/button";
import loginImage from "@/assets/images/company-reg-landing-page.webp";

type Props = {
	onNext: () => void;
};

const CompanyIntro = ({ onNext }: Props) => {
	return (
		<div className="w-full h-full flex flex-col md:grid md:grid-cols-3 gap-5 xl:px-30 rounded-lg overflow-hidden">
			{/* Left Section */}
			<div className="md:col-span-2 flex flex-col justify-center p-6  text-center md:text-left">
				<h2 className="font-bold text-3xl md:text-4xl mb-4">
					Daftarkan Perusahaan Anda Sekarang
				</h2>
				<p className="text-sm md:text-base text-muted-foreground mb-6">
					Isi dua pertanyaan sederhana, dan kami akan memberikan estimasi paket
					yang sesuai untuk kebutuhan perusahaan Anda.
				</p>
				<div className="flex flex-col items-center md:items-start gap-2">
					<Button
						className="w-full md:w-auto px-8 py-6 text-base font-semibold"
						onClick={onNext}>
						Daftarkan Perusahaan
					</Button>
					<p className="text-xs md:text-sm font-semibold text-muted-foreground">
						Hanya Butuh 30 Detik!
					</p>
				</div>
			</div>

			{/* Right Section (Image) */}
			<div className="hidden md:flex items-center justify-center">
				<img
					src={loginImage}
					alt="Company Registration Illustration"
					className="w-full h-full object-cover"
				/>
			</div>
		</div>
	);
};

export default CompanyIntro;
