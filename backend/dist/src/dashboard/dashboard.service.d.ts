import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    private getISTDate;
    private getStartOfDayIST;
    private getEndOfDayIST;
    private getStartOfMonthIST;
    private getEndOfMonthIST;
    private getStartOfYearIST;
    private getEndOfYearIST;
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
    getYearlyStats(): Promise<{
        yearlyRevenue: number;
        yearlyCustomers: number;
        yearlyBookings: number;
    }>;
    getIncomeAnalytics(): Promise<{
        dailyIncome: number;
        monthlyIncome: number;
        yearlyIncome: number;
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
        status: import(".prisma/client").$Enums.BookingStatus;
        totalPrice: number;
        customerId: number;
        serviceId: number;
        seatNumber: number;
    })[]>;
    debugBookings(): Promise<{
        serverTime: string;
        istTime: string;
        todayRange: {
            start: string;
            end: string;
        };
        recentCompletedBookings: {
            id: number;
            bookingTime: Date;
            status: import(".prisma/client").$Enums.BookingStatus;
            totalPrice: number;
        }[];
        totalCompletedBookings: number;
    }>;
}
