import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface LoadingStateProps {
	/**
	 * Variant of the loading state
	 * - fullscreen: Full page overlay with loading spinner
	 * - inline: Inline loading spinner (default)
	 * - overlay: Overlay on top of content
	 */
	variant?: "fullscreen" | "inline" | "overlay";

	/**
	 * Size of the loading spinner
	 */
	size?: "sm" | "md" | "lg" | "xl";

	/**
	 * Optional loading message
	 */
	message?: string;

	/**
	 * Additional className for customization
	 */
	className?: string;
}

const sizeClasses = {
	sm: "h-4 w-4",
	md: "h-6 w-6",
	lg: "h-8 w-8",
	xl: "h-12 w-12",
};

const textSizeClasses = {
	sm: "text-xs",
	md: "text-sm",
	lg: "text-base",
	xl: "text-lg",
};

export function LoadingState({
	variant = "inline",
	size = "md",
	message,
	className,
}: LoadingStateProps) {
	const spinnerContent = (
		<div className="flex flex-col items-center justify-center gap-3">
			<Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
			{message && (
				<p
					className={cn(
						"text-muted-foreground font-medium",
						textSizeClasses[size],
					)}>
					{message}
				</p>
			)}
		</div>
	);

	if (variant === "fullscreen") {
		return (
			<div
				className={cn(
					"fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
					className,
				)}>
				{spinnerContent}
			</div>
		);
	}

	if (variant === "overlay") {
		return (
			<div
				className={cn(
					"absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg",
					className,
				)}>
				{spinnerContent}
			</div>
		);
	}

	// inline variant
	return (
		<div className={cn("flex items-center justify-center py-8", className)}>
			{spinnerContent}
		</div>
	);
}

// Additional helper components for common use cases

/**
 * Full page loading state
 */
export function FullPageLoading({
	message = "Memuat...",
}: {
	message?: string;
}) {
	return <LoadingState variant="fullscreen" size="lg" message={message} />;
}

/**
 * Card/Section loading state
 */
export function SectionLoading({ message }: { message?: string }) {
	return <LoadingState variant="inline" size="md" message={message} />;
}

/**
 * Button loading state (small spinner)
 */
export function ButtonLoading({ message }: { message?: string }) {
	return (
		<div className="flex items-center gap-2">
			<Loader2 className="h-4 w-4 animate-spin" />
			{message && <span className="text-sm">{message}</span>}
		</div>
	);
}

/**
 * Overlay loading state for cards or sections
 */
export function OverlayLoading({ message }: { message?: string }) {
	return <LoadingState variant="overlay" size="md" message={message} />;
}

// ─── Text-based Loading Components ───────────────────────────────────────────

interface TextLoadingProps {
	/**
	 * Variant of the text loading
	 * - blink: Text fades in and out
	 * - dots: Animated trailing dots ("Memuat", "Memuat.", "Memuat..", "Memuat...")
	 * - skeleton: Shimmer placeholder bars
	 */
	variant?: "blink" | "dots" | "skeleton";
	/** Text to display (not used for skeleton variant) */
	message?: string;
	/** Additional className */
	className?: string;
}

/**
 * Text-only loading indicator — no spinner.
 *
 * @example
 * // Blinking text
 * <TextLoading variant="blink" message="Memuat data..." />
 *
 * // Animated dots
 * <TextLoading variant="dots" message="Memuat" />
 *
 * // Skeleton shimmer (3 bars by default)
 * <TextLoading variant="skeleton" />
 */
export function TextLoading({
	variant = "dots",
	message = "Memuat",
	className,
}: TextLoadingProps) {
	if (variant === "blink") {
		return (
			<span
				className={cn(
					"text-sm text-muted-foreground font-medium animate-pulse",
					className,
				)}>
				{message}
			</span>
		);
	}

	if (variant === "dots") {
		return <DotsLoading message={message} className={className} />;
	}

	// skeleton
	return <SkeletonText className={className} />;
}

/** Internal: animated dots helper */
function DotsLoading({
	message,
	className,
}: {
	message: string;
	className?: string;
}) {
	const [dots, setDots] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
		}, 400);
		return () => clearInterval(interval);
	}, []);

	return (
		<span
			className={cn("text-sm text-muted-foreground font-medium", className)}>
			{message}
			<span className="inline-block w-6 text-left">{dots}</span>
		</span>
	);
}

/**
 * Skeleton shimmer bars — use as placeholder for text content.
 *
 * @example
 * <SkeletonText lines={4} />
 */
export function SkeletonText({
	lines = 2,
	className,
}: {
	lines?: number;
	className?: string;
}) {
	return (
		<div className={cn("space-y-2", className)}>
			{Array.from({ length: lines }).map((_, i) => (
				<div
					key={i}
					className={cn(
						"h-2 rounded-md bg-muted animate-pulse",
						i === lines - 1 ? "w-2/3" : "w-full",
					)}
				/>
			))}
		</div>
	);
}
