import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Building2,
    Users,
    Calendar,
    Mail,
    ShieldCheck,
    Trash2,
    Pencil,
} from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import PageHeader from "@/shared/atoms/header-content";
import { LoadingState } from "@/shared/atoms/loading-state";
import ErrorPage from "@/shared/errors/templates/error-page";
import useDetailPosition from "../hooks/useDetailPosition";
import usePosition from "../hooks/usePosition";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { useDialogStore } from "@/store/dialogStore";
import EditPositionDialog from "../components/edit-position-dialog";

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const roleLabel: Record<string, string> = {
    staff_company: "Staff",
    manager_company: "Manager",
    owner_company: "Owner",
};

const roleColor: Record<string, string> = {
    staff_company: "bg-blue-50 text-blue-700 border-blue-200",
    manager_company: "bg-violet-50 text-violet-700 border-violet-200",
    owner_company: "bg-amber-50 text-amber-700 border-amber-200",
};

// ── Columns ───────────────────────────────────────────────────────────────────

const employeeColumns: ColumnDef<EmployeePosition>[] = [
    {
        id: "no",
        header: "No",
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return (
                <p className="text-sm text-center text-muted-foreground">
                    {pageIndex * pageSize + row.index + 1}
                </p>
            );
        },
    },
    {
        id: "name",
        header: "Nama Karyawan",
        cell: ({ row }) => {
            const emp = row.original;
            return (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-primary">
                            {emp.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <span className="text-sm font-medium text-slate-800">{emp.name}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">{row.original.email}</span>
            </div>
        ),
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
            <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${roleColor[row.original.role] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
                <ShieldCheck className="w-3 h-3" />
                {roleLabel[row.original.role] ?? row.original.role}
            </div>
        ),
    },
];

// ── Component ─────────────────────────────────────────────────────────────────

const DetailDepartementPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { position, canDelete, loading, error, fetchDetailPosition } =
        useDetailPosition();
    const { removePosition } = usePosition();
    const { showDialog } = useDialogStore();

    // ── Edit dialog state ────────────────────────────────────────────────────
    const [editOpen, setEditOpen] = useState(false);

    useEffect(() => {
        if (id) void fetchDetailPosition(id);
    }, [id]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const columns = useMemo(() => employeeColumns, []);

    const handleDelete = () => {
        if (!position || !id) return;
        showDialog({
            title: "Hapus Departemen",
            description: `Apakah Anda yakin ingin menghapus departemen "${position.name}"? Tindakan ini tidak dapat dibatalkan.`,
            confirmText: "Hapus",
            cancelText: "Batal",
            onConfirm: async () => {
                const success = await removePosition(id);
                if (success) {
                    navigate(-1);
                }
            },
        });
    };

    // Konversi DetailPositision ke tipe Position untuk EditPositionDialog
    const positionForEdit: Position | null = position
        ? {
            _id: position._id,
            name: position.name,
            description: position.description,
            isActive: position.isActive,
            companyId: position.companyId,
            deletedAt: position.deletedAt,
            createdAt: position.createdAt,
            updatedAt: position.updatedAt ?? "",
            __v: position.__v,
        }
        : null;

    if (error) return <ErrorPage />;

    return (
        <div className="space-y-6 pb-8">
            {/* ── Header ── */}
            <PageHeader
                title={
                    loading ? "Memuat detail..." : (position?.name ?? "Detail Departemen")
                }
                subtitle={
                    loading ? undefined : (position?.description ?? "Informasi departemen")
                }
                backPath={true}
                actionButtons={
                    !loading && position ? (
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            {/* Tombol Edit */}
                            <Button
                                onClick={() => setEditOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white hover:cursor-pointer flex items-center gap-2 rounded-xl h-10 px-4 text-sm font-semibold shadow-sm md:w-auto w-full active:scale-95 transition-all">
                                <Pencil className="w-4 h-4" />
                                Edit
                            </Button>

                            {/* Tombol Hapus — hanya muncul bila canDelete = true */}
                            {canDelete && (
                                <Button
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white hover:cursor-pointer flex items-center gap-2 rounded-xl h-10 px-4 text-sm font-semibold shadow-sm md:w-auto w-full active:scale-95 transition-all">
                                    <Trash2 className="w-4 h-4" />
                                    Hapus
                                </Button>
                            )}
                        </div>
                    ) : undefined
                }
            />

            {loading ? (
                <LoadingState
                    variant="inline"
                    size="lg"
                    message="Memuat detail departemen..."
                />
            ) : position ? (
                <>
                    {/* ── Info Cards ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        {/* Total Karyawan */}
                        <div className="flex items-center gap-3 p-4 rounded-2xl border bg-white shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                                <Users className="w-4.5 h-4.5 text-primary" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                                    Total Karyawan
                                </p>
                                <p className="text-sm font-bold text-slate-900 mt-0.5">
                                    {position.employee.length} orang
                                </p>
                            </div>
                        </div>

                        {/* Dibuat */}
                        <div className="flex items-center gap-3 p-4 rounded-2xl border bg-white shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                                <Calendar className="w-4.5 h-4.5 text-sky-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                                    Dibuat
                                </p>
                                <p className="text-sm font-bold text-slate-900 mt-0.5">
                                    {formatDate(position.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* Diperbarui */}
                        <div className="flex items-center gap-3 p-4 rounded-2xl border bg-white shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                <Building2 className="w-4.5 h-4.5 text-orange-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                                    Diperbarui
                                </p>
                                <p className="text-sm font-bold text-slate-900 mt-0.5">
                                    {formatDate(position.updatedAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Employee Table ── */}
                    <div className="bg-muted/20 rounded-xl shadow-sm border overflow-hidden">
                        {/* table header */}
                        <div className="px-5 py-5 border-b bg-muted/20">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                        <Users className="w-4.5 h-4.5 text-muted-foreground" />
                                        Daftar Karyawan
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Karyawan yang terdaftar di departemen ini
                                    </p>
                                </div>
                                <Badge variant="secondary" className="text-xs px-3 py-1">
                                    {position.employee.length} karyawan
                                </Badge>
                            </div>
                        </div>
                        <div className="p-0 sm:p-2">
                            <DataTable
                                columns={columns}
                                data={position.employee}
                                searchKey="name"
                                loadingMessage="Memuat data karyawan..."
                            />
                        </div>
                    </div>

                    {/* ── Edit Dialog ── */}
                    {positionForEdit && (
                        <EditPositionDialog
                            open={editOpen}
                            onOpenChange={setEditOpen}
                            position={positionForEdit}
                            onSuccess={() => {
                                if (id) void fetchDetailPosition(id);
                            }}
                        />
                    )}
                </>
            ) : null}
        </div>
    );
};

export default DetailDepartementPage;