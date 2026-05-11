import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import AppRoutes from "./routes";
import ConfirmDialog from "./shared/molecules/dialog-confirm";
import { useFcm } from "@/hooks/use-fcm";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
		},
	},
});

function FcmWrapper() {
	useFcm();
	return null;
}

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<FcmWrapper />
			<AppRoutes />
			<Toaster
				position="bottom-right"
				offset={{ top: 55, bottom: 30, right: 40 }}
				closeButton={false}
			/>
			<ConfirmDialog />
		</QueryClientProvider>
	);
}

export default App;
