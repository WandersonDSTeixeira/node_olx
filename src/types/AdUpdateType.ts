export type AdUpdateType = {
    title?: string;
    price?: number;
    priceNegotiable?: boolean;
    status?: boolean;
    description?: string;
    category?: string;
    images?: [
        {
            url: string;
            default: boolean;
        }
    ];
};