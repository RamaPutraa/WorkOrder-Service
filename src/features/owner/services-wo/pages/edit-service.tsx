import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useEditService } from "../hooks/useEditService";
import { CardServiceInfo } from "../components/create/service-info";
import { CardServiceRequestConfig } from "../components/create/service-request-config";
import { CardWorkOrdersConfig } from "../components/create/work-orders-config";
import PageHeader from "@/shared/atoms/header-content";
import { Save } from "lucide-react";
import { ConfirmLeaveDialog } from "@/shared/molecules/confirm-leave-dialog";

const EditService: React.FC = () => {
	const {
		// UI states
		updating: creating,
		loading,
		isDirty,

		// Base Form
		title,
		setTitle,
		description,
		setDescription,
		accessType,
		setAccessType,
		selectedStatus,
		setSelectedStatus,
		statuses,

		// Service Request Config
		intakeFormId,
		setIntakeFormId,
		reviewFormId,
		setReviewFormId,
		serviceRequestApprovalType,
		setServiceRequestApprovalType,
		reviewNeed,
		setReviewNeed,

		// Work Orders Config
		workOrdersConfig,
		addWorkOrderConfig,
		removeWorkOrderConfig,
		updateWorkOrderConfig,

		// Dropdowns Data
		positions,
		fetchPositions,
		forms,
		fetchForms,

		// Action
		updateService,
	} = useEditService();

	useEffect(() => {
		void fetchPositions();
		void fetchForms();
	}, []);

	const [activeStep, setActiveStep] = React.useState<
		"info" | "serviceConfig" | "workOrderConfig"
	>("info");

	const steps = [
		{
			id: "info",
			label: "Informasi Layanan",
			description: "Detail dasar layanan",
		},
		{
			id: "serviceConfig",
			label: "Konfigurasi Formulir Permintaan",
			description: "Pengajuan dan persetujuan klien",
		},
		{
			id: "workOrderConfig",
			label: "Konfigurasi Formulir Perintah Kerja",
			description: "Alur kerja dan pelaporan staf",
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
							setTitle={setTitle}
							description={description}
							setDescription={setDescription}
							accessType={accessType}
							setAccessType={setAccessType}
							selectedStatus={selectedStatus}
							setSelectedStatus={setSelectedStatus}
							statuses={statuses}
							isEditMode={true}
						/>
					</motion.div>
				);
			case "serviceConfig":
				return (
					<motion.div
						key="serviceConfig"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.2 }}
						className="h-full">
						<CardServiceRequestConfig
							forms={forms}
							loading={loading}
							intakeFormId={intakeFormId}
							setIntakeFormId={setIntakeFormId}
							reviewFormId={reviewFormId}
							setReviewFormId={setReviewFormId}
							serviceRequestApprovalType={serviceRequestApprovalType}
							setServiceRequestApprovalType={setServiceRequestApprovalType}
							reviewNeed={reviewNeed}
							setReviewNeed={setReviewNeed}
						/>
					</motion.div>
				);
			case "workOrderConfig":
				return (
					<motion.div
						key="workOrderConfig"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.2 }}
						className="h-full">
						<CardWorkOrdersConfig
							forms={forms}
							positions={positions}
							loading={loading}
							workOrdersConfig={workOrdersConfig}
							addWorkOrderConfig={addWorkOrderConfig}
							removeWorkOrderConfig={removeWorkOrderConfig}
							updateWorkOrderConfig={updateWorkOrderConfig}
						/>
					</motion.div>
				);
			default:
				return null;
		}
	};
	return (
		<div className="h-full flex flex-col">
			<PageHeader
				title="Edit Layanan"
				subtitle="Ubah konfigurasi layanan work order secara ringkas dan efisien."
				backPath={true}
				addLabel="Simpan Perubahan"
				onAddClick={updateService}
				addIcon={<Save className="size-4" />}
				loading={creating}
			/>

			{/* Main Layout - Split View */}
			<div className="flex flex-col lg:flex-row gap-8 min-h-0 overflow-hidden">
				{/* Sidebar Navigation */}
				<aside className="w-full  lg:w-72 shrink-0 overflow-y-auto scrollbar-hide">
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
				<main className="flex-1 min-w-0 h-[calc(100vh-280px)] overflow-y-auto border border-slate-200 shadow-sm rounded-lg bg-white">
					<AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
				</main>
			</div>
			<ConfirmLeaveDialog isDirty={isDirty} />
		</div>
	);
};

export default EditService;
