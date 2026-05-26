import { useState } from "react";
import { usePricing } from "../hooks/use-pricing";
import PageHeader from "@/shared/atoms/header-content";
import { useDialogStore } from "@/store/dialogStore";
import { SectionLoading } from "@/shared/atoms";
import { EmptyData } from "@/shared/molecules/empty-data";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Tag,
    Pencil,
    Trash2,
    TrendingUp,
    Plus,
    Search,
    Package,
    TrendingDown,
} from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

const accessLabel: Record<string, string> = {
    public: "Publik",
    member_only: "Member",
    internal: "Internal",
};
const accessColor: Record<string, string> = {
    public: "bg-emerald-50 text-emerald-700 border-emerald-200",
    member_only: "bg-blue-50 text-blue-700 border-blue-200",
    internal: "bg-violet-50 text-violet-700 border-violet-200",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

type PricingListItemProps = {
    item: pricing;
    onEdit: (item: pricing) => void;
    onDelete: (item: pricing) => void;
};

const PricingListItem = ({ item, onEdit, onDelete }: PricingListItemProps) => {
    const service = item.service;
    if (!service) return null; // Fallback jika data kosong
    const access = service.accessType as string;

    return (
        <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border-b last:border-0 hover:bg-slate-50 transition-colors gap-4">
            <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mt-1 sm:mt-0">
                    <Package className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                            {service.title}
                        </p>
                        <Badge
                            variant="outline"
                            className={`text-[10px] font-semibold px-2 py-0.5 border ${accessColor[access] ?? ""}`}>
                            {accessLabel[access] ?? access}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={`text-[10px] font-semibold px-2 py-0.5 ${service.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                            {service.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        {service.description && (
                            <span className="truncate max-w-xs xl:max-w-md hidden md:inline-block">
                                {service.description}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                <div className="text-left sm:text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">
                        Harga
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                        {service.price === 0 ? "Gratis" : service.price ? formatRupiah(service.price) : "Belum diatur"}
                    </p>
                </div>

                <div className="flex items-center gap-1 ">
                    <button
                        onClick={() => onEdit(item)}
                        className="p-2 rounded-lg hover:bg-primary/8 text-slate-400 hover:text-primary transition-colors hover:cursor-pointer">
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(item)}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors hover:cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Edit / Create Dialog ─────────────────────────────────────────────────────

import { PricingDialog } from "../components/pricing-dialog";

// ─── Main Page ────────────────────────────────────────────────────────────────

const ViewPricePage = () => {
    const { pricingList, loading, submitting, createPricing, updatePricing, deletePricing } =
        usePricing();
    const { showDialog } = useDialogStore();

    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<pricing | null>(null);

    // Stats
    const totalServices = pricingList.length;
    const minPrice =
        totalServices > 0
            ? Math.min(...pricingList.map((p) => p.price))
            : 0;
    const maxPrice = totalServices > 0 ? Math.max(...pricingList.map((p) => p.price)) : 0;

    // Filter
    const filtered = pricingList.filter(
        (p) => {
            if (!p.service) return false;
            return p.service.title.toLowerCase().includes(search.toLowerCase()) ||
                p.service.serviceKey.toLowerCase().includes(search.toLowerCase());
        }
    );

    const handleEdit = (item: pricing) => {
        setSelectedItem(item);
        setDialogOpen(true);
    };

    const handleAdd = () => {
        setSelectedItem(null);
        setDialogOpen(true);
    };

    const handleDialogSubmit = async (data: { serviceId: string; price: number }) => {
        if (selectedItem) {
            await updatePricing(selectedItem._id, { serviceId: selectedItem.service._id, price: data.price });
        } else {
            await createPricing({ serviceId: data.serviceId, price: data.price });
        }
        setDialogOpen(false);
    };

    const handleDelete = (item: pricing) => {
        if (!item.service) return;
        showDialog({
            title: "Hapus Harga Layanan",
            description: `Apakah Anda yakin ingin menghapus harga untuk layanan "${item.service.title}"?`,
            confirmText: "Hapus",
            cancelText: "Batal",
            onConfirm: async () => {
                await deletePricing(item._id);
            },
        });
    };

    return (
        <div className="space-y-6 pb-10">
            {/* ── Header ── */}
            <PageHeader
                title="Kelola Harga Layanan"
                subtitle={`Atur harga untuk setiap layanan yang tersedia · ${totalServices} layanan`}
                onAddClick={handleAdd}
                addLabel="Tambah Harga"
                addIcon={<Plus className="w-4 h-4" />}
                backPath={true}
            />

            {/* ── Stats ── */}
            {!loading && totalServices > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                        {
                            label: "Total Layanan",
                            value: String(totalServices),
                            icon: Tag,
                            color: "text-primary",
                            bg: "bg-primary/8",
                        },
                        {
                            label: "Harga Terendah",
                            value: formatRupiah(minPrice),
                            icon: TrendingDown,
                            color: "text-amber-500",
                            bg: "bg-amber-50",
                        },
                        {
                            label: "Harga Tertinggi",
                            value: formatRupiah(maxPrice),
                            icon: TrendingUp,
                            color: "text-emerald-600",
                            bg: "bg-emerald-50",
                        },
                    ].map(({ label, value, icon: Icon, color, bg }) => (
                        <div
                            key={label}
                            className="flex items-center gap-3 p-4 rounded-2xl border bg-white shadow-sm">
                            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                                <Icon className={`w-4.5 h-4.5 ${color}`} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                                    {label}
                                </p>
                                <p className="text-sm font-bold text-slate-900 truncate mt-0.5">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Content ── */}
            {loading ? (
                <SectionLoading message="Memuat data harga layanan..." />
            ) : (
                <div className="space-y-4">
                    {/* Search */}
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Cari layanan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-10 bg-white"
                        />
                    </div>

                    {/* List */}
                    {filtered.length === 0 ? (
                        <EmptyData />
                    ) : (
                        <div className="flex flex-col border rounded-2xl overflow-hidden shadow-sm bg-white">
                            {filtered.map((item) => (
                                <PricingListItem
                                    key={item._id}
                                    item={item}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Dialog ── */}
            <PricingDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                item={selectedItem}
                onSubmit={handleDialogSubmit}
                submitting={submitting}
            />
        </div>
    );
};

export default ViewPricePage;
