import { Button } from "@/components/ui/button";
import { useCreateService } from "../hooks/useCreateService";
import { CardServiceInfo } from "../components/create/service-info";
import { CardWorkOrderForm } from "../components/create/workorder-form";
import { CardIntakeForm } from "../components/create/intake-form";
import { CardReportForm } from "../components/create/report-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
		selectedIntakeForms,
		availableRoles,
		formAccessConfig,
		formAccessConfigReport,
		formAccessConfigIntake,

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
		toggleIntakeForm,
		toggleRoleFill,
		toggleRoleView,
		toggleFillablePosition,
		toggleViewablePosition,
		createService,
		creating,
	} = useCreateService();

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
						setTitle={setTitle}
						setDescription={setDescription}
						setAccessType={setAccessType}
						setSelectedStatus={setSelectedStatus}
						setOpenStatus={setOpenStatus}
						setSelectedStaff={setSelectedStaff}
						toggleStaff={toggleStaff}
						fetchPositions={fetchPositions}
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
						toggleRoleFill={(formId, role) =>
							toggleRoleFill(formId, role, "workOrder")
						}
						toggleRoleView={(formId, role) =>
							toggleRoleView(formId, role, "workOrder")
						}
						toggleFillablePosition={(formId, posId) =>
							toggleFillablePosition(formId, posId, "workOrder")
						}
						toggleViewablePosition={(formId, posId) =>
							toggleViewablePosition(formId, posId, "workOrder")
						}
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
						toggleRoleFill={(formId, role) =>
							toggleRoleFill(formId, role, "report")
						}
						toggleRoleView={(formId, role) =>
							toggleRoleView(formId, role, "report")
						}
						toggleFillablePosition={(formId, posId) =>
							toggleFillablePosition(formId, posId, "report")
						}
						toggleViewablePosition={(formId, posId) =>
							toggleViewablePosition(formId, posId, "report")
						}
					/>
				</motion.div>
			</AnimatePresence>

			{/* === CARD 4 === */}
			<AnimatePresence>
				<motion.div
					key="card-report-form"
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -8 }}
					transition={{ duration: 0.2 }}>
					<CardIntakeForm
						forms={forms}
						positions={positions}
						selectedIntakeForms={selectedIntakeForms}
						selectedStaff={selectedStaff}
						availableRoles={availableRoles}
						formAccessConfigIntake={formAccessConfigIntake}
						loading={loadingPositions}
						toggleIntakeForm={toggleIntakeForm}
					/>
				</motion.div>
			</AnimatePresence>

			{/* === SUBMIT BUTTON === */}
			<div className="flex justify-end pt-6 border-t">
				<Button
					onClick={createService}
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
