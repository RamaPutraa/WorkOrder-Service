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
			{/* 
			  Positioned at top-right with offset just below the h-16 (64px) header.
			  The bell button in NavActions sits ~mr-7 (28px) from the right inside px-3 (12px)
			  → right: 12 aligns the toast container edge near the button area.
			*/}
			<Toaster
				position="top-right"
				offset={{ top: 68, right: 12 }}
				closeButton={false}
			/>
			<ConfirmDialog />
		</>
	);
}

export default App;
