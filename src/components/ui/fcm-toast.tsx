import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
	Bell,
	X,
	ExternalLink,
	CheckCircle2,
	AlertTriangle,
	XCircle,
	Info,
} from "lucide-react";

// ─── Inject animation keyframes once into <head> ──────────────────────────
// Animation origin = top-right so the toast appears to "grow" from the bell button
if (typeof document !== "undefined") {
	const STYLE_ID = "__fcm_toast_anim__";
	if (!document.getElementById(STYLE_ID)) {
		const el = document.createElement("style");
		el.id = STYLE_ID;
		el.textContent = `
      @keyframes fcm-popup {
        0%   { opacity: 0; transform: scale(0.55) translateY(-10px); }
        60%  { opacity: 1; transform: scale(1.02) translateY(2px);   }
        100% { opacity: 1; transform: scale(1)     translateY(0);     }
      }
      .fcm-enter {
        animation: fcm-popup 0.48s cubic-bezier(0.16, 1, 0.3, 1) both;
        transform-origin: top right;
      }
    `;
		document.head.appendChild(el);
	}
}

// ─── Types ─────────────────────────────────────────────────────────────────
export type FcmNotificationType = "success" | "warning" | "error" | "info";

interface FcmToastProps {
	toastId: string | number;
	title: string;
	body?: string;
	url?: string;
	type?: FcmNotificationType;
	duration?: number;
}

// ─── Per-type config ────────────────────────────────────────────────────────
// Hex colors removed to use shadcn primary theme
const TYPE_CFG = {
	success: { Icon: CheckCircle2, label: "Berhasil" },
	warning: { Icon: AlertTriangle, label: "Peringatan" },
	error: { Icon: XCircle, label: "Error" },
	info: { Icon: Info, label: "Info" },
} as const satisfies Record<
	FcmNotificationType,
	{ Icon: React.ElementType; label: string }
>;

// ─── Component ──────────────────────────────────────────────────────────────
export const FcmToast: React.FC<FcmToastProps> = ({
	toastId,
	title,
	body,
	url,
	type = "info",
	duration = 6000,
}) => {
	const [progress, setProgress] = useState(100);
	const [hovered, setHovered] = useState(false);

	// Track elapsed time so we can pause the progress bar on hover
	const elapsed = useRef(0);
	const lastTick = useRef(Date.now());
	const paused = useRef(false);

	const { Icon } = TYPE_CFG[type];

	// ── Progress bar ticker ──────────────────────────────────────────────
	useEffect(() => {
		const id = setInterval(() => {
			const now = Date.now();
			if (!paused.current) {
				elapsed.current += now - lastTick.current;
				const pct = Math.max(0, 100 - (elapsed.current / duration) * 100);
				setProgress(pct);
			}
			lastTick.current = now;
		}, 50);
		return () => clearInterval(id);
	}, [duration]);

	const handleMouseEnter = () => {
		paused.current = true;
		setHovered(true);
	};

	const handleMouseLeave = () => {
		lastTick.current = Date.now(); // reset so we don't add pause time
		paused.current = false;
		setHovered(false);
	};

	const dismiss = () => toast.dismiss(toastId);

	return (
		<>
			{/* ── Outer wrapper: handles animation & caret (no overflow-hidden) ── */}
			<div
				className="fcm-enter relative"
				style={{ width: 360, position: "relative" }}>
				{/* ── Arrow caret pointing up toward the NavActions bell button ── */}
				<div
					style={{
						position: "absolute",
						// Align caret roughly below the bell button (mr-7 ≈ 28px from right, button ~30px wide)
						top: -8,
						right: 28,
						width: 16,
						height: 9,
						zIndex: 1,
						overflow: "hidden",
					}}>
					{/* Rotated square trick: shows top half as a triangle */}
					<div
						style={{
							position: "absolute",
							bottom: -5,
							left: "50%",
							transform: "translateX(-50%) rotate(45deg)",
							width: 12,
							height: 12,
							background: "hsl(var(--background))",
							border: "1px solid hsl(var(--border))",
							borderRight: "none",
							borderBottom: "none",
						}}
					/>
				</div>

				{/* ── Card: overflow-hidden for border-radius clipping ── */}
				<div
					// Tambahkan border-l-4 dan border-l-primary di sini
					className="bg-background border border-border border-l-4 border-l-primary rounded-[14px] overflow-hidden"
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					style={{
						boxShadow:
							hovered ?
								"0 24px 56px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.10)"
							:	"0 6px 28px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05)",
						transform:
							hovered ?
								"translateY(-2px) scale(1.004)"
							:	"translateY(0) scale(1)",
						transition: "box-shadow 0.25s ease, transform 0.25s ease",
					}}>
					{/* ── Main Content ────────────────────────────────────────── */}
					<div className="flex items-start gap-3 px-4 pt-3.5 pb-3">
						{/* Icon Container - Use bg-primary/5 */}
						<div
							className="shrink-0 flex items-center justify-center rounded-xl mt-0.5 bg-primary/5"
							style={{ width: 36, height: 36 }}>
							{/* Lucide icon - Use text-primary */}
							<Icon
								size={16}
								className="text-primary"
								color="currentColor"
								strokeWidth={2.2}
							/>
						</div>

						{/* Content */}
						<div className="flex-1 min-w-0">
							{/* Source tag */}
							<div className="flex items-center gap-1 mb-0.5">
								<Bell
									size={9}
									className="shrink-0 text-primary"
									strokeWidth={2.5}
									color="currentColor"
								/>
								<span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
									WorkOrder &bull; Notifikasi
								</span>
							</div>

							{/* Title */}
							<p className="text-[13px] font-bold text-foreground leading-snug line-clamp-1">
								{title}
							</p>

							{/* Body */}
							{body && (
								<p className="text-[11.5px] text-muted-foreground leading-relaxed line-clamp-2 mt-0.5">
									{body}
								</p>
							)}

							{/* CTA button - Use text-primary */}
							{url && (
								<button
									onClick={() => {
										window.location.href = url;
										dismiss();
									}}
									className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold hover:opacity-75 transition-opacity text-primary"
									style={{
										background: "transparent",
										border: "none",
										cursor: "pointer",
										padding: 0,
									}}>
									Lihat detail <ExternalLink size={10} />
								</button>
							)}
						</div>

						{/* Dismiss button */}
						<button
							onClick={dismiss}
							className="shrink-0 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors text-muted-foreground mt-0.5"
							style={{
								width: 20,
								height: 20,
								border: "none",
								cursor: "pointer",
							}}>
							<X size={11} />
						</button>
					</div>

					{/* ── Progress bar ──────────────────────────────────────── */}
					<div className="h-[3px] bg-border/60">
						<div
							className="bg-gradient-to-r from-primary/30 to-primary"
							style={{
								height: "100%",
								width: `${progress}%`,
								borderRadius: "0 3px 0 0",
								transition: "width 55ms linear",
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
};
