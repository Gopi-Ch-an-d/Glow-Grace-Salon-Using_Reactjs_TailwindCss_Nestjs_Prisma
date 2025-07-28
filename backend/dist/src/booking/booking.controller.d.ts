import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    create(createBookingDto: CreateBookingDto): Promise<{
        service: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            duration: number;
            description: string | null;
            isActive: boolean;
        };
        customer: {
            id: number;
            name: string;
            mobile: string;
            place: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        bookingTime: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        totalPrice: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
    }>;
    findAll(): Promise<({
        service: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            duration: number;
            description: string | null;
            isActive: boolean;
        };
        customer: {
            id: number;
            name: string;
            mobile: string;
            place: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        bookingTime: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        totalPrice: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
    })[]>;
    findTodayBookings(): Promise<({
        service: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            duration: number;
            description: string | null;
            isActive: boolean;
        };
        customer: {
            id: number;
            name: string;
            mobile: string;
            place: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        bookingTime: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        totalPrice: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
    })[]>;
    getAvailableSeats(dateTime: string): Promise<{
        availableSeats: number[];
        bookedSeats: number[];
    }>;
    findOne(id: string): Promise<{
        service: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            duration: number;
            description: string | null;
            isActive: boolean;
        };
        customer: {
            id: number;
            name: string;
            mobile: string;
            place: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        bookingTime: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        totalPrice: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
    }>;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<{
        service: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            duration: number;
            description: string | null;
            isActive: boolean;
        };
        customer: {
            id: number;
            name: string;
            mobile: string;
            place: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        bookingTime: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        totalPrice: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
    }>;
    postpone(id: string, bookingTime: string): Promise<{
        service: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            duration: number;
            description: string | null;
            isActive: boolean;
        };
        customer: {
            id: number;
            name: string;
            mobile: string;
            place: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        bookingTime: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        totalPrice: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
    }>;
    cancel(id: string): Promise<{
        service: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            duration: number;
            description: string | null;
            isActive: boolean;
        };
        customer: {
            id: number;
            name: string;
            mobile: string;
            place: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        bookingTime: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        totalPrice: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
    }>;
    complete(id: string): Promise<{
        service: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            duration: number;
            description: string | null;
            isActive: boolean;
        };
        customer: {
            id: number;
            name: string;
            mobile: string;
            place: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        bookingTime: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        totalPrice: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
    }>;
    remove(id: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        bookingTime: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        totalPrice: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
    }>;
}
