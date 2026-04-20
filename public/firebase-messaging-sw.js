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

messaging.onBackgroundMessage((payload) => {
	console.log(
		"[firebase-messaging-sw.js] Received background message ",
		payload,
	);

	const notificationTitle =
		payload.notification?.title || payload.data?.title || "New Notification";
	const notificationOptions = {
		body: payload.notification?.body || payload.data?.body,
		icon: "/vite.svg",
		data: payload.data,
	};

	self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	// You can pass the URL in normal data packet from backend
	// For example: { "data": { "url": "/dashboard/internal/workorders" } }
	const url = event.notification.data?.url ?? "/";
	event.waitUntil(clients.openWindow(url));
});
