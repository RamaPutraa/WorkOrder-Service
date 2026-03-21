import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { ArrowUpRightIcon, CheckCircle } from "lucide-react";

const StaffConfirmPage = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon" className="bg-green-100 text-green-600">
						<CheckCircle className="h-7 w-7" />
					</EmptyMedia>
					<EmptyTitle> Anda Sudah Bergabung</EmptyTitle>
					<EmptyDescription>
						Akun Anda sudah terdaftar sebagai anggota aktif. Anda tidak dapat
						menerima undangan baru saat ini.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent className="flex-row justify-center gap-2">
					<Button onClick={() => navigate(-1)}>Kembali</Button>
					<Button variant="outline">Dashboard</Button>
				</EmptyContent>
			</Empty>
		</div>
	);
};

export default StaffConfirmPage;
