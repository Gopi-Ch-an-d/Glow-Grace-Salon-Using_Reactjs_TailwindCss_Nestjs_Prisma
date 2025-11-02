import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
export declare class BookingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createBookingDto: CreateBookingDto): Promise<{
        customer: {
            id: number;
            name: string;
            mobile: string;
            place: string;
        };
        service: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            price: number;
            duration: number;
            description: string | null;
            isActive: boolean;
        };
    } & {
        id: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
        bookingTime: Date;
        totalPrice: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        customer: {
            id: number;
            name: string;
            mobile: string;
            place: string;
        };
        service: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            price: number;
            duration: number;
            description: string | null;
            isActive: boolean;
        };
    } & {
        id: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
        bookingTime: Date;
        totalPrice: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findTodayBookings(): Promise<({
        customer: {
            id: number;
            name: string;
            mobile: string;
            place: string;
        };
        service: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            price: number;
            duration: number;
            description: string | null;
            isActive: boolean;
        };
    } & {
        id: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
        bookingTime: Date;
        totalPrice: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: number): Promise<{
        customer: {
            id: number;
            name: string;
            mobile: string;
            place: string;
        };
        service: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            price: number;
            duration: number;
            description: string | null;
            isActive: boolean;
        };
    } & {
        id: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
        bookingTime: Date;
        totalPrice: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, updateBookingDto: UpdateBookingDto): Promise<{
        customer: {
            id: number;
            name: string;
            mobile: string;
            place: string;
        };
        service: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            price: number;
            duration: number;
            description: string | null;
            isActive: boolean;
        };
    } & {
        id: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
        bookingTime: Date;
        totalPrice: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    postpone(id: number, newBookingTime: string): Promise<{
        customer: {
            id: number;
            name: string;
            mobile: string;
            place: string;
        };
        service: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            price: number;
            duration: number;
            description: string | null;
            isActive: boolean;
        };
    } & {
        id: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
        bookingTime: Date;
        totalPrice: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    cancel(id: number): Promise<{
        customer: {
            id: number;
            name: string;
            mobile: string;
            place: string;
        };
        service: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            price: number;
            duration: number;
            description: string | null;
            isActive: boolean;
        };
    } & {
        id: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
        bookingTime: Date;
        totalPrice: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    complete(id: number): Promise<{
        customer: {
            id: number;
            name: string;
            mobile: string;
            place: string;
        };
        service: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            price: number;
            duration: number;
            description: string | null;
            isActive: boolean;
        };
    } & {
        id: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
        bookingTime: Date;
        totalPrice: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
        bookingTime: Date;
        totalPrice: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAvailableSeats(dateTime: string): Promise<{
        availableSeats: number[];
        bookedSeats: number[];
    }>;
}
