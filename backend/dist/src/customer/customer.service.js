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
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CustomerService = class CustomerService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCustomerDto) {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }
    async findByMobile(mobile) {
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
    async update(id, updateCustomerDto) {
        await this.findOne(id);
        return this.prisma.customer.update({
            where: { id },
            data: updateCustomerDto,
        });
    }
    async search(query) {
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
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomerService);
//# sourceMappingURL=customer.service.js.map