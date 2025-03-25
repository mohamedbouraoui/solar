import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Facility, FacilitySchema } from './facility.entity';
import { FacilityService } from './facility.service';
import { FacilityResolver } from './facility.resolver';
@Module({
    imports: [MongooseModule.forFeature([{ name: Facility.name, schema: FacilitySchema }])],
    providers: [FacilityService, FacilityResolver],
})
export class FacilitiesModule { }
