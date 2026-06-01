import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
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
import { LoaderCircle, KeyRound, Ticket } from "lucide-react";
import {
	claimMembershipSchema,
	type ClaimMembershipFormValues,
} from "../schemas/claim-membership-schema";
import { useClaimMembership } from "../hooks/useClaimMembership";

interface ClaimMembershipDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
	companyId: string;
}

const ClaimMembershipDialog = ({
	open,
	onOpenChange,
	onSuccess,
	companyId,
}: ClaimMembershipDialogProps) => {
	const handleSuccess = () => {
		onOpenChange(false);
		onSuccess?.();
	};

	const { claim, loading } = useClaimMembership(handleSuccess);

	const form = useForm<ClaimMembershipFormValues>({
		resolver: zodResolver(claimMembershipSchema),
		defaultValues: {
			code: "",
		},
	});

	useEffect(() => {
		if (open) {
			form.reset({ code: "" });
		}
	}, [open]);

	const onSubmit = (data: ClaimMembershipFormValues) => {
		claim({ ...data, company_id: companyId });
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (loading) return;
		onOpenChange(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-[400px] p-0 overflow-hidden rounded-2xl">
				{/* Header */}
				<div className="bg-gradient-to-br from-primary to-blue-700 px-6 pt-6 pb-5">
					<div className="flex items-center  gap-3 mb-1">
						<div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
							<Ticket className="w-4 h-4 text-white" />
						</div>
						<DialogTitle className="text-white text-lg font-semibold">
							Klaim Voucer
						</DialogTitle>
					</div>
					<DialogDescription className="text-blue-100 text-sm pl-12">
						Masukkan kode voucer yang Anda terima untuk berlangganan
					</DialogDescription>
				</div>

				{/* Form */}
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						{/* Body */}
						<div className="px-6 pb-3">
							<div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
								<FormField
									control={form.control}
									name="code"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs font-medium text-gray-500">
												Kode Voucer
											</FormLabel>
											<FormControl>
												<div className="relative">
													<KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
													<Input
														placeholder="Masukkan kode voucer..."
														className="pl-8 h-9 rounded-lg border-gray-200 bg-white text-sm tracking-widest uppercase"
														autoComplete="off"
														{...field}
														onChange={(e) =>
															field.onChange(e.target.value.toUpperCase())
														}
													/>
												</div>
											</FormControl>
											<FormMessage className="text-xs" />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Footer actions */}
						<div className="px-6 py-4 border-t border-gray-100 flex justify-end items-center gap-2">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => handleOpenChange(false)}
								disabled={loading}
								className="text-gray-500">
								Batal
							</Button>
							<Button
								type="submit"
								size="sm"
								disabled={loading}
								className="gap-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg px-4">
								{loading ?
									<LoaderCircle className="w-3.5 h-3.5 animate-spin" />
									: <Ticket className="w-3.5 h-3.5" />}
								{loading ? "Memproses..." : "Klaim Sekarang"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default ClaimMembershipDialog;
