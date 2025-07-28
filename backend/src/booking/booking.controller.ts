import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
    constructor(private readonly bookingService: BookingService) { }

    @Post()
    create(@Body() createBookingDto: CreateBookingDto) {
        return this.bookingService.create(createBookingDto);
    }

    @Get()
    findAll() {
        return this.bookingService.findAll();
    }

    @Get('today')
    findTodayBookings() {
        return this.bookingService.findTodayBookings();
    }

    @Get('available-seats')
    getAvailableSeats(@Query('datetime') dateTime: string) {
        return this.bookingService.getAvailableSeats(dateTime);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookingService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
        return this.bookingService.update(+id, updateBookingDto);
    }

    @Patch(':id/postpone')
    postpone(@Param('id') id: string, @Body('bookingTime') bookingTime: string) {
        return this.bookingService.postpone(+id, bookingTime);
    }

    @Patch(':id/cancel')
    cancel(@Param('id') id: string) {
        return this.bookingService.cancel(+id);
    }

    @Patch(':id/complete')
    complete(@Param('id') id: string) {
        return this.bookingService.complete(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bookingService.remove(+id);
    }
}