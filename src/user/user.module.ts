import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ConfigModule.forRoot({
    cache: true,
  }),],
  providers: [ UserService, ConfigService],
  exports: [UserService],
})
export class UserModule { }
