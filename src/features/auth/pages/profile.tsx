import { useEffect, useState } from "react";
import useAuth from "@/features/auth/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Mail } from "lucide-react";
import { SectionLoading } from "@/shared/atoms";
import InternalContent from "@/features/auth/components/profile/internal-content";
import ClientContent from "@/features/auth/components/profile/client-content";

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
		return <SectionLoading message="Memuat Profil" />;
	}

	if (!profile) {
		return (
			<div className="flex flex-col justify-center items-center h-[80vh] w-full p-8 text-gray-500 gap-4">
				<UserCircle className="w-12 h-12 text-gray-300" />
				<p>Gagal memuat profil.</p>
			</div>
		);
	}

	const formatRole = (role: string) => {
		return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
	};

	return (
		<div className="w-full  max-w-2xl mx-auto p-4 md:p-10 space-y-10 animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
			{/* Header Section (Centered) */}
			<div className="flex flex-col items-center text-center gap-5 w-full pb-8 border-b border-gray-100">
				<Avatar className="w-28 h-28 border border-gray-200 shadow-sm">
					<AvatarImage
						src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}&backgroundColor=ffffff&textColor=000000`}
						alt={profile.name}
					/>
					<AvatarFallback className="text-3xl font-medium bg-gray-50 text-gray-900 border border-gray-100">
						{profile.name.charAt(0)}
					</AvatarFallback>
				</Avatar>

				<div className="space-y-3 flex flex-col items-center">
					<div className="space-y-1.5 flex flex-col items-center">
						<h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
							{profile.name}
						</h1>
						<Badge
							variant="outline"
							className="w-fit text-xs font-medium text-gray-600 bg-gray-50 border-gray-200 px-3 py-0.5 rounded-full">
							{formatRole(profile.role)}
						</Badge>
					</div>
					<div className="flex items-center text-gray-500 text-sm gap-2">
						<Mail className="w-4 h-4 text-gray-400" />
						<span>{profile.email}</span>
					</div>
				</div>
			</div>

			{/* Render Content Based on Role */}
			{profile.role === "client" ?
				<ClientContent />
			:	<InternalContent profile={profile} />}
		</div>
	);
}
