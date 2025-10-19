import { Button } from "@/components/ui/button";
import { useCreateService } from "../hooks/useForm";
import { CardServiceInfo } from "../components/create/service-info";
import { CardWorkOrderForm } from "../components/create/workorder-form";
import { CardReportForm } from "../components/create/report-form";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CreateService: React.FC = () => {
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

	return (
		<div className="max-w-6xl mx-auto py-10 space-y-10">
			<h1 className="text-2xl font-bold tracking-tight">Tambah Layanan Baru</h1>

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
