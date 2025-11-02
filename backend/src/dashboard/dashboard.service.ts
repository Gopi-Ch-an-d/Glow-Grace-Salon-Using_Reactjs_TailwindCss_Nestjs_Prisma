import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  /**
   * Helper function to get date in IST timezone
   * IST = UTC + 5:30
   */
  private getISTDate(date: Date = new Date()): Date {
    // Create a date string in IST timezone
    const istString = date.toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
    });
    return new Date(istString);
  }

  /**
   * Get start of day in IST (00:00:00)
   */
  private getStartOfDayIST(date?: Date): Date {
    const istDate = this.getISTDate(date);
    const startOfDay = new Date(istDate);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  }

  /**
   * Get end of day in IST (23:59:59.999)
   */
  private getEndOfDayIST(date?: Date): Date {
    const startOfDay = this.getStartOfDayIST(date);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);
    endOfDay.setMilliseconds(-1);
    return endOfDay;
  }

  /**
   * Get start of month in IST
   */
  private getStartOfMonthIST(date?: Date): Date {
    const istDate = this.getISTDate(date);
    return new Date(istDate.getFullYear(), istDate.getMonth(), 1, 0, 0, 0, 0);
  }

  /**
   * Get end of month in IST
   */
  private getEndOfMonthIST(date?: Date): Date {
    const istDate = this.getISTDate(date);
    return new Date(istDate.getFullYear(), istDate.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  /**
   * Get start of year in IST
   */
  private getStartOfYearIST(date?: Date): Date {
    const istDate = this.getISTDate(date);
    return new Date(istDate.getFullYear(), 0, 1, 0, 0, 0, 0);
  }

  /**
   * Get end of year in IST
   */
  private getEndOfYearIST(date?: Date): Date {
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

    const [totalRevenue, distinctCustomers, totalBookings, completedBookings] =
      await Promise.all([
        this.prisma.booking.aggregate({
          where: {
            bookingTime: { gte: today, lte: endOfDay },
            status: BookingStatus.COMPLETED,
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
            status: BookingStatus.COMPLETED,
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

    const [monthlyRevenue, distinctCustomers, monthlyBookings] =
      await Promise.all([
        this.prisma.booking.aggregate({
          where: {
            bookingTime: { gte: startOfMonth, lte: endOfMonth },
            status: BookingStatus.COMPLETED,
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

    const [yearlyRevenue, distinctCustomers, yearlyBookings] =
      await Promise.all([
        this.prisma.booking.aggregate({
          where: {
            bookingTime: { gte: startOfYear, lte: endOfYear },
            status: BookingStatus.COMPLETED,
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
          status: BookingStatus.COMPLETED,
        },
        _sum: { totalPrice: true },
      }),
      this.prisma.booking.aggregate({
        where: {
          bookingTime: { gte: startOfMonth, lte: endOfMonth },
          status: BookingStatus.COMPLETED,
        },
        _sum: { totalPrice: true },
      }),
      this.prisma.booking.aggregate({
        where: {
          bookingTime: { gte: startOfYear, lte: endOfYear },
          status: BookingStatus.COMPLETED,
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

  /**
   * Debug method to check bookings and timezone
   */
  async debugBookings() {
    const allBookings = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.COMPLETED,
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
        where: { status: BookingStatus.COMPLETED },
      }),
    };
  }
}