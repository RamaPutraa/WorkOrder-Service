import { useAuthStore } from "@/store/authStore";
import { Sparkles } from "lucide-react";

const getGreeting = () => {
	const hour = new Date().getHours();
	if (hour < 12) return "Selamat Pagi";
	if (hour < 17) return "Selamat Siang";
	return "Selamat Malam";
};

const getFormattedDate = () => {
	return new Intl.DateTimeFormat("id-ID", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date());
};

const Welcome = () => {
	const { user } = useAuthStore();

	return (
		<div className="space-y-5">
			{/* Hero greeting */}
			<div className="relative overflow-hidden border-b-1 border-border/50 pb-4">
				{/* decorative blobs */}
				<div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-background blur-2xl" />
				<div className="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-background blur-2xl" />

				<div className="relative flex items-start justify-between gap-4">
					<div className="space-y-1">
						<p className="text-sm font-medium">{getFormattedDate()}</p>
						<h1 className="text-2xl font-bold tracking-tight">
							{getGreeting()}, {user?.name?.split(" ")[0] ?? "Owner"} 👋
						</h1>
						<p className="text-sm ">
							Selamat datang kembali di dashboard manajemen Work Order.
						</p>
					</div>
					<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
						<Sparkles className="h-6 w-6 text-white" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Welcome;
