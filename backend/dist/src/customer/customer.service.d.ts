import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomerService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCustomerDto: CreateCustomerDto): Promise<{
        id: number;
        name: string;
        mobile: string;
        place: string;
    }>;
    findAll(): Promise<({
        bookings: ({
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
        })[];
    } & {
        id: number;
        name: string;
        mobile: string;
        place: string;
    })[]>;
    findOne(id: number): Promise<{
        bookings: ({
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
        })[];
    } & {
        id: number;
        name: string;
        mobile: string;
        place: string;
    }>;
    findByMobile(mobile: string): Promise<({
        bookings: ({
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
        })[];
    } & {
        id: number;
        name: string;
        mobile: string;
        place: string;
    }) | null>;
    update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<{
        id: number;
        name: string;
        mobile: string;
        place: string;
    }>;
    search(query: string): Promise<({
        bookings: ({
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
        })[];
    } & {
        id: number;
        name: string;
        mobile: string;
        place: string;
    })[]>;
}
