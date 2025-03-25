import { IsString, IsNumber, Min, IsOptional, Matches } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

@InputType()
export class CreateFacilityInput {  
  @Field(() => String)
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'Name cannot be just whitespace',
  })
  name: string;

  @Field(() => Number)
  @IsNumber()
  @Min(0, { message: 'Nominal power must be at least 0.' })
  nominalPower: number;
  
  @IsOptional()
  @Field(() => GraphQLUpload, { nullable: true })
  file?: Promise<FileUpload>;

}
