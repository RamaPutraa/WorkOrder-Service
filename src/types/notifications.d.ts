type AppNotification = {
	_id: string;
	userId: string;
	title: string;
	body: string;
	data: {
		workOrderId: string;
	};
	isRead: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
};

type NotificationResponse = ApiResponse<AppNotification[]>;
