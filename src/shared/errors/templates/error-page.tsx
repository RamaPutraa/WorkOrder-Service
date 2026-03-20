/**
 * error-page.tsx
 *
 * Generic error page yang dipakai oleh ErrorBoundary dan errorElement di routes.
 * Masing-masing status code diarahkan ke halaman tersendiri.
 */
import NotFoundPage from "./not-found-page";
import UnauthorizedPage from "./unauthorized-page";
import ForbiddenPage from "./forbidden-page";
import ServerErrorPage from "./server-error-page";
import ServiceUnavailablePage from "./service-unavailable-page";

export type ErrorStatus = 401 | 403 | 404 | 500 | 503;

interface ErrorPageProps {
	status?: ErrorStatus;
	message?: string;
}

export default function ErrorPage({ status = 500 }: ErrorPageProps) {
	switch (status) {
		case 401:
			return <UnauthorizedPage />;
		case 403:
			return <ForbiddenPage />;
		case 404:
			return <NotFoundPage />;
		case 503:
			return <ServiceUnavailablePage />;
		default:
			return <ServerErrorPage />;
	}
}
