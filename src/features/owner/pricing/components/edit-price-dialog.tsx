import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DollarSign, LoaderCircle } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

type EditPriceDialogProps = {
    open: boolean;
    onClose: () => void;
    service: Service | null;
    onSubmit: (price: number) => Promise<void>;
    submitting: boolean;
};

export const EditPriceDialog = ({ open, onClose, service, onSubmit, submitting }: EditPriceDialogProps) => {
    const [value, setValue] = useState(service?.price ? String(service.price) : "");

    // Reset when item changes or dialog opens
    useEffect(() => {
        setValue(service?.price ? String(service.price) : "");
    }, [service, open]);

    const handleSubmit = async () => {
        const parsed = Number(value);
        if (isNaN(parsed) || parsed < 0) return;
        await onSubmit(parsed);
    };

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
                                    {service?.price ? "Ubah Harga Layanan" : "Tambah Harga Layanan"}
                                </span>
                                <div className="text-white/80 text-[12px] font-medium">
                                    {service?.price
                                        ? `Memperbarui harga untuk layanan ${service?.title}.`
                                        : `Tentukan harga untuk layanan ${service?.title}.`}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 pt-5 pb-2 space-y-4 max-h-[55vh] overflow-y-auto">
                    <div className="relative rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-4">
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
                            disabled={submitting || !value || isNaN(Number(value))}
                            className="flex-1 h-11 rounded-xl shadow-sm hover:shadow-md transition-all font-semibold bg-primary hover:bg-primary/90 m-0 hover:cursor-pointer"
                        >
                            {submitting && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />}
                            {!submitting && <DollarSign className="w-4 h-4 mr-2" />}
                            {submitting ? "Menyimpan..." : service?.price ? "Perbarui Harga" : "Simpan Harga"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
