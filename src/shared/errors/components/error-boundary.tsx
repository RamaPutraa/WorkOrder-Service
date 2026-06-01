import { Component, type ReactNode } from "react";
import ErrorPage, { type ErrorStatus } from "../templates/error-page";
import ChunkErrorPage from "../templates/chunk-error-page";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	isChunkError: boolean;
	errorStatus?: ErrorStatus;
	errorMessage?: string;
}

/**
 * Mengecek apakah error disebabkan oleh chunk/module yang gagal di-load.
 * Biasanya terjadi setelah deployment baru dimana hash file JS berubah.
 */
function isChunkLoadError(error: unknown): boolean {
	if (error instanceof Error) {
		return (
			error.message.includes("Failed to fetch dynamically imported module") ||
			error.message.includes("error loading dynamically imported module") ||
			error.message.includes("Loading chunk") ||
			error.message.includes("Loading CSS chunk") ||
			error.name === "ChunkLoadError"
		);
	}
	return false;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, isChunkError: false };
	}

	static getDerivedStateFromError(error: unknown): Partial<ErrorBoundaryState> {
		return {
			hasError: true,
			isChunkError: isChunkLoadError(error),
		};
	}

	componentDidCatch(error: unknown) {
		// Jika chunk error, cukup set state — ChunkErrorPage yang handle
		if (isChunkLoadError(error)) {
			this.setState({
				hasError: true,
				isChunkError: true,
			});
			return;
		}

		let status: ErrorStatus = 500;
		let message = "Terjadi kesalahan yang tidak terduga.";

		if (error instanceof Response) {
			status = (error.status as ErrorStatus) || 500;
			message = error.statusText || message;
		} else if (error instanceof Error) {
			message = error.message;
		}

		this.setState({
			hasError: true,
			isChunkError: false,
			errorStatus: status,
			errorMessage: message,
		});
	}

	render() {
		if (this.state.hasError) {
			// Tampilkan halaman khusus untuk chunk error
			if (this.state.isChunkError) {
				return <ChunkErrorPage />;
			}

			return (
				<ErrorPage
					status={this.state.errorStatus}
					message={this.state.errorMessage}
				/>
			);
		}

		return this.props.children;
	}
}
