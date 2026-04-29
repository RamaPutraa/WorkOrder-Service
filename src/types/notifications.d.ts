type AppNotification = {
	_id: string;
	userId: string;
	title: string;
	body: string;
	data: {
		resource: "service_request" | "work_order" | "invitation";
		resourceId: string;
		reseurceId?: string; // typo dari backend lama, backward-compat
		status: string;
	};
	isRead: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
};

type NotificationResponse = ApiResponse<AppNotification[]>;
