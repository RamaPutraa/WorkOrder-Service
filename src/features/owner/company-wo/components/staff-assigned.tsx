import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Command,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
} from "@/components/ui/command";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Plus, User, Users } from "lucide-react";
import { useDialogStore } from "@/store/dialogStore";
import { configStaffWorkOrderApi } from "../services/company-wo-service";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";

interface StaffAssignedProps {
	detailData: DetailInternalWorkOrder;
	employees: StaffItem[];
	assignedStaffsUI: StaffItem[];
	setAssignedStaffsUI: React.Dispatch<React.SetStateAction<StaffItem[]>>;
}

const StaffAssigned = ({
	detailData,
	employees,
	assignedStaffsUI,
	setAssignedStaffsUI,
}: StaffAssignedProps) => {
	const [open, setOpen] = useState(false);
	const [showMaxAlert, setShowMaxAlert] = useState(false);
	const [selectedStaff, setSelectedStaff] = useState<StaffItem | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [originalStaffs, setOriginalStaffs] = useState<StaffItem[]>([]);
	const { showDialog } = useDialogStore();

	// Track original staff when component mounts or detailData changes
	useEffect(() => {
		setOriginalStaffs(detailData.assignedStaffs ?? []);
	}, [detailData.assignedStaffs]);

	// Check if there are changes
	const hasChanges = () => {
		if (assignedStaffsUI.length !== originalStaffs.length) return true;
		return !assignedStaffsUI.every((staff) =>
			originalStaffs.some((original) => original._id === staff._id),
		);
	};

	// Handle save with confirmation
	const handleSave = () => {
		showDialog({
			title: "Konfirmasi Simpan",
			description:
				"Apakah Anda yakin ingin menyimpan perubahan staff yang ditugaskan?",
			confirmText: "Simpan",
			cancelText: "Batal",
			onConfirm: async () => {
				setIsSaving(true);
				const staffEmails = assignedStaffsUI.map((staff) => staff.email);

				const { error } = await handleApi(() =>
					configStaffWorkOrderApi(detailData._id, staffEmails),
				);

				setIsSaving(false);

				if (error) {
					notifyError("Gagal menyimpan", error.message);
					return;
				}

				notifySuccess(
					"Berhasil disimpan",
					"Perubahan staff yang ditugaskan telah disimpan",
				);
				setOriginalStaffs(assignedStaffsUI);
			},
		});
	};

	// Handle cancel with confirmation
	const handleCancel = () => {
		showDialog({
			title: "Konfirmasi Batal",
			description:
				"Apakah Anda yakin ingin membatalkan perubahan? Semua perubahan yang belum disimpan akan hilang.",
			confirmText: "Ya, Batalkan",
			cancelText: "Tidak",
			onConfirm: () => {
				setAssignedStaffsUI(originalStaffs);
			},
		});
	};

	// Handle remove staff with confirmation
	const handleRemoveStaff = (staff: StaffItem) => {
		showDialog({
			title: "Konfirmasi Hapus Staff",
			description: `Apakah Anda yakin ingin menghapus ${staff.name} (${staff.position?.name || "No Position"}) dari daftar staff yang ditugaskan?`,
			confirmText: "Ya, Hapus",
			cancelText: "Batal",
			onConfirm: async () => {
				setIsSaving(true);

				// Remove staff from UI first
				const updatedStaffs = assignedStaffsUI.filter(
					(s) => s._id !== staff._id,
				);
				setAssignedStaffsUI(updatedStaffs);

				// Get email array and save to database
				const staffEmails = updatedStaffs.map((s) => s.email);
				const { error } = await handleApi(() =>
					configStaffWorkOrderApi(detailData._id, staffEmails),
				);

				setIsSaving(false);

				if (error) {
					// Rollback if error
					setAssignedStaffsUI(assignedStaffsUI);
					notifyError("Gagal menghapus staff", error.message);
					return;
				}

				notifySuccess(
					"Staff berhasil dihapus",
					`${staff.name} telah dihapus dari daftar staff yang ditugaskan`,
				);

				// Update original staffs to reflect saved state
				setOriginalStaffs(updatedStaffs);
			},
		});
	};

	const requiredPositions = detailData.service.requiredStaff.map(
		(rs) => rs.position.name,
	);

	const filteredEmployees = employees
		.filter((emp) => requiredPositions.includes(emp.position?.name))
		.filter(
			(emp) => !assignedStaffsUI.some((assigned) => assigned._id === emp._id),
		);

	const countByPosition = (positionId: string) =>
		assignedStaffsUI.filter((s) => s.position?._id === positionId).length;

	const required = detailData.service.requiredStaff.find(
		(r) => r.position._id === selectedStaff?.position._id,
	);

	const maxStaff = required?.maximumStaff ?? 0;

	return (
		<Card className="border rounded-xl shadow-sm">
			<CardHeader>
				<div className="flex justify-between items-center">
					<div>
						<h2 className="text-lg font-semibold">Pegawai Bertugas</h2>
						<p className="text-sm text-muted-foreground">
							Daftar staff yang ditugaskan.
						</p>
					</div>

					<div className="flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-md">
						<Users className="w-4 h-4 text-muted-foreground" />
						<span className="text-sm font-medium">
							{assignedStaffsUI.length} Staff
						</span>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{/* ========== LIST STAFF ========== */}
					{assignedStaffsUI.map((staff) => (
						<Card
							key={staff._id}
							className="relative overflow-hidden border shadow-sm hover:shadow-md transition">
							{/* Tombol Hapus */}
							<button
								onClick={() => handleRemoveStaff(staff)}
								className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1 transition">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0h-1m-8 0H7m10 0l-1-3H8L7 7"
									/>
								</svg>
							</button>

							<CardContent className="flex flex-col items-center text-center space-y-3 p-4">
								<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary transition">
									<User className="w-6 h-6" />
								</div>

								<div className="space-y-1 w-full">
									<p className="font-medium text-sm truncate px-2">
										{staff.name}
									</p>
									<p className="text-xs text-muted-foreground px-2 py-1 rounded-full truncate">
										{staff.position?.name || "No Position"}
									</p>
								</div>
							</CardContent>
						</Card>
					))}

					{/* ========== BUTTON ADD STAFF ========== */}
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<button className="group flex flex-col items-center justify-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-xl bg-muted/30 hover:bg-muted/50 hover:border-primary/50 cursor-pointer transition min-h-[160px]">
								<div className="h-10 w-10 rounded-full bg-background border border-muted-foreground/20 flex items-center justify-center mb-2 group-hover:border-primary group-hover:text-primary transition">
									<Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
								</div>
								<p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition">
									Tambah Staff
								</p>
							</button>
						</DialogTrigger>

						{/* === Dialog Content === */}
						<DialogContent className="sm:max-w-[500px]">
							<form
								onSubmit={(e) => {
									e.preventDefault();
									if (!selectedStaff) return;

									const requiredForSelected =
										detailData.service.requiredStaff.find(
											(r) => r.position._id === selectedStaff.position._id,
										);
									const maxForSelected = requiredForSelected?.maximumStaff ?? 0;

									const currentCount = countByPosition(
										selectedStaff.position._id,
									);

									if (currentCount >= maxForSelected) {
										setShowMaxAlert(true);
										return;
									}

									setAssignedStaffsUI((prev) => [...prev, selectedStaff]);
									setSelectedStaff(null);
									setShowMaxAlert(false);
									setOpen(false);
								}}>
								<DialogHeader>
									<DialogTitle>Pegawai Bertugas</DialogTitle>
									<DialogDescription>
										Pilih staff yang ingin ditugaskan.
									</DialogDescription>
								</DialogHeader>

								{showMaxAlert && (
									<Alert className="bg-yellow-50 text-yellow-800 border-yellow-300 shadow-sm mt-2">
										<AlertTitle className="flex items-center gap-2">
											<AlertTriangle className="h-4 w-4" />
											Kuota Staff Penuh
										</AlertTitle>
										<AlertDescription>
											Posisi <b>{selectedStaff?.position.name}</b> hanya boleh
											maksimal {maxStaff} staff.
										</AlertDescription>
									</Alert>
								)}

								{/* ComboBox */}
								<div className="grid gap-4 py-4">
									<div className="grid gap-2">
										<Label>Pilih Staff</Label>

										<Command className="rounded-lg border shadow">
											<CommandInput placeholder="Cari nama staff..." />

											<CommandList>
												<CommandEmpty>
													<Badge variant="secondary" className="p-1">
														Semua staff sudah dipilih!
													</Badge>
												</CommandEmpty>

												<CommandGroup>
													{filteredEmployees.map((s) => (
														<CommandItem
															key={s._id}
															value={s.name}
															onSelect={() => setSelectedStaff(s)}
															className="cursor-pointer">
															{s.name} —
															<span className="text-muted-foreground ml-1">
																{s.position?.name}
															</span>
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</Command>

										{selectedStaff && (
											<div className="mt-2 text-sm p-2 border rounded-lg bg-muted/30">
												<p className="font-medium">{selectedStaff.name}</p>
												<p className="text-xs text-muted-foreground">
													{selectedStaff.position?.name}
												</p>
											</div>
										)}
									</div>
								</div>

								<DialogFooter>
									<DialogClose asChild>
										<Button variant="outline" type="button">
											Batal
										</Button>
									</DialogClose>

									<Button type="submit">Simpan</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</CardContent>
			{/* Tombol Simpan dan Batal */}
			{hasChanges() && (
				<div className="flex items-center justify-end border-t-2 mx-5">
					<div className="flex items-center gap-2 pt-5 pb-3">
						<Button
							variant="outline"
							onClick={handleCancel}
							disabled={isSaving}>
							Batal
						</Button>
						<Button onClick={handleSave} disabled={isSaving}>
							{isSaving ? "Menyimpan..." : "Simpan"}
						</Button>
					</div>
				</div>
			)}
		</Card>
	);
};

export default StaffAssigned;
