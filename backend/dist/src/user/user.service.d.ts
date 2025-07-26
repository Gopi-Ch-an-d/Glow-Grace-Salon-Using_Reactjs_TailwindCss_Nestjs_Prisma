import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        id: number;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        id: number;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        createdAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        createdAt: Date;
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        id: number;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        createdAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
    }>;
}
