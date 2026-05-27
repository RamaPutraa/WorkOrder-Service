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

const bc = new BroadcastChannel("fcm-notifications");

messaging.onBackgroundMessage((payload) => {
	console.log(
		"[firebase-messaging-sw.js] Received background message ",
		payload,
	);
	bc.postMessage({ type: "NEW_NOTIFICATION", payload });
});

