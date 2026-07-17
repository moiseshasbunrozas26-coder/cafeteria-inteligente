import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { IngredientsModule } from './ingredients/ingredients.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProductsModule } from './products/products.module.js';
import { RecipesModule } from './recipes/recipes.module.js';
import { UsersModule } from './users/users.module.js';
import { InventoryMovementsModule } from './inventory-movements/inventory-movements.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    IngredientsModule,
    RecipesModule,
    InventoryMovementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}