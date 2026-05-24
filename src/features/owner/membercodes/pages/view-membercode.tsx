import { useState } from "react";
import PageHeader from "@/shared/atoms/header-content";
import { Plus } from "lucide-react";
import { UploadMembercodeDialog } from "../components/upload-membercode-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MembercodeListTab } from "../components/membercode-list-tab";
import { ClaimedMembershipTab } from "../components/claimed-membership-tab";
import { useMembercodeStore } from "@/store/membercodeStore";

const ViewMemberCodes = () => {
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
	const { clearCache } = useMembercodeStore();

	const handleUploadSuccess = () => {
		clearCache();
		// We could trigger a re-fetch here if needed, or let the tabs handle their own fetching.
	};

	return (
		<div className="h-full flex flex-col">
			{/* ── Header ── */}
			<PageHeader
				title="Kode Berlangganan"
				subtitle="Kelola kode berlangganan untuk pelanggan dari sistem eksternal"
				addLabel="Unggah Data Baru"
				backPath={true}
				addIcon={<Plus className="size-4" />}
				onAddClick={() => setUploadDialogOpen(true)}
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
							Daftar Voucer
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
