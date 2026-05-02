import { Building2, Briefcase } from "lucide-react";

interface InternalContentProps {
	profile: User;
}

export default function InternalContent({ profile }: InternalContentProps) {
	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
			{/* ── Section: Informasi Akun ───────────────────────── */}
			<div className="space-y-3">
				<h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
					Informasi Akun
				</h2>

				<div className="bg-muted/10 border border-border/40 rounded-2xl overflow-hidden">
					<div className="flex flex-col">
						{/* Item: Perusahaan */}
						<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-5 border-b border-border/40">
							<div className="sm:w-48 shrink-0">
								<p className="text-sm font-medium text-muted-foreground">
									Perusahaan
								</p>
							</div>
							<div className="flex-1 flex items-center gap-2.5">
								<Building2 className="w-4 h-4 text-muted-foreground/70 shrink-0" />
								{profile.company?.name ?
									<p className="text-sm text-foreground font-medium">
										{profile.company.name}
									</p>
								:	<p className="text-sm text-muted-foreground/50 italic">
										Belum diatur
									</p>
								}
							</div>
						</div>

						{/* Item: Jabatan */}
						<div className="flex flex-col  sm:flex-row sm:items-center gap-2 sm:gap-6 p-5">
							<div className="sm:w-48 shrink-0">
								<p className="text-sm font-medium text-muted-foreground">
									Jabatan
								</p>
							</div>
							<div className="flex-1 flex items-center gap-2.5">
								<Briefcase className="w-4 h-4 text-muted-foreground/70 shrink-0" />
								{profile.role ?
									<p className="text-sm text-foreground font-medium">
										{profile.role === "owner_company" ?
											"Owner Perusahaan"
										: profile.role === "manager_company" ?
											"Manager Perusahaan"
										:	"Staff Perusahaan"}
									</p>
								:	<p className="text-sm  italic">{profile.role}</p>}
							</div>
						</div>

						{/* Item: posisi */}
						<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-5">
							<div className="sm:w-48 shrink-0">
								<p className="text-sm font-medium text-muted-foreground">
									Posisi
								</p>
							</div>
							<div className="flex-1 flex items-center gap-2.5">
								<Briefcase className="w-4 h-4 text-muted-foreground/70 shrink-0" />
								{profile.position?.name ?
									<p className="text-sm text-foreground font-medium">
										{profile.position.name}
									</p>
								:	<p className="text-sm text-muted-foreground/50 italic">-</p>}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
