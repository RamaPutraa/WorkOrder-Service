import { useEffect, useState } from "react";
import useAuth from "@/features/auth/hooks/useAuth";
import { UserCircle, Mail } from "lucide-react";
import { SectionLoading } from "@/shared/atoms";
import InternalContent from "@/features/auth/components/profile/internal-content";
import ClientContent from "@/features/auth/components/profile/client-content";
import PageHeader from "@/shared/atoms/header-content";

export default function ProfilePage() {
	const { getProfile } = useAuth();
	const [profile, setProfile] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProfile = async () => {
			const data = await getProfile();
			if (data) setProfile(data);
			setLoading(false);
		};
		fetchProfile();
	}, [getProfile]);

	if (loading) {
		return (
			<>
				<PageHeader
					title="Profil Pengguna"
					subtitle="Informasi mengenai akun Anda."
					backPath={true}
				/>
				<SectionLoading message="Memuat Profil" />
			</>
		);
	}

	if (!profile) {
		return (
			<div className="flex flex-col items-start py-24 gap-3 text-muted-foreground">
				<div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
					<UserCircle className="w-7 h-7 text-muted-foreground/60" />
				</div>
				<div>
					<p className="font-semibold text-base text-foreground">
						Gagal Memuat Profil
					</p>
					<p className="text-sm text-muted-foreground mt-1">
						Terjadi kesalahan saat mengambil data akun Anda.
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<PageHeader
				title="Profil Pengguna"
				subtitle="Informasi mengenai akun Anda."
				backPath={true}
			/>

			<div className="pb-12 space-y-8 animate-in fade-in duration-300">
				{/* ── Header Area ─────────────────────────────────────────── */}
				<div className="flex items-start gap-5 pb-6 border-b border-border/40">
					{/* Icon Container */}
					<div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
						<UserCircle className="w-8 h-8 text-primary stroke-[1.5]" />
					</div>

					<div className="space-y-1.5 mt-0.5">
						<div className="flex items-center gap-3 flex-wrap">
							<h1 className="text-2xl font-bold tracking-tight text-foreground">
								{profile.name}
							</h1>
						</div>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Mail className="w-3.5 h-3.5 shrink-0" />
							<span>{profile.email}</span>
						</div>
					</div>
				</div>

				{/* ── Role-based Content ────────────────────────────────── */}
				{profile.role === "client" ?
					<ClientContent />
				:	<InternalContent profile={profile} />}
			</div>
		</>
	);
}
