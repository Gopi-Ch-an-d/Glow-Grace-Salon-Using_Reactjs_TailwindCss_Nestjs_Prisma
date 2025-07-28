import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }

    @Post()
    create(@Body() createCustomerDto: CreateCustomerDto) {
        return this.customerService.create(createCustomerDto);
    }

    @Get()
    findAll() {
        return this.customerService.findAll();
    }

    @Get('search')
    search(@Query('q') query: string) {
        return this.customerService.search(query);
    }

    @Get('mobile/:mobile')
    findByMobile(@Param('mobile') mobile: string) {
        return this.customerService.findByMobile(mobile);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.customerService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
        return this.customerService.update(+id, updateCustomerDto);
    }
}