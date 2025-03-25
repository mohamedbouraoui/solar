import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType({ description: 'solarData' })
@Schema({ _id: false })
export class SolarData {
  @Field(() => String)
  @Prop({ required: true })
  timestamp: string;

  @Field(() => Number)
  @Prop({ required: true })
  active_power_kW: number;

  @Field(() => Number)
  @Prop({ required: true })
  energy_kWh: number;
}

const SolarDataSchema = SchemaFactory.createForClass(SolarData);

@ObjectType()
@Schema()
export class Facility  {

  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop({ required: true, index: true  })
  name: string;

  @Field(() => Number)
  @Prop({ required: true })
  nominalPower: number;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Field(() => [SolarData], { nullable: true })
  @Prop({ type: [SolarDataSchema], default: [] })
  solarData?: [SolarData];
}

export type FacilityDocument = Facility & Document;

export const FacilitySchema = SchemaFactory.createForClass(Facility);