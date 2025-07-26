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
    async getTodayStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const [totalRevenue, distinctCustomers, totalBookings, completedBookings] = await Promise.all([
            this.prisma.booking.aggregate({
                where: {
                    bookingTime: { gte: today, lt: tomorrow },
                    status: client_1.BookingStatus.COMPLETED,
                },
                _sum: { totalPrice: true },
            }),
            this.prisma.booking.findMany({
                where: {
                    bookingTime: { gte: today, lt: tomorrow },
                },
                distinct: ['customerId'],
                select: { customerId: true },
            }),
            this.prisma.booking.count({
                where: {
                    bookingTime: { gte: today, lt: tomorrow },
                },
            }),
            this.prisma.booking.count({
                where: {
                    bookingTime: { gte: today, lt: tomorrow },
                    status: client_1.BookingStatus.COMPLETED,
                },
            }),
        ]);
        return {
            totalRevenue: totalRevenue._sum.totalPrice || 0,
            totalCustomers: distinctCustomers.length,
            totalBookings,
            completedBookings,
            pendingBookings: totalBookings - completedBookings,
        };
    }
    async getMonthlyStats() {
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);
        const nextMonth = new Date(currentMonth);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const [monthlyRevenue, distinctCustomers, monthlyBookings] = await Promise.all([
            this.prisma.booking.aggregate({
                where: {
                    bookingTime: { gte: currentMonth, lt: nextMonth },
                    status: client_1.BookingStatus.COMPLETED,
                },
                _sum: { totalPrice: true },
            }),
            this.prisma.booking.findMany({
                where: {
                    bookingTime: { gte: currentMonth, lt: nextMonth },
                },
                distinct: ['customerId'],
                select: { customerId: true },
            }),
            this.prisma.booking.count({
                where: {
                    bookingTime: { gte: currentMonth, lt: nextMonth },
                },
            }),
        ]);
        return {
            monthlyRevenue: monthlyRevenue._sum.totalPrice || 0,
            monthlyCustomers: distinctCustomers.length,
            monthlyBookings,
        };
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map