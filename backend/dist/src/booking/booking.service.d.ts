import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
export declare class BookingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    findOne(id: number): Promise<{
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
    update(id: number, updateBookingDto: UpdateBookingDto): Promise<{
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
    postpone(id: number, newBookingTime: string): Promise<{
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
    cancel(id: number): Promise<{
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
    complete(id: number): Promise<{
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
    remove(id: number): Promise<{
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
    getAvailableSeats(dateTime: string): Promise<{
        availableSeats: number[];
        bookedSeats: number[];
    }>;
}
