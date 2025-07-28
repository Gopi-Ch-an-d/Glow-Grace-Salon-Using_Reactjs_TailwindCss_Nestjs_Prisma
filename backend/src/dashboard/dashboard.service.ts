import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}


  async getTodayStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalRevenue, distinctCustomers, totalBookings, completedBookings] = await Promise.all([
      this.prisma.booking.aggregate({
        where: {
          bookingTime: { gte: today, lt: tomorrow },
          status: BookingStatus.COMPLETED,
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
          status: BookingStatus.COMPLETED,
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
          status: BookingStatus.COMPLETED,
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
}
