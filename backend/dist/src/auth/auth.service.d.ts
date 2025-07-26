import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
    changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<{
        id: number;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
    }>;
    changeEmail(userId: number, newEmail: string): Promise<{
        id: number;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
    }>;
}
