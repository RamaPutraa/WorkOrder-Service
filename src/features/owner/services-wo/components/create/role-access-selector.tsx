import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
	value: string;
	label: string;
};

// type Position = {
// 	_id: string;
// 	name: string;
// 	// add other props if needed
// };

interface RoleAccessSelectorProps {
	label: string;
	availableRoles: Option[];
	selectedRoles: string[];
	onToggleRole: (role: string) => void;

	// Position logic
	positions: Position[];
	selectedPositionIds: string[];
	onTogglePosition: (posId: string) => void;
}

export const RoleAccessSelector: React.FC<RoleAccessSelectorProps> = ({
	label,
	availableRoles,
	selectedRoles,
	onToggleRole,
	positions,
	selectedPositionIds,
	onTogglePosition,
}) => {
	const [openRole, setOpenRole] = React.useState(false);
	const [openPos, setOpenPos] = React.useState(false);

	const isStaffSelected = selectedRoles.includes("staff_company");

	return (
		<div className="space-y-3">
			<Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
				{label}
			</Label>

			{/* Role Selector */}
			<div className="space-y-2">
				<Popover open={openRole} onOpenChange={setOpenRole}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={openRole}
							className="w-full justify-between text-left font-normal h-auto py-2.5 px-3 border-dashed hover:border-solid hover:bg-muted/50">
							<div className="flex flex-wrap gap-1.5">
								{selectedRoles.length > 0 ?
									selectedRoles.map((roleVal) => {
										const label =
											availableRoles.find((r) => r.value === roleVal)?.label ||
											roleVal;
										return (
											<Badge
												key={roleVal}
												variant="secondary"
												className="rounded-md px-2 py-0.5 text-xs font-normal border-transparent bg-primary/10 text-primary hover:bg-primary/20">
												{label}
												<div
													className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
													onClick={(e) => {
														e.stopPropagation();
														onToggleRole(roleVal);
													}}>
													<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
												</div>
											</Badge>
										);
									})
								:	<span className="text-muted-foreground text-sm">
										Pilih role akses...
									</span>
								}
							</div>
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[300px] p-0" align="start">
						<Command>
							<CommandInput placeholder="Cari role..." />
							<CommandList>
								<CommandEmpty>Role tidak ditemukan.</CommandEmpty>
								<CommandGroup>
									{availableRoles.map((role) => (
										<CommandItem
											key={role.value}
											value={role.label}
											onSelect={() => onToggleRole(role.value)}>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													selectedRoles.includes(role.value) ? "opacity-100" : (
														"opacity-0"
													),
												)}
											/>
											{role.label}
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>

			{/* Position Selector (ONLY if Staff is selected) */}
			{isStaffSelected && (
				<div className="pl-4 border-l-2 border-primary/20 space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
					<div className="flex items-center justify-between">
						<Label className="text-xs text-muted-foreground">
							Spesifik Posisi (Opsional)
						</Label>
					</div>

					<Popover open={openPos} onOpenChange={setOpenPos}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								role="combobox"
								aria-expanded={openPos}
								className="w-full justify-between text-left font-normal h-auto min-h-[36px] bg-background">
								<div className="flex flex-wrap gap-1 p-2">
									{selectedPositionIds.length > 0 ?
										selectedPositionIds.map((posId) => {
											const posName =
												positions.find((p) => p._id === posId)?.name ||
												"Unknown";
											return (
												<Badge
													key={posId}
													variant="outline"
													className="px-1.5 py-0 text-[10px] h-6 border-primary/30 text-primary">
													{posName}
													<div
														className="ml-1 cursor-pointer"
														onClick={(e) => {
															e.stopPropagation();
															onTogglePosition(posId);
														}}>
														<X className="h-2.5 w-2.5" />
													</div>
												</Badge>
											);
										})
									:	<span className="text-muted-foreground text-xs">
											Semua posisi staff
										</span>
									}
								</div>
								<Plus className="ml-2 h-3 w-3 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[250px] p-0" align="start">
							<Command>
								<CommandInput placeholder="Cari posisi..." />
								<CommandList>
									<CommandEmpty>Posisi tidak ditemukan.</CommandEmpty>
									<CommandGroup>
										{positions.map((pos) => (
											<CommandItem
												key={pos._id}
												value={pos.name}
												onSelect={() => onTogglePosition(pos._id)}>
												<Check
													className={cn(
														"mr-2 h-4 w-4",
														selectedPositionIds.includes(pos._id) ?
															"opacity-100"
														:	"opacity-0",
													)}
												/>
												{pos.name}
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
					{selectedPositionIds.length === 0 && (
						<p className="text-[10px] text-muted-foreground italic">
							*Jika kosong, semua staff dengan role ini memiliki akses.
						</p>
					)}
				</div>
			)}
		</div>
	);
};
