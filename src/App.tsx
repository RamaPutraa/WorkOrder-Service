import { Toaster } from "sonner";
import AppRoutes from "./routes";

function App() {
	return (
		<>
			<AppRoutes />
			<Toaster position="bottom-right" />
		</>
	);
}

export default App;
