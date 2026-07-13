import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	LoaderCircle,
	QrCode,
	ArrowRight,
	Building2,
	User,
	Briefcase,
	ArrowLeft,
	CheckCircle2,
} from "lucide-react";
import { useClaimInvitationCode } from "../hooks/use-claim-invitation-code";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";
import { useNavigate } from "react-router-dom";
import { redirectToRoleDashboard } from "@/lib/auth-helpers";

const claimSchema = z.object({
	code: z
		.string()
		.min(1, "Kode undangan wajib diisi")
		.regex(
			/^[A-Z0-9_-]*$/i,
			"Kode hanya boleh berisi huruf, angka, strip, atau underscore",
		),
});

type ClaimFormValues = z.infer<typeof claimSchema>;

interface ClaimCodeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const ClaimCodeDialog = ({ open, onOpenChange }: ClaimCodeDialogProps) => {
	const navigate = useNavigate();
	const updateUser = useAuthStore((state) => state.updateUser);
	const updateProfile = useProfileStore((state) => state.updateProfile);
	const { previewData, loading, submitting, previewCode, claimCode, resetPreview } =
		useClaimInvitationCode();
	const [step, setStep] = useState<"input" | "preview">("input");

	const form = useForm<ClaimFormValues>({
		resolver: zodResolver(claimSchema),
		defaultValues: { code: "" },
	});

	// Reset saat dialog ditutup
	useEffect(() => {
		if (!open) {
			form.reset();
			setStep("input");
			resetPreview();
		}
	}, [open, form, resetPreview]);

	const onCheckCode = async (data: ClaimFormValues) => {
		const success = await previewCode(data.code);
		if (success) setStep("preview");
	};

	const onClaim = async () => {
		if (!previewData?.code) return;
		const updatedUser = await claimCode(previewData.code);
		if (updatedUser) {
			// Update local auth & profile state langsung tanpa re-fetch
			updateUser({ role: updatedUser.role });
			updateProfile({ role: updatedUser.role });
			onOpenChange(false);
			navigate(redirectToRoleDashboard(updatedUser.role));
		}
	};

	const handleBack = () => {
		setStep("input");
		resetPreview();
	};

	const ROLE_LABEL: Record<string, string> = {
		company_manager: "Manager Perusahaan",
		manager_company: "Manager Perusahaan",
		company_staff: "Pegawai Perusahaan",
		staff_company: "Pegawai Perusahaan",
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[460px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
				{/* ── Step 1: Input Kode ─────────────────────────────── */}
				{step === "input" && (
					<>
						<DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-br from-indigo-50/60 to-white border-b border-slate-100">
							<div className="flex items-center gap-3">
								<div className="p-2.5 bg-indigo-100 rounded-xl shrink-0">
									<QrCode className="w-5 h-5 text-indigo-600" />
								</div>
								<div className="text-left">
									<DialogTitle className="text-lg font-bold text-slate-800">
										Klaim Kode Undangan
									</DialogTitle>
									<DialogDescription className="text-slate-500 text-sm mt-0.5">
										Masukkan kode untuk bergabung dengan perusahaan
									</DialogDescription>
								</div>
							</div>
						</DialogHeader>

						<div className="px-6 py-5">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onCheckCode)} className="space-y-5">
									<FormField
										control={form.control}
										name="code"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
													Kode Undangan
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder="Contoh: JOIN2026"
														autoComplete="off"
														className="h-12 rounded-xl bg-slate-50 text-center text-xl font-bold tracking-[0.2em] uppercase border-slate-200 focus-visible:ring-indigo-300"
														onChange={(e) =>
															field.onChange(e.target.value.toUpperCase())
														}
													/>
												</FormControl>
												<FormMessage className="text-xs text-center" />
											</FormItem>
										)}
									/>

									<div className="flex gap-3 pt-2">
										<Button
											type="button"
											variant="outline"
											onClick={() => onOpenChange(false)}
											disabled={loading}
											className="flex-1 h-11 rounded-xl border-slate-200 hover:cursor-pointer"
										>
											Batal
										</Button>
										<Button
											type="submit"
											disabled={loading}
											className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:cursor-pointer"
										>
											{loading ? (
												<LoaderCircle className="w-4 h-4 animate-spin" />
											) : (
												<>
													Cek Kode
													<ArrowRight className="w-4 h-4 ml-1.5" />
												</>
											)}
										</Button>
									</div>
								</form>
							</Form>
						</div>
					</>
				)}

				{/* ── Step 2: Konfirmasi Preview ──────────────────────── */}
				{step === "preview" && previewData && (
					<>
						<DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-br from-emerald-50/60 to-white border-b border-slate-100">
							<div className="flex items-center gap-3">
								<div className="p-2.5 bg-primary rounded-xl shrink-0">
									<CheckCircle2 className="w-5 h-5 text-white" />
								</div>
								<div className="text-left">
									<DialogTitle className="text-lg font-bold text-slate-800">
										Konfirmasi Bergabung
									</DialogTitle>
									<DialogDescription className="text-slate-500 text-sm mt-0.5">
										Periksa detail sebelum bergabung
									</DialogDescription>
								</div>
							</div>
						</DialogHeader>

						<div className="px-6 py-5 space-y-4">
							{/* Preview info block */}
							<div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-sm text-slate-700 leading-relaxed">
								Anda akan bergabung dengan{" "}
								<strong className="text-slate-900">{previewData.company.name}</strong>{" "}
								sebagai{" "}
								<strong className="text-slate-900">
									{ROLE_LABEL[previewData.role] ?? previewData.role}
								</strong>
								{previewData.position && (
									<>
										{" "}di posisi{" "}
										<strong className="text-slate-900">
											{previewData.position.name}
										</strong>
									</>
								)}
								.
							</div>

							{/* Detail cards */}
							<div className="space-y-2">
								<div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
									<Building2 className="w-4 h-4 text-slate-400 shrink-0" />
									<div>
										<p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
											Perusahaan
										</p>
										<p className="text-sm font-medium text-slate-900">
											{previewData.company.name}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
									<User className="w-4 h-4 text-slate-400 shrink-0" />
									<div>
										<p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
											Peran
										</p>
										<p className="text-sm font-medium text-slate-900">
											{ROLE_LABEL[previewData.role] ?? previewData.role}
										</p>
									</div>
								</div>

								{previewData.position && (
									<div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
										<Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
										<div>
											<p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
												Departemen / Posisi
											</p>
											<p className="text-sm font-medium text-slate-900">
												{previewData.position.name}
											</p>
										</div>
									</div>
								)}
							</div>

							{/* Actions */}
							<div className="flex gap-3 pt-1">
								<Button
									type="button"
									variant="outline"
									onClick={handleBack}
									disabled={submitting}
									className="flex-1 h-11 rounded-xl border-slate-200"
								>
									<ArrowLeft className="w-4 h-4 mr-1.5" />
									Kembali
								</Button>
								<Button
									type="button"
									onClick={onClaim}
									disabled={submitting}
									className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-sm hover:cursor-pointer"
								>
									{submitting ? (
										<>
											<LoaderCircle className="w-4 h-4 animate-spin mr-2" />
											Memproses...
										</>
									) : (
										"Klaim & Bergabung"
									)}
								</Button>
							</div>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};
