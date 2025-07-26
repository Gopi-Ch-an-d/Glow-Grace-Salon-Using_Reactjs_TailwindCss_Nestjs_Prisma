import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
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
    findOne(id: string): Promise<{
        id: number;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        createdAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: number;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        id: number;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
    }>;
}
