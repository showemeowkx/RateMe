import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { ItemsModule } from './items/items.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    AuthModule,
    ItemsModule,
    ReviewsModule,
    ConfigModule.forRoot({
      envFilePath: ['../.env'],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: 'rate-me-postgres',
        };
      },
    }),
  ],
})
export class AppModule {}
