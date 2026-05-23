import { useState } from "react";
import { Users, Settings, Save, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ButtonLoading, SectionLoading } from "@/shared/atoms";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { assignStaffToWorkOrderApi } from "../services/company-wo-service";

export interface StaffAssignedProps {
	wo: WorkOrderDetail & { meta?: WorkOrderMeta };
	employees: StaffItem[];
	fetchEmployeeList: () => void;
	isReadOnly: boolean;
	currentStatus?: string;
	canRecreateEdit?: boolean;
	onAssignSuccess: () => void;
	isRefreshing?: boolean;
}

const StaffRow = ({
	staff,
	isPIC,
	highlight = false,
	onClick,
}: {
	staff: User | StaffItem;
	isPIC: boolean;
	highlight?: boolean;
	onClick?: () => void;
}) => (
	<div
		onClick={onClick}
		className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${onClick ? "cursor-pointer" : ""} ${highlight ?
			"bg-amber-50 border-amber-200"
			: "bg-muted/20 border-border/50 hover:bg-muted/40"
			}`}>
		{onClick && (
			<Checkbox checked={highlight} className="pointer-events-none" />
		)}
		<div
			className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${highlight ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"
				}`}>
			{staff.name?.charAt(0)?.toUpperCase() ?? "?"}
		</div>
		<div className="flex-1 min-w-0">
			<p className="text-sm font-semibold leading-tight truncate">
				{staff.name}
			</p>
			<p className="text-xs text-muted-foreground truncate">{staff.email}</p>
		</div>
		{isPIC && (
			<span className="shrink-0 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold border border-amber-200">
				<Star className="w-2.5 h-2.5" />
				PIC
			</span>
		)}
	</div>
);

export const StaffAssigned = ({
	wo,
	employees,
	fetchEmployeeList,
	isReadOnly,
	currentStatus,
	canRecreateEdit = false,
	onAssignSuccess,
	isRefreshing = false,
}: StaffAssignedProps) => {
	const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);
	const [selectedStaffEmails, setSelectedStaffEmails] = useState<string[]>([]);
	const [picEmail, setPicEmail] = useState<string>("");
	const [isAssigningState, setIsAssigningState] = useState(false);
	const [selectedStaffsToRemove, setSelectedStaffsToRemove] = useState<
		string[]
	>([]);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const handleOpenStaffDialog = () => {
		// Selalu fetch ulang agar list employee selalu sesuai posisi WO
		fetchEmployeeList();
		// Mapping initial values based on current WO using emails
		setSelectedStaffEmails(wo?.assignedStaff?.map((s) => s.email) || []);
		setPicEmail(wo?.staffPIC?.email || "");
		setIsStaffDialogOpen(true);
	};

	const handleAssignStaffSubmit = async () => {
		if (!wo) return;

		if (selectedStaffEmails.length < wo.minStaff) {
			notifyError("Validasi Gagal", `Minimal ${wo.minStaff} pegawai.`);
			return;
		}
		if (selectedStaffEmails.length > wo.maxStaff) {
			notifyError("Validasi Gagal", `Maksimal ${wo.maxStaff} pegawai.`);
			return;
		}

		setIsAssigningState(true);
		const { error } = await handleApi(() =>
			assignStaffToWorkOrderApi(wo._id, {
				assign_staffs: selectedStaffEmails,
				...(picEmail ? { staff_pic: picEmail } : {}),
			}),
		);
		setIsAssigningState(false);

		if (error) {
			notifyError("Gagal menyimpan", error.message);
			return;
		}
		notifySuccess("Berhasil", "Konfigurasi pegawai bertugas diperbarui");
		setIsStaffDialogOpen(false);
		onAssignSuccess();
	};

	const handleOpenConfirm = () => {
		if (selectedStaffsToRemove.length === 0 || !wo) return;

		const updatedAssignStaffs = wo.assignedStaff
			.filter((s) => !selectedStaffsToRemove.includes(s.email))
			.map((s) => s.email);

		if (updatedAssignStaffs.length < wo.minStaff) {
			notifyError(
				"Validasi Gagal",
				`Tidak bisa menghapus. Minimal ${wo.minStaff} pegawai harus bertugas.`,
			);
			return;
		}

		let updatedPicEmail = wo.staffPIC?.email || "";
		if (selectedStaffsToRemove.includes(updatedPicEmail)) {
			notifyError(
				"Validasi Gagal",
				"Tidak bisa menghapus Staff PIC secara langsung. Silakan ubah PIC melalui konfigurasi terlebih dahulu.",
			);
			return;
		}

		setIsConfirmOpen(true);
	};

	const handleRemoveStaffSubmit = async () => {
		if (!wo || selectedStaffsToRemove.length === 0) return;

		const updatedAssignStaffs = wo.assignedStaff
			.filter((s) => !selectedStaffsToRemove.includes(s.email))
			.map((s) => s.email);

		let updatedPicEmail = wo.staffPIC?.email || "";

		setIsAssigningState(true);
		const { error } = await handleApi(() =>
			assignStaffToWorkOrderApi(wo._id, {
				assign_staffs: updatedAssignStaffs,
				...(updatedPicEmail ? { staff_pic: updatedPicEmail } : {}),
			}),
		);
		setIsAssigningState(false);

		if (error) {
			notifyError("Gagal menghapus", error.message);
			return;
		}
		notifySuccess("Berhasil", "Pegawai berhasil dihapus dari tugas");
		setSelectedStaffsToRemove([]);
		setIsConfirmOpen(false);
		onAssignSuccess();
	};

	return (
		<div className="border shadow-sm rounded-xl relative overflow-hidden">
			{isRefreshing && (
				<div className="absolute inset-0 z-50 bg-background/60 backdrop-blur-[1px] flex flex-col items-center justify-center">
					<div className="w-8 h-8 animate-spin rounded-full border-[3px] border-primary border-t-transparent mb-2" />
					<p className="text-sm font-semibold text-primary">Memperbarui...</p>
				</div>
			)}
			<div className="p-5">
				<h3 className="text-base font-semibold flex items-center gap-2">
					<Users className="w-4 h-4 text-primary" />
					Daftar Pegawai Bertugas
				</h3>
			</div>
			<div className="space-y-4 px-5">
				{/* Min/Max visual */}
				<div className="grid grid-cols-2 gap-3">
					<div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center">
						<p className="text-2xl font-bold text-blue-600">{wo.minStaff}</p>
						<p className="text-xs text-blue-500 font-medium mt-0.5">Minimum</p>
					</div>
					<div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-center">
						<p className="text-2xl font-bold text-indigo-600">{wo.maxStaff}</p>
						<p className="text-xs text-indigo-500 font-medium mt-0.5">
							Maksimum
						</p>
					</div>
				</div>

				{/* Assigned Staff */}
				<div className="border rounded-xl p-3 flex flex-col gap-3 relative overflow-hidden">
					<div className="overflow-y-auto max-h-[320px] pr-1">
						{wo.assignedStaff.length === 0 ?
							<div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
								<Users className="w-10 h-10 mb-2 opacity-30" />
								<p className="text-sm">Belum ada staff yang ditetapkan</p>
							</div>
							: <div className="space-y-2">
								{wo.assignedStaff.map((staff) => (
									<StaffRow
										key={staff._id}
										staff={staff}
										isPIC={staff.email === wo.staffPIC?.email}
										highlight={selectedStaffsToRemove.includes(staff.email)}
										onClick={
											(
												isReadOnly ||
												(currentStatus !== "drafted" && !canRecreateEdit)
											) ?
												undefined
												: () =>
													setSelectedStaffsToRemove((prev) =>
														prev.includes(staff.email) ?
															prev.filter((e) => e !== staff.email)
															: [...prev, staff.email],
													)
										}
									/>
								))}
							</div>
						}
					</div>
				</div>
				<div className="flex gap-2">
					<Button
						onClick={handleOpenStaffDialog}
						disabled={
							isReadOnly || (currentStatus !== "drafted" && !canRecreateEdit)
						}
						className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 flex-1 md:flex-none text-white rounded-xl px-5 h-11 shadow-sm shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
						<Settings className="w-4 h-4" />
						<span className="font-semibold text-xs">
							Konfigurasi Pegawai Bertugas
						</span>
					</Button>
					<Button
						onClick={handleOpenConfirm}
						disabled={
							isReadOnly ||
							(currentStatus !== "drafted" && !canRecreateEdit) ||
							selectedStaffsToRemove.length === 0 ||
							isAssigningState
						}
						variant="destructive"
						className="rounded-xl hover:cursor-pointer px-6 h-11 transition-all active:scale-95 flex items-center justify-center disabled:opacity-50">
						<Trash2 className="w-4 h-4" />
					</Button>
				</div>

				<div className="border-b border-border/50" />

				{/* Assigned count */}
				<div className="flex items-center justify-between ">
					<span className="text-xs font-medium text-muted-foreground">
						Staff Ditetapkan
					</span>
					<div className="flex items-center gap-1.5">
						<span
							className={`text-sm font-bold ${wo.assignedStaff.length >= wo.minStaff ?
								"text-green-600"
								: "text-amber-600"
								}`}>
							{wo.assignedStaff.length}
						</span>
						<span className="text-xs text-muted-foreground">
							/ {wo.maxStaff} orang
						</span>
					</div>
				</div>

				{/* Progress bar */}
				<div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-5">
					<div
						className={`h-full rounded-full transition-all duration-500 ${wo.assignedStaff.length >= wo.minStaff ?
							"bg-green-500"
							: "bg-amber-400"
							}`}
						style={{
							width: `${Math.min(
								(wo.assignedStaff.length / wo.maxStaff) * 100,
								100,
							)}%`,
						}}
					/>
				</div>
			</div>

			<Dialog open={isStaffDialogOpen} onOpenChange={setIsStaffDialogOpen}>
				<DialogContent className="max-w-xl max-h-[85vh] flex flex-col p-0 rounded-2xl">
					<DialogHeader className="bg-primary rounded-t-2xl p-4">
						<DialogTitle className="text-white">
							Konfigurasi Pegawai Bertugas
						</DialogTitle>
						<DialogDescription className="text-white/80">
							Pilih pegawai yang akan ditugaskan.
						</DialogDescription>
					</DialogHeader>

					<div className="border border-border/50 mx-3 rounded-2xl">
						<div className="flex-1 overflow-y-auto p-3 space-y-3">
							{(() => {
								const filteredEmployees = employees.filter(
									(emp) => emp.position?._id === wo.positionsOnDuty?._id,
								);

								if (employees.length === 0) {
									return <SectionLoading message="Memuat data pegawai..." />;
								}

								if (filteredEmployees.length === 0) {
									return (
										<div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
											<Users className="w-10 h-10 mb-2 opacity-30" />
											<p className="text-sm">
												Tidak ada pegawai dengan posisi{" "}
												<span className="font-semibold text-primary">
													{wo.positionsOnDuty.name}
												</span>
											</p>
										</div>
									);
								}

								return filteredEmployees.map((emp) => {
									const isSelected = selectedStaffEmails.includes(emp.email);
									const isPic = picEmail === emp.email;
									return (
										<div
											key={emp._id}
											className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${isSelected ? "border-primary/50 bg-primary/5" : "border-border/50 bg-muted/10 hover:bg-muted/30"}`}>
											<div className="flex items-center gap-3">
												<Checkbox
													id={`chk-${emp._id}`}
													checked={isSelected}
													onCheckedChange={(checked) => {
														if (checked) {
															setSelectedStaffEmails([
																...selectedStaffEmails,
																emp.email,
															]);
														} else {
															setSelectedStaffEmails(
																selectedStaffEmails.filter(
																	(email) => email !== emp.email,
																),
															);
															if (isPic) setPicEmail("");
														}
													}}
												/>
												<div className="grid gap-0.5">
													<label
														htmlFor={`chk-${emp._id}`}
														className="text-sm font-semibold leading-none cursor-pointer">
														{emp.name}
													</label>
													<p className="text-xs text-muted-foreground">
														{emp.email}
													</p>
												</div>
											</div>

											{isSelected && (
												<button
													type="button"
													onClick={() => setPicEmail(emp.email)}
													className={`hover:cursor-pointer shrink-0 inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full font-bold border transition-colors ${isPic ? "bg-amber-100 text-amber-700 border-amber-300" : "bg-muted text-muted-foreground hover:bg-muted/80 border-transparent"}`}>
													{isPic && <Star className="w-3.5 h-3.5" />}
													{/* {isPic ? "PIC Terpilih" : "Jadikan PIC"} */}
												</button>
											)}
										</div>
									);
								});
							})()}
						</div>
					</div>

					<DialogFooter className="mt-2 p-3 border-t border-border/50">
						<Button
							className="hover:cursor-pointer"
							variant="outline"
							onClick={() => setIsStaffDialogOpen(false)}>
							Batal
						</Button>
						<Button
							className="bg-primary text-white hover:cursor-pointer"
							onClick={handleAssignStaffSubmit}
							disabled={isAssigningState}>
							{isAssigningState ?
								<ButtonLoading message="Menyimpan..." />
								: <>
									<Save className="w-4 h-4 mr-2" />
									Simpan Konfigurasi
								</>
							}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
				<AlertDialogContent className="rounded-2xl max-w-md">
					<AlertDialogHeader>
						<AlertDialogTitle>Hapus Pegawai Bertugas?</AlertDialogTitle>
						<AlertDialogDescription>
							Anda yakin ingin menghapus {selectedStaffsToRemove.length} pegawai
							dari tugas ini? Tindakan ini akan segera memperbarui data tugas.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							disabled={isAssigningState}
							className="hover:cursor-pointer rounded-xl">
							Batal
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e) => {
								e.preventDefault();
								handleRemoveStaffSubmit();
							}}
							disabled={isAssigningState}
							className="bg-red-600 text-white hover:bg-red-700 hover:cursor-pointer rounded-xl">
							{isAssigningState ? "Menghapus..." : "Ya, Hapus"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default StaffAssigned;
