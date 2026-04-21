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

	// We no longer manually call showNotification here because Firebase
	// handles it automatically for background messages with a 'notification' payload.
	// Calling it manually causes duplicate notifications.
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	// You can pass the URL in normal data packet from backend
	// For example: { "data": { "url": "/dashboard/internal/workorders" } }
	const url = event.notification.data?.url ?? "/";
	event.waitUntil(clients.openWindow(url));
});
