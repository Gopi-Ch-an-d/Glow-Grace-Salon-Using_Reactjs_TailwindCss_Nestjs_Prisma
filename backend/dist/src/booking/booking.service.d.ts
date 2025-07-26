import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
export declare class BookingService {
    private prisma;
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
        serviceId: number;
        seatNumber: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        customerId: number;
        totalPrice: number;
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
        serviceId: number;
        seatNumber: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        customerId: number;
        totalPrice: number;
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
        serviceId: number;
        seatNumber: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        customerId: number;
        totalPrice: number;
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
        serviceId: number;
        seatNumber: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        customerId: number;
        totalPrice: number;
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
        serviceId: number;
        seatNumber: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        customerId: number;
        totalPrice: number;
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
        serviceId: number;
        seatNumber: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        customerId: number;
        totalPrice: number;
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
        serviceId: number;
        seatNumber: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        customerId: number;
        totalPrice: number;
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
        serviceId: number;
        seatNumber: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        customerId: number;
        totalPrice: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        bookingTime: Date;
        serviceId: number;
        seatNumber: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        customerId: number;
        totalPrice: number;
    }>;
    getAvailableSeats(dateTime: string): Promise<{
        availableSeats: number[];
        bookedSeats: number[];
    }>;
}
