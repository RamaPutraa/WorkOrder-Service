import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
	message: string;
	onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
			<AlertCircle className="w-10 h-10 text-destructive" />
			<p className="text-red-500 font-medium">{message}</p>
			{onRetry && (
				<Button variant="outline" onClick={onRetry}>
					Coba Lagi
				</Button>
			)}
		</div>
	);
}
