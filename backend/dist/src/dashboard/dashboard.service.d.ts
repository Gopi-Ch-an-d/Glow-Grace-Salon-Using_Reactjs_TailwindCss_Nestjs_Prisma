import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getTodayStats(): Promise<{
        totalRevenue: number;
        totalCustomers: number;
        totalBookings: number;
        completedBookings: number;
        pendingBookings: number;
    }>;
    getMonthlyStats(): Promise<{
        monthlyRevenue: number;
        monthlyCustomers: number;
        monthlyBookings: number;
    }>;
    getRecentBookings(limit?: number): Promise<({
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
}
