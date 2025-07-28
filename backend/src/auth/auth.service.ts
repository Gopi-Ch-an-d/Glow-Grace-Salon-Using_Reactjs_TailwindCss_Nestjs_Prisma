import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
    private transporter: nodemailer.Transporter;

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {

        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: this.configService.get('SMTP_PORT'),
            secure: false,
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }

    async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !(await bcrypt.compare(changePasswordDto.currentPassword, user.password))) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

        return this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
            select: { id: true, email: true, name: true, role: true },
        });
    }

    async changeEmail(userId: number, newEmail: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { email: newEmail },
            select: { id: true, email: true, name: true, role: true },
        });
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const { email } = forgotPasswordDto;

      
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new NotFoundException('No account found with this email address');
        }

        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        
        await this.prisma.passwordReset.create({
            data: {
                email,
                otp,
                expiresAt,
            },
        });

        
        try {
            await this.transporter.sendMail({
                from: this.configService.get('FROM_EMAIL'),
                to: email,
                subject: 'Password Reset OTP - Glow & Grace Salon',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Glow & Grace Salon</h1>
              <p style="color: white; margin: 5px 0;">Password Reset Request</p>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
              <p style="color: #666; margin-bottom: 20px;">
                We received a request to reset your password. Use the OTP below to proceed:
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h1 style="color: #667eea; font-size: 32px; margin: 0; letter-spacing: 4px;">${otp}</h1>
                <p style="color: #999; margin: 10px 0 0 0;">This OTP expires in 10 minutes</p>
              </div>
              <p style="color: #666; margin-top: 20px;">
                If you didn't request this password reset, please ignore this email.
              </p>
            </div>
            <div style="background: #333; padding: 20px; text-align: center;">
              <p style="color: #999; margin: 0; font-size: 12px;">
                © 2024 Glow & Grace Salon. All rights reserved.
              </p>
            </div>
          </div>
        `,
            });

            return {
                message: 'OTP sent to your email address successfully',
                email: email,
            };
        } catch (error) {
            throw new BadRequestException('Failed to send OTP email. Please try again.');
        }
    }

    async verifyOtp(verifyOtpDto: VerifyOtpDto) {
        const { email, otp } = verifyOtpDto;

        const passwordReset = await this.prisma.passwordReset.findFirst({
            where: {
                email,
                otp,
                isUsed: false,
                expiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!passwordReset) {
            throw new BadRequestException('Invalid or expired OTP');
        }

        return {
            message: 'OTP verified successfully',
            email: email,
            resetToken: passwordReset.id, 
        };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { email, otp, newPassword } = resetPasswordDto;

        
        const passwordReset = await this.prisma.passwordReset.findFirst({
            where: {
                email,
                otp,
                isUsed: false,
                expiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!passwordReset) {
            throw new BadRequestException('Invalid or expired OTP');
        }

        
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

 
        await this.prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        
        await this.prisma.passwordReset.update({
            where: { id: passwordReset.id },
            data: { isUsed: true },
        });

        return {
            message: 'Password reset successfully',
        };
    }
}