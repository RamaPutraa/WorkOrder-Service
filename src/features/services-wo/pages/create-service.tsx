import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ArrowLeft, CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { getPositionsApi } from "@/features/positions/services/positionService";
import { getFormsApi } from "@/features/form/services/formService";
const CreateService = () => {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState<Position[]>([]);
	const [position, setPositions] = useState<Position[]>([]);

	const [forms, setForms] = useState<Form[]>([]);
	const [selectedForms, setSelectedForms] = useState<Form[]>([]);

	const fetchPositions = async (): Promise<void> => {
		try {
			setLoading(true);
			const res = await getPositionsApi();
			setPositions(res.data ?? []);
		} catch {
			setError("Gagal memuat data posisi");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void fetchPositions();
	}, []);

	const fetchForms = async (): Promise<void> => {
		try {
			setLoading(true);
			const res = await getFormsApi();
			setForms(res.data?.forms || []);
		} catch {
			setError("Gagal memuat data form");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void fetchForms();
	}, []);

	// klik posisi
	const toggleSelect = (pos: Position) => {
		setSelected((prev) => {
			const exists = prev.some((p) => p._id === pos._id);
			if (exists) {
				return prev.filter((p) => p._id !== pos._id);
			}
			return [...prev, pos];
		});
	};

	const toggleForm = (form: Form) => {
		setSelectedForms((prev) =>
			prev.some((f) => f._id === form._id)
				? prev.filter((f) => f._id !== form._id)
				: [...prev, form]
		);
	};

	// error handling
	if (error) {
		return (
			<div className="container py-8 px-10">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}
	return (
		<>
			{/* Header */}
			<div className="flex items-center justify-between mb-9">
				<div className="flex flex-col space-y-2">
					<h1 className="text-xl font-bold tracking-tight">
						Tambah Layanan Work Order
					</h1>
					<p className="text-muted-foreground">
						Berikut merupakan form tambah Layanan work order perusahaan.
					</p>
				</div>
				<Button
					onClick={() => navigate(-1)}
					className="bg-primary hover:bg-primary/90">
					<ArrowLeft className="h-4 w-4" />
					Kembali
				</Button>
			</div>

			{/* card pertama */}
			<Card className="p-4 border shadow-md rounded-2xl ">
				<CardHeader className="pt-5 px-6">
					<div className="flex items-center justify-between">
						<p className="text-muted-foreground">
							Isi form di bawah untuk menambahkan layanan work order baru.
						</p>
					</div>
				</CardHeader>
				<CardContent className="pb-5 space-y-5">
					{/* Judul Service */}
					<div className="space-y-2">
						<Label className="text-sm font-medium">Judul Layanan</Label>
						<Input placeholder="Contoh: Cleaning Service"></Input>
					</div>
					{/* Deskripsi */}
					<div className="space-y-2">
						<Label className="text-sm font-medium">Deskripsi Layanan</Label>
						<Input placeholder="Contoh: Menjelaskan terkait layanan apa ini"></Input>
					</div>

					{/* grid column */}
					<div className="grid grid-cols-3 gap-2 items-center">
						{/* select staff */}
						<div className="space-y-2 col-span-2">
							<label className="text-sm font-medium">Tentukan Pegawai</label>
							<div className="flex flex-wrap items-center justify-between gap-2 border rounded-md px-3 py-2 mt-1.5 focus-within:ring-2 focus-within:ring-ring transition-all">
								{/* Badges section */}
								<div className="flex flex-wrap gap-1 flex-1">
									{selected.length > 0 ? (
										selected.map((p) => (
											<div
												key={p._id}
												className="
											inline-flex items-center gap-1 px-2 py-1 
											text-sm rounded-md border border-primary text-primary
											 transition-colors
										">
												<span>{p.name}</span>
												<XIcon
													onClick={(e) => {
														e.stopPropagation();
														setSelected((prev) =>
															prev.filter((s) => s._id !== p._id)
														);
													}}
													className="size-3 cursor-pointer hover:text-destructive transition-colors"
												/>
											</div>
										))
									) : (
										<span className="text-sm text-muted-foreground">
											Pilih beberapa pegawai yang dibutuhkan
										</span>
									)}
								</div>

								<DropdownMenu onOpenChange={(open) => open && fetchPositions()}>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											className="ml-auto shrink-0 flex items-center gap-1 text-sm">
											Cari Pegawai
											<ChevronDownIcon className="w-3 h-3" />
										</Button>
									</DropdownMenuTrigger>

									<DropdownMenuContent
										align="end"
										className="h-[300px] overflow-y-auto w-[250px]">
										{loading ? (
											<DropdownMenuItem disabled>Loading...</DropdownMenuItem>
										) : error ? (
											<DropdownMenuItem disabled>{error}</DropdownMenuItem>
										) : position.length > 0 ? (
											position.map((p) => {
												const isSelected = selected.some(
													(s) => s._id === p._id
												);
												return (
													<DropdownMenuItem
														key={p._id}
														onClick={(e) => {
															e.preventDefault();
															toggleSelect(p);
														}}
														className="flex justify-between">
														<span>{p.name}</span>
														{isSelected && (
															<CheckIcon className="w-4 h-4 text-primary" />
														)}
													</DropdownMenuItem>
												);
											})
										) : (
											<DropdownMenuItem disabled>
												Tidak ada posisi tersedia
											</DropdownMenuItem>
										)}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
						<div className="space-y-2 ">
							<label className="text-sm font-medium">Akses Form</label>
							<div className="mt-1.5 ">
								<Select>
									<SelectTrigger className="w-3xs py-6">
										<SelectValue placeholder="Theme" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Public">Public</SelectItem>
										<SelectItem value="Internal">Internal</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					{/* pilih forms */}
				</CardContent>
			</Card>

			{/* card kedua */}
			<Card className="p-4 border shadow-md rounded-2xl mt-8">
				<CardHeader className="pt-5 px-6">
					<div className="flex items-center justify-between">
						<p className="text-muted-foreground">
							Pilih jenis form yang akan digunakan pada layanan work order ini.
						</p>
					</div>
				</CardHeader>
				<CardContent className="pb-5 space-y-5">
					{/* pilih forms */}
					<div className="grid grid-cols-2 gap-2">
						{forms.map((form) => (
							<Label
								key={form._id}
								onClick={() => toggleForm(form)}
								className="
									hover:bg-accent/50 
									cursor-pointer
									flex items-start gap-3 
									rounded-lg border p-3
									transition-colors
									has-[[aria-checked=true]]:border-primary
									has-[[aria-checked=true]]:bg-primary/5
								">
								<Checkbox
									checked={selectedForms.some((f) => f._id === form._id)}
									className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
								/>
								<div className="grid gap-1.5 font-normal">
									<p className="text-sm leading-none font-medium">
										{form.title}
									</p>
									<p className="text-muted-foreground text-sm">
										{form.description}
									</p>
								</div>
							</Label>
						))}
					</div>

					{/* form pick views */}
					<div className="border rounded-md p-6"></div>
				</CardContent>
			</Card>
		</>
	);
};

export default CreateService;
