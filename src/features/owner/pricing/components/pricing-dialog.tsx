import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    DollarSign,
    Check,
    ChevronsUpDown,
    LoaderCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateService } from "../../services-wo/hooks/useCreateService";

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

export type PricingDialogProps = {
    open: boolean;
    onClose: () => void;
    item: pricing | null;
    onSubmit: (data: { serviceId: string; price: number }) => Promise<void>;
    submitting: boolean;
};

export const PricingDialog = ({ open, onClose, item, onSubmit, submitting }: PricingDialogProps) => {
    const [value, setValue] = useState(item ? String(item.price) : "");
    const [serviceId, setServiceId] = useState("");
    const [openCombobox, setOpenCombobox] = useState(false);

    const { services, fecthServices, loading } = useCreateService();

    // Fetch services when dialog opens
    useEffect(() => {
        if (open) {
            void fecthServices();
        }
    }, [open]);

    // Reset when item changes or dialog opens
    useEffect(() => {
        setValue(item ? String(item.price) : "");
        setServiceId(item?.service ? item.service._id : "");
    }, [item, open]);

    const handleSubmit = async () => {
        const parsed = Number(value);
        if (isNaN(parsed) || parsed < 0) return;
        if (!item && !serviceId) return; // For create, require serviceId

        await onSubmit({ serviceId: item?.service ? item.service._id : serviceId, price: parsed });
    };

    const selectedService = services.find((s) => s._id === serviceId);

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
                {/* Header - Premium Style */}
                <div className="bg-gradient-to-b from-primary to-primary/70 p-4 text-white relative">
                    <div className="relative z-10 flex flex-col gap-1">
                        <div className="flex items-center gap-3 text-white text-md">
                            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm shadow-xl">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="font-bold">
                                    {item ? "Ubah Harga Layanan" : "Tambah Harga Layanan"}
                                </span>
                                <div className="text-white/80 text-[12px] font-medium">
                                    {item
                                        ? `Memperbarui harga untuk layanan ${item.service.title}.`
                                        : "Tentukan harga untuk layanan yang telah dibuat."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 pt-5 pb-2 space-y-4 max-h-[55vh] overflow-y-auto">
                    <div className="relative rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-4">
                        {!item && (
                            <div className="space-y-2 flex flex-col">
                                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Pilih Layanan
                                </Label>
                                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openCombobox}
                                            className="w-full h-11 justify-between rounded-lg border-gray-200 bg-white text-sm font-normal overflow-hidden"
                                            disabled={submitting}
                                        >
                                            <span className="truncate">
                                                {loading
                                                    ? "Memuat layanan..."
                                                    : serviceId
                                                        ? selectedService?.title || serviceId
                                                        : "Pilih layanan..."}
                                            </span>
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Cari layanan..." className="text-sm" />
                                            <CommandList>
                                                <CommandEmpty className="py-3 text-center text-sm text-gray-500">Layanan tidak ditemukan.</CommandEmpty>
                                                <CommandGroup>
                                                    {services.map((service) => (
                                                        <CommandItem
                                                            key={service._id}
                                                            value={service.title}
                                                            onSelect={() => {
                                                                setServiceId(service._id);
                                                                setOpenCombobox(false);
                                                            }}
                                                            className="text-sm"
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-3.5 w-3.5",
                                                                    serviceId === service._id ? "opacity-100 text-blue-600" : "opacity-0"
                                                                )}
                                                            />
                                                            {service.title}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Harga (Rp)
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold select-none">
                                    Rp
                                </span>
                                <Input
                                    type="number"
                                    min={0}
                                    className="pl-9 h-11 rounded-lg border-gray-200 bg-white text-sm"
                                    placeholder="0"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && void handleSubmit()}
                                />
                            </div>
                            {value && !isNaN(Number(value)) && Number(value) >= 0 && (
                                <p className="text-xs text-slate-500 mt-1">
                                    = <span className="font-semibold text-primary">{formatRupiah(Number(value))}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6 pt-4 bg-white border-t border-slate-50 mt-4">
                    <div className="flex flex-row gap-3 w-full">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={submitting}
                            className="flex-1 h-11 rounded-xl border-slate-200 hover:bg-slate-50 transition-all font-semibold m-0 text-slate-600 hover:cursor-pointer"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={() => void handleSubmit()}
                            disabled={submitting || !value || isNaN(Number(value)) || (!item && !serviceId)}
                            className="flex-1 h-11 rounded-xl shadow-sm hover:shadow-md transition-all font-semibold bg-primary hover:bg-primary/90 m-0 hover:cursor-pointer"
                        >
                            {submitting && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />}
                            {!submitting && <DollarSign className="w-4 h-4 mr-2" />}
                            {submitting ? "Menyimpan..." : item ? "Perbarui Harga" : "Simpan Harga"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
