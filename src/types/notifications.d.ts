type AppNotification = {
	_id: string;
	userId: string;
	title: string;
	body: string;
	data: {
		resource: "service_request" | "work_order" | "invitation";
		reseurceId: string;
	};
	isRead: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
};

type NotificationResponse = ApiResponse<AppNotification[]>;
