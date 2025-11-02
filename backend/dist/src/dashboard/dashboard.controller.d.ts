import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
    getRecentBookings(limit?: string): Promise<({
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
