import apiClient from "@/lib/api";

// ==========================================================
// MOCK MODE — ubah ke false untuk pakai API asli
// ==========================================================
const USE_MOCK = false;
const MOCK_DELAY_MS = 600;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const mockData: pricing[] = [
    {
        _id: "price-001",
        service: {
            _id: "svc-001",
            serviceKey: "INSTALL-AC",
            companyId: "cmp-001",
            title: "Instalasi AC",
            description: "Layanan pemasangan unit AC baru di lokasi klien.",
            price: null,
            accessType: "public",
            isActive: true,
            draftingWorkOrderType: "auto",
            serviceRequestConfig: {
                intakeForm: {} as Form,
                reviewForm: {} as Form,
                serviceRequestApprovalAccessType: "auto",
                reviewNeed: false,
            },
            workOrdersConfig: [],
            createdAt: "2025-01-10T08:00:00.000Z",
            updatedAt: "2025-03-15T10:30:00.000Z",
        },
        price: 450000,
    },
    {
        _id: "price-002",
        service: {
            _id: "svc-002",
            serviceKey: "SERV-AC",
            companyId: "cmp-001",
            title: "Servis & Cuci AC",
            description: "Layanan servis dan pembersihan AC secara menyeluruh.",
            price: null,
            accessType: "public",
            isActive: true,
            draftingWorkOrderType: "manual",
            serviceRequestConfig: {
                intakeForm: {} as Form,
                reviewForm: {} as Form,
                serviceRequestApprovalAccessType: "manager",
                reviewNeed: true,
            },
            workOrdersConfig: [],
            createdAt: "2025-01-15T09:00:00.000Z",
            updatedAt: "2025-04-01T14:00:00.000Z",
        },
        price: 175000,
    },
    {
        _id: "price-003",
        service: {
            _id: "svc-003",
            serviceKey: "REP-ELEC",
            companyId: "cmp-001",
            title: "Perbaikan Instalasi Listrik",
            description: "Pengecekan dan perbaikan kerusakan instalasi listrik.",
            price: null,
            accessType: "member_only",
            isActive: true,
            draftingWorkOrderType: "manual",
            serviceRequestConfig: {
                intakeForm: {} as Form,
                reviewForm: {} as Form,
                serviceRequestApprovalAccessType: "auto",
                reviewNeed: false,
            },
            workOrdersConfig: [],
            createdAt: "2025-02-01T08:30:00.000Z",
            updatedAt: "2025-04-10T11:20:00.000Z",
        },
        price: 300000,
    },
    {
        _id: "price-004",
        service: {
            _id: "svc-004",
            serviceKey: "CLEAN-GEN",
            companyId: "cmp-001",
            title: "General Cleaning",
            description: "Layanan kebersihan menyeluruh untuk area kantor dan komersial.",
            price: null,
            accessType: "public",
            isActive: false,
            draftingWorkOrderType: "auto",
            serviceRequestConfig: {
                intakeForm: {} as Form,
                reviewForm: {} as Form,
                serviceRequestApprovalAccessType: "auto",
                reviewNeed: false,
            },
            workOrdersConfig: [],
            createdAt: "2025-02-20T07:00:00.000Z",
            updatedAt: "2025-05-01T09:00:00.000Z",
        },
        price: 550000,
    },
    {
        _id: "price-005",
        service: {
            _id: "svc-005",
            serviceKey: "PEST-CTRL",
            companyId: "cmp-001",
            title: "Pest Control",
            description: "Pembasmi hama dan serangga berbahaya untuk area hunian & komersial.",
            price: null,
            accessType: "internal",
            isActive: true,
            draftingWorkOrderType: "manual",
            serviceRequestConfig: {
                intakeForm: {} as Form,
                reviewForm: {} as Form,
                serviceRequestApprovalAccessType: "manager",
                reviewNeed: true,
            },
            workOrdersConfig: [],
            createdAt: "2025-03-05T10:00:00.000Z",
            updatedAt: "2025-05-10T16:00:00.000Z",
        },
        price: 800000,
    },
];

let mockIdCounter = mockData.length + 1;

// ==========================================================
// API Functions
// ==========================================================

export const getAllServicePricingApi = async () => {
    if (USE_MOCK) {
        await delay(MOCK_DELAY_MS);
        return { data: [...mockData] } as getAllServicePricingResponse;
    }
    const response = await apiClient.get<getAllServicePricingResponse>("/service-price");
    return response.data;
};

export const createServicePricingApi = async (data: createServicePricingRequest) => {
    if (USE_MOCK) {
        await delay(MOCK_DELAY_MS);
        const newPricing: pricing = {
            _id: `price-${String(mockIdCounter++).padStart(3, "0")}`,
            service: {
                _id: data.serviceId,
                serviceKey: data.serviceId,
                companyId: "cmp-001",
                title: `Layanan ${data.serviceId}`,
                description: "Layanan baru (mock)",
                price: null,
                accessType: "public",
                isActive: true,
                draftingWorkOrderType: "auto",
                serviceRequestConfig: {
                    intakeForm: {} as Form,
                    reviewForm: {} as Form,
                    serviceRequestApprovalAccessType: "auto",
                    reviewNeed: false,
                },
                workOrdersConfig: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            price: data.price,
        };
        mockData.push(newPricing);
        return { message: "Harga berhasil dibuat", data: newPricing } as createServicePricingResponse;
    }
    const response = await apiClient.post<createServicePricingResponse>("/service-price", data);
    return response.data;
};

export const updateServicePricingApi = async (
    id: string,
    data: updateServicePricingRequest,
) => {
    if (USE_MOCK) {
        await delay(MOCK_DELAY_MS);
        const idx = mockData.findIndex((p) => p._id === id);
        if (idx !== -1) mockData[idx] = { ...mockData[idx], price: data.price };
        return { message: "Harga berhasil diupdate", data: mockData[idx] } as updateServicePricingResponse;
    }
    const response = await apiClient.put<updateServicePricingResponse>(
        `/service-price/${id}`,
        data,
    );
    return response.data;
};

export const deleteServicePricingApi = async (id: string) => {
    if (USE_MOCK) {
        await delay(MOCK_DELAY_MS);
        const idx = mockData.findIndex((p) => p._id === id);
        const [removed] = idx !== -1 ? mockData.splice(idx, 1) : [undefined];
        return { message: "Harga berhasil dihapus", data: removed } as deleteServicePricingResponse;
    }
    const response = await apiClient.delete<deleteServicePricingResponse>(`/service-price/${id}`);
    return response.data;
};