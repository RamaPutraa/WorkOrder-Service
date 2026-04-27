import { toast } from "sonner";
import { FcmToast, type FcmNotificationType } from "@/components/ui/fcm-toast";

const DURATION = 6500; // ms

export interface ShowFcmToastOptions {
	title: string;
	body?: string;
	url?: string;
	/** Determines accent color & icon. Defaults to "info". */
	type?: FcmNotificationType;
}

/**
 * Shows a beautifully animated, custom-styled FCM notification toast.
 * Call this instead of toast() directly when displaying FCM messages.
 */
export const showFcmToast = (opts: ShowFcmToastOptions) => {
	toast.custom(
		(t) => (
			<FcmToast
				toastId={t}
				title={opts.title}
				body={opts.body}
				url={opts.url}
				type={opts.type ?? "info"}
				duration={DURATION}
			/>
		),
		{
			duration: DURATION,
			position: "top-right", // FCM toasts always appear at the top right near the bell icon
		},
	);
};
