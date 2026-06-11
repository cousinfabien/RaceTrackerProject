import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  username!: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEmail()
  email!: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MinLength(8)
  password!: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEnum(UserRole)
  role!: UserRole;
}
