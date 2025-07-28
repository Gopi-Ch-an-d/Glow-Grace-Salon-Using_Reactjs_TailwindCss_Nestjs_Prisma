import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('today-stats')
  getTodayStats() {
    return this.dashboardService.getTodayStats();
  }

  @Get('monthly-stats')
  getMonthlyStats() {
    return this.dashboardService.getMonthlyStats();
  }

  @Get('recent-bookings')
  getRecentBookings(@Query('limit') limit?: string) {
    return this.dashboardService.getRecentBookings(limit ? +limit : 10);
  }
}