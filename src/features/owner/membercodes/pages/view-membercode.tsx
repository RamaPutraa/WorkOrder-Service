import { useState } from "react";
import PageHeader from "@/shared/atoms/header-content";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadMembercodeDialog } from "../components/upload-membercode-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MembercodeListTab } from "../components/membercode-list-tab";
import { ClaimedMembershipTab } from "../components/claimed-membership-tab";
import { useMembercodeStore } from "@/store/membercodeStore";
import { useIntegrationConfig } from "@/features/owner/pairing-company/hooks/useIntegrationConfig";
import { Switch } from "@/components/ui/switch";
import { useDialogStore } from "@/store/dialogStore";

const ViewMemberCodes = () => {
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
	const { clearCache } = useMembercodeStore();
	const { showDialog } = useDialogStore();

	const {
		config,
		loading: configLoading,
		submitting: configSubmitting,
		handleUpdate: updateIntegration,
	} = useIntegrationConfig();

	const isClaimTokenActive =
		config?.integration_type === "claim_token" && config?.is_integration_active;

	const handleToggleMembercode = async (checked: boolean) => {
		await updateIntegration({
			...(config ?? {
				external_login_url: "",
				external_verify_url: "",
				external_check_memberships_url: "",
				secret_key: "",
				integration_type: "claim_token",
				is_integration_active: false,
			}),
			is_integration_active: checked,
			integration_type: "claim_token",
		});
	};

	const handleUploadSuccess = () => {
		clearCache();
	};

	return (
		<div className="h-full flex flex-col">
			{/* ── Header ── */}
			<PageHeader
				title="Kode Berlangganan"
				subtitle="Kelola kode berlangganan untuk pelanggan dari sistem eksternal"
				backPath={true}
				actionButtons={
					<div className="flex items-center gap-3 w-full md:w-auto">
						{/* Toggle aktivasi kode berlangganan */}
						<div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-card">
							{configLoading ? (
								<Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
							) : (
								<>
									<span className={`text-xs font-semibold ${isClaimTokenActive ? "text-emerald-600" : "text-muted-foreground"}`}>
										{isClaimTokenActive ? "Aktif" : "Nonaktif"}
									</span>
									<Switch
										checked={!!isClaimTokenActive}
										disabled={configSubmitting}
										onCheckedChange={(checked) => {
											const isServerActive = config?.is_integration_active ?? false;
											const serverType = config?.integration_type;
											const isSwitchingFromExternal =
												checked && isServerActive && serverType === "external_system";

											const description = !checked
												? "Fitur kode berlangganan akan dinonaktifkan."
												: isSwitchingFromExternal
													? "Perhatian: Saat ini perusahaan Anda menggunakan Integrasi Sistem Eksternal. Jika Anda mengubah ke Kode Berlangganan, seluruh data pelanggan membership yang sudah tercatat melalui sistem eksternal akan dihapus. Apakah Anda yakin ingin melanjutkan?"
													: "Fitur kode berlangganan akan diaktifkan.";

											showDialog({
												title: !checked ? "Nonaktifkan Kode Berlangganan?" : "Aktifkan Kode Berlangganan?",
												description,
												confirmText: !checked ? "Ya, Nonaktifkan" : "Ya, Aktifkan",
												cancelText: "Batal",
												onConfirm: async () => {
													await handleToggleMembercode(checked);
												},
											});
										}}
										className="data-[state=checked]:bg-emerald-600"
									/>
								</>
							)}
						</div>

						{/* Tombol unggah */}
						<Button
							onClick={() => setUploadDialogOpen(true)}
							className="flex-1 md:flex-none h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm shadow-sm hover:cursor-pointer transition-all active:scale-95 flex items-center gap-2">
							<Plus className="size-4" />
							<span>Unggah Data Baru</span>
						</Button>
					</div>
				}
			/>

			<UploadMembercodeDialog
				open={uploadDialogOpen}
				onOpenChange={setUploadDialogOpen}
				onSuccess={handleUploadSuccess}
			/>

			<div className="pb-8 flex-1">
				<Tabs defaultValue="membercodes" className="w-full">
					<TabsList className="grid w-full sm:w-[500px] grid-cols-2 mb-6">
						<TabsTrigger value="membercodes">
							Daftar Kode Unik
						</TabsTrigger>
						<TabsTrigger value="claimed">
							Pelanggan Aktif (Terklaim)
						</TabsTrigger>
					</TabsList>

					<TabsContent value="membercodes" className="mt-0 outline-none">
						<MembercodeListTab />
					</TabsContent>

					<TabsContent value="claimed" className="mt-0 outline-none">
						<ClaimedMembershipTab />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default ViewMemberCodes;
