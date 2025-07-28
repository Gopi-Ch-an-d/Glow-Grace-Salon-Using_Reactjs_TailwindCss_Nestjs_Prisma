import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
    constructor(private prisma: PrismaService) { }

    async create(createCustomerDto: CreateCustomerDto) {
        return this.prisma.customer.create({
            data: createCustomerDto,
        });
    }

    async findAll() {
        return this.prisma.customer.findMany({
            include: {
                bookings: {
                    include: {
                        service: true,
                    },
                    orderBy: { bookingTime: 'desc' },
                    take: 5,
                },
            },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: number) {
        const customer = await this.prisma.customer.findUnique({
            where: { id },
            include: {
                bookings: {
                    include: {
                        service: true,
                    },
                    orderBy: { bookingTime: 'desc' },
                },
            },
        });

        if (!customer) {
            throw new NotFoundException(`Customer with ID ${id} not found`);
        }

        return customer;
    }

    async findByMobile(mobile: string) {
        return this.prisma.customer.findUnique({
            where: { mobile },
            include: {
                bookings: {
                    include: {
                        service: true,
                    },
                    orderBy: { bookingTime: 'desc' },
                    take: 5,
                },
            },
        });
    }

    async update(id: number, updateCustomerDto: UpdateCustomerDto) {
        await this.findOne(id);

        return this.prisma.customer.update({
            where: { id },
            data: updateCustomerDto,
        });
    }

    async search(query: string) {
        return this.prisma.customer.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { mobile: { contains: query } },
                    { place: { contains: query, mode: 'insensitive' } },
                ],
            },
            include: {
                bookings: {
                    include: {
                        service: true,
                    },
                    orderBy: { bookingTime: 'desc' },
                    take: 3,
                },
            },
            orderBy: { name: 'asc' },
        });
    }
}