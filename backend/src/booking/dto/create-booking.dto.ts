import { IsString, IsNumber, IsDateString, IsObject, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class CustomerDto {
    @IsString()
    name: string;

    @IsString()
    mobile: string;

    @IsString()
    place: string;
}

export class CreateBookingDto {
    @IsObject()
    @ValidateNested()
    @Type(() => CustomerDto)
    customer: CustomerDto;

    @IsNumber()
    serviceId: number;

    @IsNumber()
    @Min(1)
    @Max(10)
    seatNumber: number;

    @IsDateString()
    bookingTime: string;
}