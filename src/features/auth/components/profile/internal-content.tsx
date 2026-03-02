import { useState } from "react";
import { Building2, Briefcase, Eye, Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CompanyDetailDialog from "./company-detail-dialog";

interface InternalContentProps {
	profile: User;
}

export default function InternalContent({ profile }: InternalContentProps) {
	const [openCompanyDetail, setOpenCompanyDetail] = useState(false);
	const [fetchTriggered, setFetchTriggered] = useState(false);
	const [buttonLoading, setButtonLoading] = useState(false);

	const handleOpenCompanyDetail = async () => {
		setButtonLoading(true);
		// Simulasi delay singkat agar loading state terlihat sebelum dialog terbuka
		await new Promise((resolve) => setTimeout(resolve, 300));
		setFetchTriggered(true);
		setOpenCompanyDetail(true);
		setButtonLoading(false);
	};

	return (
		<div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Details Section */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Company Details */}
				<div className="space-y-4">
					<div className="flex items-center justify-center gap-2 pb-3 border-b border-gray-100">
						<div className="p-1.5 bg-gray-50 rounded-md border border-gray-100">
							<Building2 className="w-4 h-4 text-gray-600" />
						</div>
						<h3 className="text-sm font-medium text-gray-900">Perusahaan</h3>
					</div>
					<div className="space-y-1.5 text-center">
						<p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
							Nama Perusahaan
						</p>
						<p className="text-gray-900 font-medium text-lg">
							{profile.company?.name || "-"}
						</p>
					</div>
				</div>

				{/* Professional Details */}
				<div className="space-y-4">
					<div className="flex items-center justify-center gap-2 pb-3 border-b border-gray-100">
						<div className="p-1.5 bg-gray-50 rounded-md border border-gray-100">
							<Briefcase className="w-4 h-4 text-gray-600" />
						</div>
						<h3 className="text-sm font-medium text-gray-900">Posisi</h3>
					</div>
					<div className="space-y-1.5 text-center">
						<p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
							Jabatan Saat Ini
						</p>
						<p className="text-gray-900 font-medium text-lg">
							{profile.position?.name || "-"}
						</p>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
				<Button
					variant="outline"
					className="w-full sm:w-auto flex items-center gap-2 px-6 h-11 rounded-full border-blue-200 text-blue-700 hover:bg-blue-50"
					disabled={buttonLoading || !profile.company?._id}
					onClick={handleOpenCompanyDetail}>
					{buttonLoading ?
						<Loader2 className="w-4 h-4 animate-spin" />
					:	<Eye className="w-4 h-4" />}
					{buttonLoading ? "Memuat..." : "Detail Perusahaan"}
				</Button>
				<Button className="w-full sm:w-auto flex items-center gap-2 px-6 h-11 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all hover:shadow">
					<Edit className="w-4 h-4" />
					Edit Profil
				</Button>
			</div>

			{/* Company Detail Dialog */}
			{fetchTriggered && profile.company?._id && (
				<CompanyDetailDialog
					open={openCompanyDetail}
					onOpenChange={setOpenCompanyDetail}
					companyId={String(profile.company._id)}
				/>
			)}
		</div>
	);
}
