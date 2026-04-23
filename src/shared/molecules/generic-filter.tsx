import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { BrushCleaning, CalendarIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export type FilterType = "text" | "select" | "date" | "date-range";

export interface FilterOption {
	label: string;
	value: string;
}

export interface FilterConfig {
	/** Unik ID untuk query & state parameter (Misal: 'search' atau 'status') */
	id: string;
	label: string;
	type: FilterType;
	/** Diperlukan hanya jika type = "select" */
	options?: FilterOption[];
	/** Placeholder saat text kosong atau opsi belum terpilih */
	placeholder?: string;
	/** (Khusus 'text') Lebar form input agar tidak selalu mengikuti sisa flexbox */
	className?: string;
}

interface GenericFilterProps {
	/** Array of filter rules configuration */
	config: FilterConfig[];
	/** Label untuk tombol clear filter. Default: "Reset" */
	clearLabel?: string;
}

/**
 * Generic configuration-driven filter yang mengubah URL Search Params.
 * Bisa menampung input Text (Search) atau Select (Dropdown).
 */
export const GenericFilter: React.FC<GenericFilterProps> = ({ config }) => {
	const [searchParams, setSearchParams] = useSearchParams();

	// Helper utk mendapatkan query parameter value (Bisa undefined jika blm diset)
	const getValue = (key: string) => searchParams.get(key) || "";

	// Helper utk set state filter ke URL (Hapus key jika valuenya kosong)
	const setValue = (key: string, value: string) => {
		const updated = new URLSearchParams(searchParams.toString());
		if (value) {
			updated.set(key, value);
		} else {
			updated.delete(key);
		}
		setSearchParams(updated, { replace: true });
	};

	const hasAnyFilter = Array.from(searchParams.keys()).some((key) =>
		config.some((c) => c.id === key),
	);

	const clearAllFilters = () => {
		const updated = new URLSearchParams(searchParams.toString());
		config.forEach((c) => {
			updated.delete(c.id);
			if (c.type === "date-range") {
				updated.delete(`${c.id}_end`);
			}
		});
		setSearchParams(updated, { replace: true });
	};

	return (
		<div className="flex flex-wrap items-center gap-3">
			{config.map((item) => {
				const currentValue = getValue(item.id);

				// -- Text Filter
				if (item.type === "text") {
					return (
						<div
							key={item.id}
							className={`relative flex-1 sm:flex-none min-w-[200px] ${item.className || ""}`}>
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder={
									item.placeholder || `Cari ${item.label.toLowerCase()}...`
								}
								value={currentValue}
								onChange={(e) => setValue(item.id, e.target.value)}
								className="pl-9 h-10 w-full  bg-background border-slate-200 rounded-lg"
							/>
						</div>
					);
				}

				if (item.type === "select") {
					return (
						<div key={item.id} className="">
							<Select
								value={currentValue || "all"}
								onValueChange={(val) =>
									setValue(item.id, val === "all" ? "" : val)
								}>
								<SelectTrigger className="h-10  bg-background border-slate-200 rounded-lg">
									<SelectValue
										placeholder={item.placeholder || `Semua ${item.label}`}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">
										{item.placeholder || `Semua ${item.label}`}
									</SelectItem>
									{item.options?.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					);
				}

				// -- Date Filter (Single Date)
				if (item.type === "date") {
					const dateValue = currentValue ? new Date(currentValue) : undefined;
					return (
						<div key={item.id} className="w-full sm:w-[200px] ">
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant={"outline"}
										className={cn(
											"w-full h-10  justify-start text-left font-normal border-slate-200 rounded-lg",
											!dateValue && "text-muted-foreground",
										)}>
										<CalendarIcon className="h-4 w-4" />
										{dateValue ?
											format(dateValue, "PP", { locale: id })
										:	<span>{item.label}</span>}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0 rounded-lg" align="start">
									<Calendar
										className="rounded-lg"
										mode="single"
										selected={dateValue}
										onSelect={(date) =>
											setValue(item.id, date ? date.toISOString() : "")
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>
					);
				}

				// -- Date Range Filter
				if (item.type === "date-range") {
					const endValue = getValue(`${item.id}_end`);
					const dateRange = {
						from: currentValue ? new Date(currentValue) : undefined,
						to: endValue ? new Date(endValue) : undefined,
					};

					return (
						<div
							key={item.id}
							className={cn("w-full sm:w-[260px]", item.className)}>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant={"outline"}
										className={cn(
											"w-full h-10  justify-start text-left font-normal border-slate-200",
											!dateRange.from && "text-muted-foreground",
										)}>
										<CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
										<span className="truncate">
											{dateRange.from ?
												dateRange.to ?
													<>
														{format(dateRange.from, "LLL dd, y", {
															locale: id,
														})}{" "}
														-{" "}
														{format(dateRange.to, "LLL dd, y", { locale: id })}
													</>
												:	format(dateRange.from, "LLL dd, y", { locale: id })
											:	item.placeholder || `Pilih Rentang ${item.label}`}
										</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										initialFocus
										mode="range"
										defaultMonth={dateRange.from}
										selected={dateRange}
										onSelect={(range) => {
											const updated = new URLSearchParams(
												searchParams.toString(),
											);
											if (range?.from) {
												updated.set(item.id, range.from.toISOString());
											} else {
												updated.delete(item.id);
											}

											if (range?.to) {
												updated.set(`${item.id}_end`, range.to.toISOString());
											} else {
												updated.delete(`${item.id}_end`);
											}

											setSearchParams(updated, { replace: true });
										}}
										numberOfMonths={2}
									/>
								</PopoverContent>
							</Popover>
						</div>
					);
				}

				return null;
			})}

			{hasAnyFilter && (
				<Button
					variant="outline"
					onClick={clearAllFilters}
					className="h-10 px-4 bg-yellow-500/5 text-yellow-500 text-sm font-medium  hover:text-foreground hover:bg-yellow-500">
					<BrushCleaning className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
};
