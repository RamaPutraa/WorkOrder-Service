import { Toaster } from "sonner";
import AppRoutes from "./routes";
import ConfirmDialog from "./shared/molecules/dialog-confirm";
import { useFcm } from "@/hooks/use-fcm";

function FcmWrapper() {
	useFcm();
	return null;
}

function App() {
	return (
		<>
			<FcmWrapper />
			<AppRoutes />
			<Toaster
				position="bottom-right"
				offset={{ top: 55, bottom: 30, right: 40 }}
				closeButton={false}
			/>
			<ConfirmDialog />
		</>
	);
}

export default App;
