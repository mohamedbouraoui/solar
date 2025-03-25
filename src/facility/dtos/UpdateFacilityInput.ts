import { IsString, IsNumber, Min, IsOptional, Matches } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';


@InputType()
export class UpdateFacilityInput {
  @Field(() => String)
  @IsString()
  id: string;

  @Field(() => String,  { nullable: true })
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'Name cannot be just whitespace',
  })
  @IsOptional()
  name?: string;

  @Field(() => Number,  { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Nominal power must be at least 0.' })
  nominalPower?: number;
  
   
  @IsOptional()
  @Field(() => GraphQLUpload, { nullable: true })
  file?: FileUpload;
}
