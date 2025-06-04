import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { ItemsModule } from './items/items.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesModule } from './categories/categories.module';

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
          host:
            configService.get('NODE_ENV') === 'production'
              ? configService.get('DB_HOST_PROD')
              : configService.get('DB_HOST_DEV'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: 'rate-me-postgres',
        };
      },
    }),
    CategoriesModule,
  ],
  controllers: [CategoriesController],
})
export class AppModule {}
