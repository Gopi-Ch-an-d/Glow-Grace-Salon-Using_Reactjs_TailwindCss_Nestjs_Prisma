declare class CustomerDto {
    name: string;
    mobile: string;
    place: string;
}
export declare class CreateBookingDto {
    customer: CustomerDto;
    serviceId: number;
    seatNumber: number;
    bookingTime: string;
}
export {};
