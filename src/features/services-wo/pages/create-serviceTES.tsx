import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { getPositionsApi } from "@/features/positions/services/positionService";
import {
	getFormsApi,
	getFormByIdApi,
} from "@/features/form/services/formService";

import FormSelector from "../components/create/form-selector";
import StaffSelector from "../components/create/staff-selector";
import { useFormAccessConfig } from "../hooks/useForm";

const statuses = [
	{ value: "true", label: "Aktif" },
	{ value: "false", label: "Non-Aktif" },
];

const CreateService = () => {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const [open, setOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<
		(typeof statuses)[0] | null
	>(null);

	const [positions, setPositions] = useState<Position[]>([]);
	const [availableRoles, setAvailableRoles] = useState<string[]>([]);
	const [selectedStaff, setSelectedStaff] = useState<Staff[]>([]);
	const [forms, setForms] = useState<Form[]>([]);
	const [selectedForms, setSelectedForms] = useState<Form[]>([]);

	// satu-satunya hook config
	const {
		formAccessConfig,
		initConfig,
		removeConfig,
		toggleRoleFill,
		toggleRoleView,
		toggleFillablePosition,
		toggleViewablePosition,
	} = useFormAccessConfig();

	useEffect(() => setAvailableRoles(["owner", "manager", "staff"]), []);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const res = await getPositionsApi();
				setPositions(res.data ?? []);
			} catch {
				setError("Gagal memuat data posisi");
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const res = await getFormsApi();
				setForms(res.data?.forms || []);
			} catch {
				setError("Gagal memuat data form");
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const toggleStaff = (pos: Position) => {
		setSelectedStaff((prev) => {
			const exists = prev.some((s) => s.position._id === pos._id);
			if (exists) return prev.filter((s) => s.position._id !== pos._id);
			return [...prev, { position: pos, minimumStaff: 1, maximumStaff: 1 }];
		});
	};

	const toggleForm = async (form: Form) => {
		const alreadySelected = selectedForms.some((f) => f._id === form._id);
		if (alreadySelected) {
			setSelectedForms((prev) => prev.filter((f) => f._id !== form._id));
			removeConfig(form._id);
			return;
		}

		const res = await getFormByIdApi(form._id);
		const detailedForm = res.data?.form;
		if (!detailedForm) return;

		setSelectedForms((prev) => [...prev, detailedForm]);
		initConfig(detailedForm._id);
	};

	if (error) {
		return (
			<div className="container py-8 px-10">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<>
			<div className="flex items-center justify-between mb-9">
				<div className="flex flex-col space-y-2">
					<h1 className="text-xl font-bold tracking-tight">
						Tambah Layanan Work Order
					</h1>
					<p className="text-muted-foreground">
						Isi form berikut untuk menambahkan layanan baru.
					</p>
				</div>
				<Button onClick={() => navigate(-1)} className="bg-primary">
					<ArrowLeft className="h-4 w-4 mr-2" />
					Kembali
				</Button>
			</div>

			{/* Card 1 */}
			<Card className="p-4 border shadow-md rounded-2xl">
				<CardHeader>
					<p className="text-muted-foreground">
						Lengkapi informasi dasar layanan.
					</p>
				</CardHeader>

				<CardContent className="pb-5 space-y-5">
					<div>
						<Label>Judul Layanan</Label>
						<Input placeholder="Contoh: Cleaning Service" />
					</div>
					<div>
						<Label>Deskripsi Layanan</Label>
						<Input placeholder="Contoh: Penjelasan singkat layanan" />
					</div>

					<div className="grid grid-cols-3 my-8">
						{/* Status */}
						<div className="flex items-center space-x-4">
							<p className="font-medium text-sm">Status</p>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button variant="outline" className="w-[150px] justify-start">
										{selectedStatus?.label || "+ Set status"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="p-0">
									<Command>
										<CommandList>
											<CommandEmpty>No results found.</CommandEmpty>
											<CommandGroup>
												{statuses.map((status) => (
													<CommandItem
														key={status.value}
														onSelect={() => {
															setSelectedStatus(status);
															setOpen(false);
														}}>
														{status.label}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</div>

						{/* Access Form */}
						<div className="flex items-center gap-3">
							<label className="text-sm font-medium">Akses Form</label>
							<Select>
								<SelectTrigger className="w-[200px]">
									<SelectValue placeholder="Pilih Akses" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="public">Public</SelectItem>
									<SelectItem value="internal">Internal</SelectItem>
									<SelectItem value="member_only">
										Langganan Terdaftar
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<StaffSelector
						positions={positions}
						selectedStaff={selectedStaff}
						setSelectedStaff={setSelectedStaff}
						loading={loading}
						error={error}
						onToggle={toggleStaff}
					/>
				</CardContent>
			</Card>

			{/* Card 2 */}
			<FormSelector
				forms={forms}
				selectedForms={selectedForms}
				toggleForm={toggleForm}
				availableRoles={availableRoles}
				selectedStaff={selectedStaff}
				formAccessConfig={formAccessConfig}
				toggleRoleFill={toggleRoleFill}
				toggleRoleView={toggleRoleView}
				toggleFillablePosition={toggleFillablePosition}
				toggleViewablePosition={toggleViewablePosition}
			/>
		</>
	);
};

export default CreateService;
