import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('today-stats')
  async getTodayStats() {
    return this.dashboardService.getTodayStats();
  }

  @Get('monthly-stats')
  async getMonthlyStats() {
    return this.dashboardService.getMonthlyStats();
  }

  @Get('yearly-stats')
  async getYearlyStats() {
    return this.dashboardService.getYearlyStats();
  }

  @Get('income-analytics')
  async getIncomeAnalytics() {
    return this.dashboardService.getIncomeAnalytics();
  }

  @Get('recent-bookings')
  async getRecentBookings(@Query('limit') limit?: string) {
    return this.dashboardService.getRecentBookings(limit ? +limit : 10);
  }

  /**
   * Debug endpoint to check timezone and bookings
   * Remove this in production or add admin-only guard
   */
  @Get('debug')
  async debugBookings() {
    return this.dashboardService.debugBookings();
  }
}