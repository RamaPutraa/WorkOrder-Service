import { Button } from "@/components/ui/button";
import { useCreateService } from "../hooks/useCreateService";
import { CardServiceInfo } from "../components/create/service-info";
import { CardWorkOrderForm } from "../components/create/workorder-form";
import { CardIntakeForm } from "../components/create/intake-form";
import { CardReportForm } from "../components/create/report-form";
import { ArrowLeft, ChevronLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React from "react";

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

	const [activeStep, setActiveStep] = React.useState<
		"info" | "intake" | "workOrder" | "report"
	>("info");

	const steps = [
		{
			id: "info",
			label: "Informasi Layanan",
			description: "Detail dasar layanan",
		},
		{
			id: "intake",
			label: "Intake Form",
			description: "Formulir data awal klien",
		},
		{
			id: "workOrder",
			label: "Work Order Form",
			description: "Formulir instruksi kerja",
		},
		{
			id: "report",
			label: "Laporan & Berita Acara",
			description: "Formulir hasil pekerjaan",
		},
	] as const;

	const renderContent = () => {
		switch (activeStep) {
			case "info":
				return (
					<motion.div
						key="info"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.2 }}
						className="h-full">
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
				);
			case "intake":
				return (
					<motion.div
						key="intake"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.2 }}
						className="h-full">
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
				);
			case "workOrder":
				return (
					<motion.div
						key="workOrder"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.2 }}
						className="h-full">
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
				);
			case "report":
				return (
					<motion.div
						key="report"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.2 }}
						className="h-[calc(100vh-10rem)]">
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
				);
			default:
				return null;
		}
	};

	return (
		<div className=" h-[calc(100vh-4rem)] flex flex-col">
			{/* Header Section */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shrink-0">
				<div className="flex items-center gap-4">
					<Button
						onClick={() => navigate(-1)}
						size="icon"
						className="bg-primary hover:bg-primary/90 h-10 w-10 shrink-0 sm:h-12 sm:w-12 rounded-lg">
						<ChevronLeft className="size-5 sm:size-6" />
					</Button>
					<div className="flex flex-col space-y-1">
						<h1 className="text-xl sm:text-2xl font-bold tracking-tight">
							Buat Layanan Baru
						</h1>
						<p className="text-sm text-muted-foreground line-clamp-1 sm:line-clamp-none">
							Konfigurasi layanan work order langkah demi langkah.
						</p>
					</div>
				</div>
				<div className="flex items-center gap-3 w-full sm:w-auto">
					<Button
						onClick={createService}
						disabled={creating}
						className="flex-1 sm:flex-none gap-2 min-w-[140px]">
						{creating && <Loader2 className="w-4 h-4 animate-spin" />}
						{creating ? "Menyimpan..." : "Simpan Layanan"}
					</Button>
				</div>
			</div>

			{/* Main Layout - Split View */}
			<div className="flex flex-col lg:flex-row gap-8 h-full min-h-0 overflow-hidden">
				{/* Sidebar Navigation */}
				<aside className="w-full lg:w-72 shrink-0 overflow-y-auto scrollbar-hide">
					<nav className="flex flex-col space-y-2 lg:sticky lg:top-0">
						{steps.map((step, index) => {
							const isActive = activeStep === step.id;
							return (
								<button
									key={step.id}
									onClick={() => setActiveStep(step.id)}
									className={`group flex items-start w-full p-4 rounded-xl text-left transition-all duration-200 border-2 ${
										isActive ?
											"bg-primary/5 border-primary shadow-sm"
										:	"bg-card border-transparent hover:bg-accent/50 hover:border-border"
									}`}>
									<div
										className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
											isActive ?
												"border-primary bg-primary text-primary-foreground"
											:	"border-muted-foreground/30 bg-muted text-muted-foreground group-hover:border-primary/50 group-hover:text-primary"
										}`}>
										{index + 1}
									</div>
									<div className="ml-4 space-y-1">
										<p
											className={`text-sm font-medium leading-none ${
												isActive ? "text-foreground" : (
													"text-muted-foreground group-hover:text-foreground"
												)
											}`}>
											{step.label}
										</p>
										<p className="text-sm text-muted-foreground line-clamp-2">
											{step.description}
										</p>
									</div>
								</button>
							);
						})}
					</nav>
				</aside>

				{/* Content Area */}
				<main className="flex-1 min-w-0 h-full overflow-hidden">
					<AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
				</main>
			</div>
		</div>
	);
};

export default CreateService;
