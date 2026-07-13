type Position = {
	_id: string;
	name: string;
	description: string;
	isActive: boolean;
	companyId: string;
	deletedAt: string | null;
	createdAt: string;
	updatedAt: string | null;
	__v: number;
};

type Employee = {
	_id: string;
	name: string;
	email: string;
	role: string;
	companyId: string;
	deletedAt: string | null;
	createdAt: string;
	updatedAt: string | null;
	__v: number;
	position?: Position;
};

type KickEmployeeRequest = {
	email: string;
};
type KickEmployeeResponse = ApiResponse<User>;

type DetailEmployeeResponse = ApiResponse<Employee> & {
	meta: {
		canKick: boolean;
	}
};

type CompanyEmployeesData = {
	company: {
		_id: string;
		name: string;
	};
	employees: Employee[];
};

type CompanyEmployeesResponse = ApiResponse<Employee[]> & {
	meta: {
		count: number;
	};
};

type InvitationStatus = "pending" | "accepted" | "rejected" | "expired";

type InvitationsHistory = {
	_id: string;
	role: string;
	positionId?: string;
	status: InvitationStatus;
	expiresAt: string;
	deletedAt: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	position?: {
		_id: string;
		name: string;
	};
	company: {
		_id: string;
		name: string;
	};
	user: {
		_id: string;
		name: string;
		email: string;
	};
};

type InvitationsHistoryResponse = ApiResponse<InvitationsHistory[]>;

type InvitedItem = {
	user: {
		name: string;
		email: string;
	};
	role_offered: string;
	position_offered?: {
		_id: string;
		name: string;
	};
};

type InvitationEmployee = {
	company: CompanyMinimal;
	invited: InvitedItem[];
};

type InviteSingleItem = {
	email: string;
	role: string;
	positionId?: string;
};

type InvitationEmployeeRequest = {
	invites: InviteSingleItem[];
};

type InvitationEmployeeResponse = ApiResponse<InvitationEmployee>;

// ─── Invitation Code (kode undangan pegawai) ──────────────────────────────

type StaffInvitationCodeRole = "staff_company" | "manager_company";

type StaffInvitationCodePosition = {
	_id: string;
	name: string;
	description: string;
};

type StaffInvitationCodeCreatedBy = {
	_id: string;
	name: string;
	email: string;
};

type StaffInvitationCode = {
	_id: string;
	code: string;
	companyId: string;
	role: StaffInvitationCodeRole;
	position?: StaffInvitationCodePosition | null;
	createdBy: StaffInvitationCodeCreatedBy;
	isActive: boolean;
	maxUses: number | null;
	usedCount: number;
	remainingUses: number | null;
	expiresAt: string | null;
	isClaimable: boolean;
	claimedCount: number;
	createdAt: string;
	updatedAt: string;
};

type StaffInvitationCodeListResponse = ApiResponse<StaffInvitationCode[]>;
type StaffInvitationCodeResponse = ApiResponse<StaffInvitationCode>;

type CreateStaffInvitationCodeRequest = {
	role: StaffInvitationCodeRole;
	positionId?: string;
	code?: string;
	maxUses?: number;
	expiresInDays?: number;
};

type UpdateStaffInvitationCodeRequest = {
	isActive?: boolean;
	maxUses?: number;
	role?: StaffInvitationCodeRole;
	positionId?: string;
	expiresInDays?: number;
};
