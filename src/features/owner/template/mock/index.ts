// =============================================
// MOCK: GET ALL COMPANY TYPES
// =============================================
export const mockCompanyTypes: CompanyType[] = [
	{ _id: "ct-001", companyTypeName: "Konstruksi & Bangunan" },
	{ _id: "ct-002", companyTypeName: "Teknologi Informasi" },
	{ _id: "ct-003", companyTypeName: "Manufaktur & Produksi" },
	{ _id: "ct-004", companyTypeName: "Kesehatan & Klinik" },
	{ _id: "ct-005", companyTypeName: "Properti & Real Estate" },
	{ _id: "ct-006", companyTypeName: "Logistik & Pengiriman" },
];

export const companyIdMapping = {
	"ct-001": "1",
	"ct-002": "2",
	"ct-003": "3",
	"ct-004": "4",
	"ct-005": "5",
	"ct-006": "6",
};

// =============================================
// MOCK: GET ALL SERVICE TEMPLATES (by company type)
// =============================================
export const mockServiceTemplates: Record<string, ServiceTemplate[]> = {
	"ct-001": [
		{
			_id: "st-101",
			title: "Pemeliharaan Gedung Rutin",
			description:
				"Template layanan untuk pemeliharaan berkala gedung, mencakup pengecekan struktur, kelistrikan, dan kebersihan.",
		},
		{
			_id: "st-102",
			title: "Renovasi Interior",
			description:
				"Template untuk layanan renovasi ruang dalam gedung, termasuk cat, partisi, dan instalasi furnitur.",
		},
		{
			_id: "st-103",
			title: "Pemasangan Instalasi Listrik",
			description:
				"Template layanan instalasi dan perbaikan sistem kelistrikan bangunan komersial.",
		},
	],
	"ct-002": [
		{
			_id: "st-201",
			title: "Pemeliharaan Infrastruktur IT",
			description:
				"Template untuk pemeliharaan server, jaringan, dan perangkat IT perusahaan.",
		},
		{
			_id: "st-202",
			title: "Help Desk & Support",
			description:
				"Template layanan dukungan teknis harian untuk karyawan internal.",
		},
	],
	"ct-003": [
		{
			_id: "st-301",
			title: "Perawatan Mesin Produksi",
			description:
				"Template untuk perawatan preventif dan korektif mesin-mesin produksi di pabrik.",
		},
		{
			_id: "st-302",
			title: "Inspeksi Kualitas Produk",
			description:
				"Template layanan inspeksi dan pengendalian kualitas hasil produksi.",
		},
	],
	"ct-004": [
		{
			_id: "st-401",
			title: "Pemeliharaan Alat Medis",
			description:
				"Template layanan kalibrasi dan pemeliharaan peralatan medis klinik.",
		},
	],
	"ct-005": [
		{
			_id: "st-501",
			title: "Pemeliharaan Properti",
			description:
				"Template layanan pemeliharaan unit hunian dan area fasilitas umum.",
		},
	],
	"ct-006": [
		{
			_id: "st-601",
			title: "Pengecekan Armada Kendaraan",
			description:
				"Template layanan inspeksi dan perawatan rutin armada kendaraan pengiriman.",
		},
	],
};

// =============================================
// MOCK: GET SERVICE TEMPLATE PREVIEW
// =============================================
export const mockTemplatePreview: Record<string, ServiceTemplatePreview> = {
	"st-101": {
		_id: "st-101",
		service: {
			_id: "svc-101",
			serviceKey: "SVC-MAINT-001",
			companyId: "company-001",
			title: "Pemeliharaan Gedung Rutin",
			description:
				"Layanan pemeliharaan berkala gedung yang mencakup pengecekan struktur bangunan, sistem kelistrikan, plumbing, dan kebersihan area umum. Dilakukan setiap bulan oleh tim teknisi bersertifikat.",
			accessType: "internal",
			isActive: true,
			serviceRequestConfig: {
				intakeForm: {
					_id: "form-001",
					title: "Formulir Permintaan Pemeliharaan",
					description: "Form pengajuan permintaan pemeliharaan gedung",
					formType: "intake",
					fields: [],
					createdAt: "2024-01-10T08:00:00Z",
					updatedAt: "2024-01-10T08:00:00Z",
				},
				reviewForm: {
					_id: "form-002",
					title: "Formulir Review Pemeliharaan",
					description: "Form review hasil pemeliharaan",
					formType: "review",
					fields: [],
					createdAt: "2024-01-10T08:00:00Z",
					updatedAt: "2024-01-10T08:00:00Z",
				},
				serviceRequestApprovalAccessType: "manager",
				reviewNeed: true,
			},
			workOrdersConfig: [
				{
					_id: "woc-001",
					workOrderForm: {
						_id: "form-003",
						title: "Formulir Perintah Kerja",
						description: "Form instruksi kerja untuk teknisi",
						formType: "work_order",
						fields: [],
						createdAt: "2024-01-10T08:00:00Z",
						updatedAt: "2024-01-10T08:00:00Z",
					},
					workReportForm: {
						_id: "form-004",
						title: "Formulir Laporan Kerja",
						description: "Form laporan hasil pengerjaan",
						formType: "report",
						fields: [],
						createdAt: "2024-01-10T08:00:00Z",
						updatedAt: "2024-01-10T08:00:00Z",
					},
					positionsOnDuty: {
						_id: "pos-001",
						name: "Teknisi Sipil",
						description: "Teknisi bangunan dan sipil",
						isActive: true,
						companyId: "1",
						createdAt: "2024-01-01T00:00:00Z",
						updatedAt: "2024-01-01T00:00:00Z",
						deletedAt: "",
						__v: 0,
					},
					workOrderApprovalAccessType: "auto",
					workReportApprovalAccessType: "manager",
					minStaff: 2,
					maxStaff: 5,
				},
			],
			createdAt: "2024-01-10T08:00:00Z",
			updatedAt: "2024-03-01T08:00:00Z",
		},
		positionRequired: [
			{
				_id: "pos-001",
				name: "Teknisi Sipil",
				description: "Bertanggung jawab atas pengecekan struktur bangunan",
				isActive: true,
				companyId: "1",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
				deletedAt: "",
				__v: 0,
			},
			{
				_id: "pos-002",
				name: "Teknisi Listrik",
				description: "Bertanggung jawab atas sistem kelistrikan",
				isActive: true,
				companyId: "1",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
				deletedAt: "",
				__v: 0,
			},
		],
	},
	"st-102": {
		_id: "st-102",
		service: {
			_id: "svc-102",
			serviceKey: "SVC-RENOV-001",
			companyId: "company-001",
			title: "Renovasi Interior",
			description:
				"Layanan renovasi ruang dalam gedung meliputi pengecatan, pemasangan partisi, dan instalasi furnitur sesuai kebutuhan klien.",
			accessType: "member_only",
			isActive: true,
			serviceRequestConfig: {
				intakeForm: {
					_id: "form-011",
					title: "Formulir Permintaan Renovasi",
					description: "Form detail permintaan renovasi",
					formType: "intake",
					fields: [],
					createdAt: "2024-02-01T08:00:00Z",
					updatedAt: "2024-02-01T08:00:00Z",
				},
				reviewForm: {
					_id: "form-012",
					title: "Formulir Review Renovasi",
					description: "Form review hasil renovasi",
					formType: "review",
					fields: [],
					createdAt: "2024-02-01T08:00:00Z",
					updatedAt: "2024-02-01T08:00:00Z",
				},
				serviceRequestApprovalAccessType: "manager",
				reviewNeed: true,
			},
			workOrdersConfig: [
				{
					_id: "woc-011",
					workOrderForm: {
						_id: "form-013",
						title: "Formulir Perintah Renovasi",
						description: "Form instruksi renovasi untuk pekerja",
						formType: "work_order",
						fields: [],
						createdAt: "2024-02-01T08:00:00Z",
						updatedAt: "2024-02-01T08:00:00Z",
					},
					workReportForm: {
						_id: "form-014",
						title: "Formulir Laporan Renovasi",
						description: "Form laporan penyelesaian renovasi",
						formType: "report",
						fields: [],
						createdAt: "2024-02-01T08:00:00Z",
						updatedAt: "2024-02-01T08:00:00Z",
					},
					positionsOnDuty: {
						_id: "pos-003",
						name: "Desainer Interior",
						description: "Merancang tata letak dan estetika ruangan",
						isActive: true,
						companyId: "1",
						createdAt: "2024-01-01T00:00:00Z",
						updatedAt: "2024-01-01T00:00:00Z",
						deletedAt: "",
						__v: 0,
					},
					workOrderApprovalAccessType: "staff_pic",
					workReportApprovalAccessType: "manager",
					minStaff: 3,
					maxStaff: 8,
				},
			],
			createdAt: "2024-02-01T08:00:00Z",
			updatedAt: "2024-03-15T08:00:00Z",
		},
		positionRequired: [
			{
				_id: "pos-003",
				name: "Desainer Interior",
				description: "Merancang tata letak dan estetika ruangan",
				isActive: true,
				companyId: "1",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
				deletedAt: "",
				__v: 0,
			},
			{
				_id: "pos-004",
				name: "Tukang Cat",
				description: "Pengecatan dinding dan finishing",
				isActive: true,
				companyId: "1",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
				deletedAt: "",
				__v: 0,
			},
		],
	},
};
