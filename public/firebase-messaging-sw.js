importScripts(
	"https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js",
);
importScripts(
	"https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js",
);

const queryParams = new URL(location.href).searchParams;

firebase.initializeApp({
	apiKey: queryParams.get("apiKey"),
	authDomain: queryParams.get("authDomain"),
	projectId: queryParams.get("projectId"),
	storageBucket: queryParams.get("storageBucket"),
	messagingSenderId: queryParams.get("messagingSenderId"),
	appId: queryParams.get("appId"),
});

const messaging = firebase.messaging();

// Create a broadcast channel to communicate with the main thread
const bc = new BroadcastChannel("fcm-notifications");

messaging.onBackgroundMessage((payload) => {
	console.log(
		"[firebase-messaging-sw.js] Received background message ",
		payload,
	);

	// Notify all open tabs that a new notification arrived
	bc.postMessage({ type: "NEW_NOTIFICATION", payload });

	// Tampilkan notifikasi secara manual untuk menggunakan icon custom (smft.png).
	// Dengan me-return Promise dari showNotification, Firebase TIDAK akan auto-display
	// notifikasinya sendiri — sehingga tidak terjadi duplikat.
	const title =
		payload.notification?.title || payload.data?.title || "Notifikasi Baru";

	return self.registration.showNotification(title, {
		body: payload.notification?.body || payload.data?.body || "",
		icon: "/smft.svg",
		data: payload.data ?? {},
	});
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	const data = event.notification.data ?? {};
	const { resource, resourceId } = data;
	// TODO: disini masi belum bener navigasinya
	// Mapping resource ke URL halaman yang sesuai
	const resourceUrlMap = {
		work_order:
			resourceId ?
				`/dashboard/internal/workorders/detail/${resourceId}`
			:	"/dashboard/internal/workorders",
		invitation: "/dashboard/unassigned/invitations-history",
		service_request:
			resourceId ?
				`/dashboard/internal/business/services/request/detail/${resourceId}`
			:	"/dashboard/internal/business/services/request",
	};

	const url = resourceUrlMap[resource] ?? "/";
	event.waitUntil(clients.openWindow(url));
});
