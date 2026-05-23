// get all
type getAllServicePricingResponse = ApiResponse<pricing[]>;

// create price config
type createServicePricingRequest = {
    serviceId: string;
    price: number;
}
type createServicePricingResponse = ApiResponse<pricing>;

// update price config
type updateServicePricingRequest = {
    serviceId: string;
    price: number;
}
type updateServicePricingResponse = ApiResponse<pricing>;

// delete
type deleteServicePricingResponse = ApiResponse<pricing>;