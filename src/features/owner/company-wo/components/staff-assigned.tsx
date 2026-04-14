import { useState } from "react";
import { Users, Settings, Save, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { SectionLoading } from "@/shared/atoms";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { assignStaffToWorkOrderApi } from "../services/company-wo-service";

export interface StaffAssignedProps {
	wo: WorkOrderDetail & { meta?: WorkOrderMeta };
	employees: StaffItem[];
	fetchEmployeeList: () => void;
	isReadOnly: boolean;
	currentStatus?: string;
	onAssignSuccess: () => void;
}

const StaffRow = ({
	staff,
	isPIC,
	highlight = false,
}: {
	staff: User | StaffItem;
	isPIC: boolean;
	highlight?: boolean;
}) => (
	<div
		className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
			highlight ?
				"bg-amber-50 border-amber-200"
			:	"bg-muted/20 border-border/50 hover:bg-muted/40"
		}`}>
		<div
			className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
				highlight ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"
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
	onAssignSuccess,
}: StaffAssignedProps) => {
	const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);
	const [selectedStaffEmails, setSelectedStaffEmails] = useState<string[]>([]);
	const [picEmail, setPicEmail] = useState<string>("");
	const [isAssigningState, setIsAssigningState] = useState(false);

	const handleOpenStaffDialog = () => {
		if (employees.length === 0) fetchEmployeeList();
		// Mapping initial values based on current WO using emails
		setSelectedStaffEmails(wo?.assignedStaff?.map((s) => s.email) || []);
		setPicEmail(wo?.staffPIC?.email || "");
		setIsStaffDialogOpen(true);
	};

	const handleAssignStaffSubmit = async () => {
		if (!wo) return;
		if (!picEmail) {
			notifyError("Validasi Gagal", "PIC harus dipilih.");
			return;
		}
		if (selectedStaffEmails.length < wo.minStaff) {
			notifyError("Validasi Gagal", `Minimal ${wo.minStaff} pegawai.`);
			return;
		}
		if (selectedStaffEmails.length > wo.maxStaff) {
			notifyError("Validasi Gagal", `Maksimal ${wo.maxStaff} pegawai.`);
			return;
		}
		if (!selectedStaffEmails.includes(picEmail)) {
			notifyError(
				"Validasi Gagal",
				"PIC harus termasuk dalam pegawai yang dipilih.",
			);
			return;
		}

		setIsAssigningState(true);
		const { error } = await handleApi(() =>
			assignStaffToWorkOrderApi(wo._id, {
				assign_staffs: selectedStaffEmails,
				staff_pic: picEmail,
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

	return (
		<div className="border shadow-sm rounded-xl">
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
				<div className="border rounded-xl p-3 flex flex-col gap-3">
					<div className="overflow-y-auto max-h-[320px] pr-1">
						{wo.assignedStaff.length === 0 ?
							<div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
								<Users className="w-10 h-10 mb-2 opacity-30" />
								<p className="text-sm">Belum ada staff yang ditetapkan</p>
							</div>
						:	<div className="space-y-2">
								{wo.assignedStaff.map((staff) => (
									<StaffRow
										key={staff._id}
										staff={staff}
										isPIC={staff.email === wo.staffPIC?.email}
									/>
								))}
							</div>
						}
					</div>
				</div>
				<div>
					<Button
						onClick={handleOpenStaffDialog}
						disabled={isReadOnly || currentStatus !== "draft"}
						className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 w-full md:w-auto text-white rounded-xl px-5 h-11 shadow-sm shadow-blue-200 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
						<Settings className="w-4 h-4" />
						<span className="font-semibold text-xs">
							Konfigurasi Pegawai Bertugas
						</span>
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
							className={`text-sm font-bold ${
								wo.assignedStaff.length >= wo.minStaff ?
									"text-green-600"
								:	"text-amber-600"
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
						className={`h-full rounded-full transition-all duration-500 ${
							wo.assignedStaff.length >= wo.minStaff ?
								"bg-green-500"
							:	"bg-amber-400"
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
							{employees.length === 0 ?
								<SectionLoading message="Memuat data pegawai..." />
							:	employees.map((emp) => {
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
													{isPic ? "PIC Terpilih" : "Jadikan PIC"}
												</button>
											)}
										</div>
									);
								})
							}
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
							<Save className="w-4 h-4 mr-2" />
							{isAssigningState ? "Menyimpan..." : "Simpan Konfigurasi"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default StaffAssigned;
