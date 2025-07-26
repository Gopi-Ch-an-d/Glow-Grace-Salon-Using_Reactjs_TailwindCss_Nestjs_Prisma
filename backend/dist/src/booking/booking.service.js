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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let BookingService = class BookingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createBookingDto) {
        const existingBooking = await this.prisma.booking.findFirst({
            where: {
                seatNumber: createBookingDto.seatNumber,
                bookingTime: new Date(createBookingDto.bookingTime),
                status: { in: [client_1.BookingStatus.CONFIRMED, client_1.BookingStatus.POSTPONED] },
            },
        });
        if (existingBooking) {
            throw new common_1.BadRequestException('Seat is already booked at this time');
        }
        const service = await this.prisma.service.findUnique({
            where: { id: createBookingDto.serviceId },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
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
                status: client_1.BookingStatus.CONFIRMED,
            },
            include: {
                customer: true,
                service: true,
            },
        });
    }
    async findAll() {
        return this.prisma.booking.findMany({
            include: {
                customer: true,
                service: true,
            },
            orderBy: { bookingTime: 'asc' },
        });
    }
    async findTodayBookings() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return this.prisma.booking.findMany({
            where: {
                bookingTime: {
                    gte: today,
                    lt: tomorrow,
                },
            },
            include: {
                customer: true,
                service: true,
            },
            orderBy: { bookingTime: 'asc' },
        });
    }
    async findOne(id) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                customer: true,
                service: true,
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
    }
    async update(id, updateBookingDto) {
        await this.findOne(id);
        if (updateBookingDto.bookingTime) {
            const existingBooking = await this.prisma.booking.findFirst({
                where: {
                    id: { not: id },
                    seatNumber: updateBookingDto.seatNumber,
                    bookingTime: new Date(updateBookingDto.bookingTime),
                    status: { in: [client_1.BookingStatus.CONFIRMED, client_1.BookingStatus.POSTPONED] },
                },
            });
            if (existingBooking) {
                throw new common_1.BadRequestException('Seat is already booked at this time');
            }
        }
        const data = { ...updateBookingDto };
        if (updateBookingDto.bookingTime) {
            data.bookingTime = new Date(updateBookingDto.bookingTime);
        }
        else {
            delete data.bookingTime;
        }
        return this.prisma.booking.update({
            where: { id },
            data,
            include: {
                customer: true,
                service: true,
            },
        });
    }
    async postpone(id, newBookingTime) {
        return this.update(id, {
            bookingTime: newBookingTime,
            status: client_1.BookingStatus.POSTPONED,
        });
    }
    async cancel(id) {
        return this.update(id, {
            status: client_1.BookingStatus.CANCELLED,
        });
    }
    async complete(id) {
        return this.update(id, {
            status: client_1.BookingStatus.COMPLETED,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.booking.delete({
            where: { id },
        });
    }
    async getAvailableSeats(dateTime) {
        const bookingTime = new Date(dateTime);
        const bookedSeats = await this.prisma.booking.findMany({
            where: {
                bookingTime,
                status: { in: [client_1.BookingStatus.CONFIRMED, client_1.BookingStatus.POSTPONED] },
            },
            select: { seatNumber: true },
        });
        const totalSeats = Array.from({ length: 10 }, (_, i) => i + 1);
        const bookedSeatNumbers = bookedSeats.map((booking) => booking.seatNumber);
        const availableSeats = totalSeats.filter((seat) => !bookedSeatNumbers.includes(seat));
        return { availableSeats, bookedSeats: bookedSeatNumbers };
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingService);
//# sourceMappingURL=booking.service.js.map