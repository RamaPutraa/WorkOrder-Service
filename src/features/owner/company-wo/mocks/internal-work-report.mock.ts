export const dummyWorkReportData: WorkReport = {
	_id: "wr_001",
	workOrderId: "wo_001",
	// TODO: nanti ini ubah, harusnya report id. tapi karena ini mock gini aja dulu
	reportForm: {
		_id: "form_wr_01",
		title: "Form Laporan Perbaikan",
		description: "Form hasil laporan pengerjaan pada work order repair",
		formType: "report",
		fields: [
			{
				order: 1,
				label: "Detail Pengerjaan",
				type: "textarea",
				required: true,
				placeholder: "Jelaskan langkah pengerjaan yang dilakukan...",
				min: 10,
				max: 500,
				options: [],
			},
			{
				order: 2,
				label: "Status Akhir",
				type: "single_select",
				required: true,
				placeholder: "Pilih status akhir",
				min: 1,
				max: 100,
				options: [
					{ key: "solved", value: "Berhasil Diatasi" },
					{ key: "pending", value: "Menunggu Suku Cadang" },
					{ key: "escalated", value: "Eskalasi ke Vendor" },
				],
			},
		],
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	},
	workReportApprovalAccessType: "manager",
	status: "OnProgress",
	approvedBy: null,
	submissions: [
		{
			_id: "sub_wr_01",
			ownerId: "cmp_001",
			formId: "form_wr_01",
			submissionType: "Internal report",
			fieldsData: [
				{
					order: 1,
					value:
						"Membersihkan switch dan mengganti kabel jaringan di lantai 2.",
				},
				{ order: 2, value: "solved" },
			],
			status: "submitted",
			submittedBy: "usr_100", // Staff
			createdAt: "2024-06-01T10:00:00Z",
			updatedAt: "2024-06-01T10:30:00Z",
		},
	],
	createdAt: "2024-06-01T09:00:00Z",
	updatedAt: "2024-06-01T10:30:00Z",
	deletedAt: null,
};
