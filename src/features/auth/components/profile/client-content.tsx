import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClientContent() {
	return (
		<div className="w-full flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 pt-2">
			<Button className="w-full sm:w-auto flex items-center gap-2 px-8 h-11 text-base font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md transition-all">
				<Edit className="w-4 h-4" />
				Edit Profil
			</Button>
		</div>
	);
}
