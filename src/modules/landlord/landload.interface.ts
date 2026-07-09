export interface IPropertyPayload {
    title: string;
    description: string;
    address: string;
    city: string;
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    areaSqft?: number;
    amenities?: string[];
    images?: string[];
    categoryId: string;
    isAvailable?: boolean;
}

export interface IRentalRequestPayload {
    status: "APPROVED" | "REJECTED";
    
}