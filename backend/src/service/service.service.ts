import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
    constructor(private prisma: PrismaService) { }

    async create(createServiceDto: CreateServiceDto) {
        return this.prisma.service.create({
            data: createServiceDto,
        });
    }

    async findAll() {
        return this.prisma.service.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: number) {
        const service = await this.prisma.service.findUnique({
            where: { id },
        });

        if (!service) {
            throw new NotFoundException(`Service with ID ${id} not found`);
        }

        return service;
    }

    async update(id: number, updateServiceDto: UpdateServiceDto) {
        await this.findOne(id);

        return this.prisma.service.update({
            where: { id },
            data: updateServiceDto,
        });
    }

    async remove(id: number) {
        await this.findOne(id);

        return this.prisma.service.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async search(query: string) {
        return this.prisma.service.findMany({
            where: {
                AND: [
                    { isActive: true },
                    {
                        OR: [
                            { name: { contains: query, mode: 'insensitive' } },
                            { description: { contains: query, mode: 'insensitive' } },
                        ],
                    },
                ],
            },
            orderBy: { name: 'asc' },
        });
    }
}