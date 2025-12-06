import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'ecommerce.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-create tables (DEV only)
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    ReviewsModule,
  ],
})
export class AppModule {}
