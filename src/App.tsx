import { Toaster } from "sonner";
import AppRoutes from "./routes";
import ConfirmDialog from "./shared/molecules/dialog-confirm";

function App() {
	return (
		<>
			<AppRoutes />
			<Toaster position="bottom-right" />
			<ConfirmDialog />
		</>
	);
}

export default App;
