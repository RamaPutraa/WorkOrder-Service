import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useCreateService } from "../hooks/useCreateService";
import { CardServiceInfo } from "../components/create/service-info";
import { CardWorkOrderForm } from "../components/create/workorder-form";
import { CardReportForm } from "../components/create/report-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useValidation } from "@/hooks/use-validation";
import { required, minLength, minFields } from "@/lib/validators";
const CreateService: React.FC = () => {
	const navigate = useNavigate();
	const {
		// form dasar
		title,
		description,
		accessType,
		selectedStatus,
		openStatus,
		statuses,
		selectedStaff,
		positions,
		loadingPositions,
		errorPositions,

		// form logic
		forms,
		selectedForms,
		selectedReportForms,
		availableRoles,
		formAccessConfig,
		formAccessConfigReport,

		// handlers dari hook
		setTitle,
		setDescription,
		setAccessType,
		setSelectedStatus,
		setOpenStatus,
		setSelectedStaff,
		fetchPositions,
		toggleStaff,
		toggleForm,
		toggleReportForm,
		toggleRoleFill,
		toggleRoleView,
		toggleFillablePosition,
		toggleViewablePosition,
		createService,
		creating,
	} = useCreateService();
	// validasi
	const { errors, validateForm, validateAndSetField } = useValidation(
		{
			title: title || "",
			description: description || "",
			selectedStatus: selectedStatus?.value || "",
			accessType: accessType || "",
			selectedStaff: selectedStaff || [],
		},
		{
			title: [required("Judul layanan"), minLength(3, "Judul layanan")],
			description: [required("Deskripsi layanan")],
			selectedStatus: [required("Status layanan")],
			accessType: [required("Akses layanan")],
			selectedStaff: [minFields(1, "Minimal pilih 1 posisi staff")],
		}
	);

	// Sinkronkan validasi ketika daftar staff berubah dari manapun (toggle, input min/max, hapus)
	useEffect(() => {
		validateAndSetField("selectedStaff", selectedStaff);
	}, [selectedStaff]);

	const handleSubmit = async () => {
		const isValid = validateForm();
		if (!isValid) {
			return;
		}
		await createService();
	};

	return (
		<div className="max-w-6xl mx-auto py-10 space-y-10">
			<div className="container">
				<div className="flex items-center justify-between mb-8">
					<div className="flex flex-col space-y-2">
						<h1 className="text-xl font-bold tracking-tight">
							Tambah Layanan Baru
						</h1>
						<p className="text-muted-foreground">
							Berikut merupakan form tambah layanan yang dimiliki oleh
							perusahaan.
						</p>
					</div>
					<Button
						onClick={() => navigate(-1)}
						className="bg-primary hover:bg-primary/90">
						<ArrowLeft className="h-4 w-4" />
						Kembali
					</Button>
				</div>
			</div>

			{/* === CARD 1 === */}
			<AnimatePresence>
				<motion.div
					key="card-service-info"
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -8 }}
					transition={{ duration: 0.2 }}>
					<CardServiceInfo
						title={title}
						description={description}
						accessType={accessType}
						selectedStatus={selectedStatus}
						openStatus={openStatus}
						statuses={statuses}
						selectedStaff={selectedStaff}
						positions={positions}
						loading={loadingPositions}
						error={errorPositions}
						setTitle={(val) => {
							setTitle(val);
							validateAndSetField("title", val);
						}}
						setDescription={(val) => {
							setDescription(val);
							validateAndSetField("description", val);
						}}
						setAccessType={(val) => {
							setAccessType(val);
							validateAndSetField("accessType", val);
						}}
						setSelectedStatus={(val) => {
							setSelectedStatus(val);
							validateAndSetField("selectedStatus", val?.value || "");
						}}
						setOpenStatus={setOpenStatus}
					setSelectedStaff={(updater) => {
						// Dukung baik nilai array langsung maupun functional updater
						setSelectedStaff((prev) => {
							const next =
								typeof updater === "function"
									? // @ts-expect-error - infer updater function from React.SetStateAction
									(updater as (prev: Staff[]) => Staff[])(prev)
								: updater;
							validateAndSetField("selectedStaff", next as Staff[]);
							return next as Staff[];
						});
					}}
						toggleStaff={toggleStaff}
						fetchPositions={fetchPositions}
						errors={errors}
					/>
				</motion.div>
			</AnimatePresence>

			{/* === CARD 2 === */}
			<AnimatePresence>
				<motion.div
					key="card-workorder-form"
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -8 }}
					transition={{ duration: 0.2 }}>
					<CardWorkOrderForm
						forms={forms}
						positions={positions}
						selectedForms={selectedForms}
						selectedStaff={selectedStaff}
						availableRoles={availableRoles}
						formAccessConfig={formAccessConfig}
						loading={loadingPositions}
						toggleForm={toggleForm}
						toggleRoleFill={toggleRoleFill}
						toggleRoleView={toggleRoleView}
						toggleFillablePosition={toggleFillablePosition}
						toggleViewablePosition={toggleViewablePosition}
					/>
				</motion.div>
			</AnimatePresence>

			{/* === CARD 3 === */}
			<AnimatePresence>
				<motion.div
					key="card-report-form"
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -8 }}
					transition={{ duration: 0.2 }}>
					<CardReportForm
						forms={forms}
						positions={positions}
						selectedReportForms={selectedReportForms}
						selectedStaff={selectedStaff}
						availableRoles={availableRoles}
						formAccessConfigReport={formAccessConfigReport}
						loading={loadingPositions}
						toggleReportForm={toggleReportForm}
						toggleRoleFill={toggleRoleFill}
						toggleRoleView={toggleRoleView}
						toggleFillablePosition={toggleFillablePosition}
						toggleViewablePosition={toggleViewablePosition}
					/>
				</motion.div>
			</AnimatePresence>

			{/* === SUBMIT BUTTON === */}
			<div className="flex justify-end pt-6 border-t">
				<Button
					onClick={handleSubmit}
					disabled={creating}
					className="flex items-center gap-2">
					{creating && <Loader2 className="w-4 h-4 animate-spin" />}
					{creating ? "Menyimpan..." : "Simpan Layanan"}
				</Button>
			</div>
		</div>
	);
};

export default CreateService;
