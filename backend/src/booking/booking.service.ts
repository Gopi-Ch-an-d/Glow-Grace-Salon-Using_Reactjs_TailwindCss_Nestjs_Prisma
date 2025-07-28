import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        seatNumber: createBookingDto.seatNumber,
        bookingTime: new Date(createBookingDto.bookingTime),
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.POSTPONED] },
      },
    });

    if (existingBooking) {
      throw new BadRequestException('Seat is already booked at this time');
    }

    const service = await this.prisma.service.findUnique({
      where: { id: createBookingDto.serviceId },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const customer = await this.prisma.customer.upsert({
      where: { mobile: createBookingDto.customer.mobile },
      update: {
        name: createBookingDto.customer.name,
        place: createBookingDto.customer.place,
      },
      create: createBookingDto.customer,
    });

    return this.prisma.booking.create({
      data: {
        customerId: customer.id,
        serviceId: createBookingDto.serviceId,
        seatNumber: createBookingDto.seatNumber,
        bookingTime: new Date(createBookingDto.bookingTime),
        totalPrice: service.price,
        status: BookingStatus.CONFIRMED,
      },
      include: { customer: true, service: true },
    });
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: { customer: true, service: true },
      orderBy: { bookingTime: 'asc' },
    });
  }

  async findTodayBookings() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return this.prisma.booking.findMany({
      where: {
        bookingTime: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: { customer: true, service: true },
      orderBy: { bookingTime: 'asc' },
    });
  }

  async findOne(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { customer: true, service: true },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    await this.findOne(id);

    if (updateBookingDto.bookingTime) {
      const existingBooking = await this.prisma.booking.findFirst({
        where: {
          id: { not: id },
          seatNumber: updateBookingDto.seatNumber,
          bookingTime: new Date(updateBookingDto.bookingTime),
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.POSTPONED] },
        },
      });

      if (existingBooking) {
        throw new BadRequestException('Seat is already booked at this time');
      }
    }

    const data: any = { ...updateBookingDto };
    if (updateBookingDto.bookingTime) {
      data.bookingTime = new Date(updateBookingDto.bookingTime);
    } else {
      delete data.bookingTime;
    }

    return this.prisma.booking.update({
      where: { id },
      data,
      include: { customer: true, service: true },
    });
  }

  async postpone(id: number, newBookingTime: string) {
    return this.update(id, {
      bookingTime: newBookingTime,
      status: BookingStatus.POSTPONED,
    });
  }

  async cancel(id: number) {
    return this.update(id, { status: BookingStatus.CANCELLED });
  }

  async complete(id: number) {
    return this.update(id, { status: BookingStatus.COMPLETED });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.booking.delete({ where: { id } });
  }

  async getAvailableSeats(dateTime: string) {
    const bookingTime = new Date(dateTime);
    const bookedSeats = await this.prisma.booking.findMany({
      where: {
        bookingTime,
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.POSTPONED] },
      },
      select: { seatNumber: true },
    });

    const totalSeats = Array.from({ length: 10 }, (_, i) => i + 1);
    const bookedSeatNumbers = bookedSeats.map(b => b.seatNumber);
    const availableSeats = totalSeats.filter(seat => !bookedSeatNumbers.includes(seat));

    return { availableSeats, bookedSeats: bookedSeatNumbers };
  }
}
