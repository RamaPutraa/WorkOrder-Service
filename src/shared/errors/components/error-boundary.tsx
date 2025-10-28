import { Component, type ReactNode } from "react";
import ErrorPage, { type ErrorStatus } from "../templates/error-page";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	errorStatus?: ErrorStatus;
	errorMessage?: string;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
		return { hasError: true };
	}

	componentDidCatch(error: unknown) {
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
			errorStatus: status,
			errorMessage: message,
		});
	}

	render() {
		if (this.state.hasError) {
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
