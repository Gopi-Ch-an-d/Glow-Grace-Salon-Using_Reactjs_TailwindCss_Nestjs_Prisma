"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getISTDate(date = new Date()) {
        const istString = date.toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
        });
        return new Date(istString);
    }
    getStartOfDayIST(date) {
        const istDate = this.getISTDate(date);
        const startOfDay = new Date(istDate);
        startOfDay.setHours(0, 0, 0, 0);
        return startOfDay;
    }
    getEndOfDayIST(date) {
        const startOfDay = this.getStartOfDayIST(date);
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);
        endOfDay.setMilliseconds(-1);
        return endOfDay;
    }
    getStartOfMonthIST(date) {
        const istDate = this.getISTDate(date);
        return new Date(istDate.getFullYear(), istDate.getMonth(), 1, 0, 0, 0, 0);
    }
    getEndOfMonthIST(date) {
        const istDate = this.getISTDate(date);
        return new Date(istDate.getFullYear(), istDate.getMonth() + 1, 0, 23, 59, 59, 999);
    }
    getStartOfYearIST(date) {
        const istDate = this.getISTDate(date);
        return new Date(istDate.getFullYear(), 0, 1, 0, 0, 0, 0);
    }
    getEndOfYearIST(date) {
        const istDate = this.getISTDate(date);
        return new Date(istDate.getFullYear(), 11, 31, 23, 59, 59, 999);
    }
    async getTodayStats() {
        const today = this.getStartOfDayIST();
        const endOfDay = this.getEndOfDayIST();
        console.log('Today Stats Range (IST):', {
            today: today.toISOString(),
            endOfDay: endOfDay.toISOString(),
            istTime: this.getISTDate().toISOString(),
        });
        const [totalRevenue, distinctCustomers, totalBookings, completedBookings] = await Promise.all([
            this.prisma.booking.aggregate({
                where: {
                    bookingTime: { gte: today, lte: endOfDay },
                    status: client_1.BookingStatus.COMPLETED,
                },
                _sum: { totalPrice: true },
            }),
            this.prisma.booking.findMany({
                where: {
                    bookingTime: { gte: today, lte: endOfDay },
                },
                distinct: ['customerId'],
                select: { customerId: true },
            }),
            this.prisma.booking.count({
                where: {
                    bookingTime: { gte: today, lte: endOfDay },
                },
            }),
            this.prisma.booking.count({
                where: {
                    bookingTime: { gte: today, lte: endOfDay },
                    status: client_1.BookingStatus.COMPLETED,
                },
            }),
        ]);
        const result = {
            totalRevenue: totalRevenue._sum.totalPrice || 0,
            totalCustomers: distinctCustomers.length,
            totalBookings,
            completedBookings,
            pendingBookings: totalBookings - completedBookings,
        };
        console.log('Today Stats Result:', result);
        return result;
    }
    async getMonthlyStats() {
        const startOfMonth = this.getStartOfMonthIST();
        const endOfMonth = this.getEndOfMonthIST();
        console.log('Monthly Stats Range (IST):', {
            startOfMonth: startOfMonth.toISOString(),
            endOfMonth: endOfMonth.toISOString(),
        });
        const [monthlyRevenue, distinctCustomers, monthlyBookings] = await Promise.all([
            this.prisma.booking.aggregate({
                where: {
                    bookingTime: { gte: startOfMonth, lte: endOfMonth },
                    status: client_1.BookingStatus.COMPLETED,
                },
                _sum: { totalPrice: true },
            }),
            this.prisma.booking.findMany({
                where: {
                    bookingTime: { gte: startOfMonth, lte: endOfMonth },
                },
                distinct: ['customerId'],
                select: { customerId: true },
            }),
            this.prisma.booking.count({
                where: {
                    bookingTime: { gte: startOfMonth, lte: endOfMonth },
                },
            }),
        ]);
        const result = {
            monthlyRevenue: monthlyRevenue._sum.totalPrice || 0,
            monthlyCustomers: distinctCustomers.length,
            monthlyBookings,
        };
        console.log('Monthly Stats Result:', result);
        return result;
    }
    async getYearlyStats() {
        const startOfYear = this.getStartOfYearIST();
        const endOfYear = this.getEndOfYearIST();
        console.log('Yearly Stats Range (IST):', {
            startOfYear: startOfYear.toISOString(),
            endOfYear: endOfYear.toISOString(),
        });
        const [yearlyRevenue, distinctCustomers, yearlyBookings] = await Promise.all([
            this.prisma.booking.aggregate({
                where: {
                    bookingTime: { gte: startOfYear, lte: endOfYear },
                    status: client_1.BookingStatus.COMPLETED,
                },
                _sum: { totalPrice: true },
            }),
            this.prisma.booking.findMany({
                where: {
                    bookingTime: { gte: startOfYear, lte: endOfYear },
                },
                distinct: ['customerId'],
                select: { customerId: true },
            }),
            this.prisma.booking.count({
                where: {
                    bookingTime: { gte: startOfYear, lte: endOfYear },
                },
            }),
        ]);
        const result = {
            yearlyRevenue: yearlyRevenue._sum.totalPrice || 0,
            yearlyCustomers: distinctCustomers.length,
            yearlyBookings,
        };
        console.log('Yearly Stats Result:', result);
        return result;
    }
    async getIncomeAnalytics() {
        const today = this.getStartOfDayIST();
        const endOfDay = this.getEndOfDayIST();
        const startOfMonth = this.getStartOfMonthIST();
        const endOfMonth = this.getEndOfMonthIST();
        const startOfYear = this.getStartOfYearIST();
        const endOfYear = this.getEndOfYearIST();
        console.log('Income Analytics Ranges (IST):', {
            daily: { today: today.toISOString(), endOfDay: endOfDay.toISOString() },
            monthly: {
                startOfMonth: startOfMonth.toISOString(),
                endOfMonth: endOfMonth.toISOString(),
            },
            yearly: {
                startOfYear: startOfYear.toISOString(),
                endOfYear: endOfYear.toISOString(),
            },
        });
        const [dailyIncome, monthlyIncome, yearlyIncome] = await Promise.all([
            this.prisma.booking.aggregate({
                where: {
                    bookingTime: { gte: today, lte: endOfDay },
                    status: client_1.BookingStatus.COMPLETED,
                },
                _sum: { totalPrice: true },
            }),
            this.prisma.booking.aggregate({
                where: {
                    bookingTime: { gte: startOfMonth, lte: endOfMonth },
                    status: client_1.BookingStatus.COMPLETED,
                },
                _sum: { totalPrice: true },
            }),
            this.prisma.booking.aggregate({
                where: {
                    bookingTime: { gte: startOfYear, lte: endOfYear },
                    status: client_1.BookingStatus.COMPLETED,
                },
                _sum: { totalPrice: true },
            }),
        ]);
        const result = {
            dailyIncome: dailyIncome._sum.totalPrice || 0,
            monthlyIncome: monthlyIncome._sum.totalPrice || 0,
            yearlyIncome: yearlyIncome._sum.totalPrice || 0,
        };
        console.log('Income Analytics Result:', result);
        return result;
    }
    async getRecentBookings(limit = 10) {
        return this.prisma.booking.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                customer: true,
                service: true,
            },
        });
    }
    async debugBookings() {
        const allBookings = await this.prisma.booking.findMany({
            where: {
                status: client_1.BookingStatus.COMPLETED,
            },
            select: {
                id: true,
                bookingTime: true,
                totalPrice: true,
                status: true,
            },
            orderBy: {
                bookingTime: 'desc',
            },
            take: 10,
        });
        const istNow = this.getISTDate();
        const today = this.getStartOfDayIST();
        const endOfDay = this.getEndOfDayIST();
        return {
            serverTime: new Date().toISOString(),
            istTime: istNow.toISOString(),
            todayRange: {
                start: today.toISOString(),
                end: endOfDay.toISOString(),
            },
            recentCompletedBookings: allBookings,
            totalCompletedBookings: await this.prisma.booking.count({
                where: { status: client_1.BookingStatus.COMPLETED },
            }),
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map