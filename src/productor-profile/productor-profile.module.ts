import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductorProfile, ProductorProfileSchema } from './schemas/productor-profile.schema';
import { ProductorProfileService } from './productor-profile.service';
import { ProductorProfileController } from './productor-profile.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductorProfile.name, schema: ProductorProfileSchema },
    ]),
  ],
  controllers: [ProductorProfileController],
  providers: [ProductorProfileService],
  exports: [ProductorProfileService],
})
export class ProductorProfileModule {}
