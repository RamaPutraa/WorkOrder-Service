import { Button } from "@/components/ui/button";
import {
	XCircle,
	CheckCircle2,
	Play,
	Send,
	CircleCheckBig,
	Timer,
} from "lucide-react";
import { type NavigateFunction } from "react-router-dom";

interface WoActionButtonsProps {
	user: any;
	woId: string;
	isReadOnly: boolean;
	userPic: boolean;
	userAssigned: boolean;
	userCreated: boolean | null;
	currentStatus: string;
	canCancel: boolean;
	canStart: boolean;
	canFail: boolean;
	canComplete: boolean;
	canRecreate: boolean;
	activeAction: string | null;
	navigate: NavigateFunction;
	onCancel: () => void;
	onSend: () => void;
	onReject: () => void;
	onApprove: () => void;
	onStart: () => void;
	onRecreate: () => void;
	onFail: () => void;
	onComplete: () => void;
}

export const WoActionButtons = ({
	user,
	isReadOnly,
	userPic,
	userAssigned,
	userCreated,
	currentStatus,
	canCancel,
	canStart,
	canFail,
	canComplete,
	canRecreate,
	activeAction,
	onCancel,
	onSend,
	onReject,
	onApprove,
	onStart,
	onRecreate,
	onFail,
	onComplete,
}: WoActionButtonsProps) => {
	// Jika user ini read-only dan bukan PIC maupun staf yang ditugaskan, jangan render apa-apa
	if (isReadOnly && !userPic && !userAssigned) return null;

	const isOwner = user?.role === "owner_company";
	const isManager = user?.role === "manager_company";
	const isStaff = user?.role === "staff_company";
	const isCreatorOrOwner =
		isOwner || (isManager && (userCreated === true || userCreated === null));

	return (
		<>
			{/* CANCEL BUTTON */}
			{["drafted", "approved", "rejected", "sent"].includes(currentStatus) &&
				isCreatorOrOwner && (
					<Button
						className="bg-red-600 hover:bg-red-700 w-full md:w-auto text-white rounded-xl h-11 shadow-sm shadow-red-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
						onClick={onCancel}
						disabled={activeAction !== null || !canCancel}>
						<XCircle className="h-4 w-4" />
						{activeAction === "cancel" ? "Memproses..." : "Batalkan"}
					</Button>
				)}

			{/* SEND BUTTON */}
			{currentStatus === "drafted" && (
				<Button
					className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl h-11 shadow-sm shadow-blue-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
					onClick={onSend}
					disabled={activeAction !== null}>
					<CheckCircle2 className="h-4 w-4" />
					{activeAction === "send" ? "Memproses..." : "Kirim"}
				</Button>
			)}

			{/* APPROVE/REJECT BUTTONS (Staff) & WAITING BADGE (Owner/Manager) */}
			{currentStatus === "sent" && (
				<>
					{(isOwner || isManager) && (
						<div className="px-5 bg-amber-100 w-full font-semibold text-sm md:w-auto text-amber-700 border-1 border-amber-200 rounded-xl h-11 shadow-sm shadow-amber-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
							<Timer className="h-4 w-4 mr-2" />
							Menunggu Persetujuan
						</div>
					)}
					{isStaff && (
						<>
							<Button
								className="bg-red-600 hover:bg-red-700 w-full md:w-auto text-white rounded-xl h-11 shadow-sm shadow-red-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
								onClick={onReject}
								disabled={activeAction !== null}>
								<XCircle className="h-4 w-4" />
								{activeAction === "reject" ? "Memproses..." : "Tolak"}
							</Button>
							<Button
								className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl h-11 shadow-sm shadow-blue-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
								onClick={onApprove}
								disabled={activeAction !== null}>
								<CheckCircle2 className="h-4 w-4" />
								{activeAction === "approve" ? "Memproses..." : "Setujui"}
							</Button>
						</>
					)}
				</>
			)}

			{/* START BUTTON */}
			{currentStatus === "approved" && (
				<Button
					className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl h-11 shadow-sm shadow-blue-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
					onClick={onStart}
					disabled={activeAction !== null || !canStart || !userAssigned}>
					<Play className="h-4 w-4" />
					{activeAction === "start" ? "Memproses..." : "Mulai Perintah Kerja"}
				</Button>
			)}

			{/* RECREATE BUTTON */}
			{canRecreate && isCreatorOrOwner && (
				<Button
					className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl h-11 shadow-sm shadow-blue-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
					onClick={onRecreate}
					disabled={activeAction !== null}>
					<Send className="h-4 w-4" />
					{activeAction === "recreate" ? "Memproses..." : "Ajukan Ulang"}
				</Button>
			)}

			{/* IN-PROGRESS ACTIONS (Complete, Fail, Report) */}
			{["on_progress", "completed", "failed"].includes(currentStatus) && (
				<>
					<Button
						className="bg-red-600 hover:bg-red-700 w-full md:w-auto text-white rounded-xl h-11 shadow-sm shadow-red-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
						onClick={onFail}
						disabled={activeAction !== null || !canFail}>
						<XCircle className="h-4 w-4" />
						Gagal
					</Button>
					<Button
						className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl h-11 shadow-sm shadow-blue-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
						onClick={onComplete}
						disabled={activeAction !== null || !canComplete}>
						<CircleCheckBig className="h-4 w-4" />
						Selesaikan
					</Button>
				</>
			)}
		</>
	);
};
