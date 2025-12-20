import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from 'src/config.schema';
import { JwtStrategy } from './jwt.strategy';
import { ModeratorGuard } from 'src/common/decorators/guards/moderator.guard';
import { AuthProxy } from './auth.proxy';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 18000,
        },
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: ['../.env'],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'AUTH_SERVICE',
      useFactory: (authService: AuthService) => {
        return new AuthProxy(authService);
      },
      inject: [AuthService],
    },
    JwtStrategy,
    ModeratorGuard,
    CloudinaryModule,
  ],
  exports: [JwtStrategy, PassportModule, 'AUTH_SERVICE', ModeratorGuard],
})
export class AuthModule {}
