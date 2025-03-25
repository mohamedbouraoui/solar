import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from '../user/dto/create-user.input';
import { ConfigService } from '@nestjs/config';
import { LoginUserInput } from './dto/login-user.input';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(loginUserInput: LoginUserInput) {
    const { email, password } = loginUserInput;
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
        return null;
    }

    const isMatch = await bcrypt.compare(password, user?.password);

    if (isMatch) {
      return {_id:user._id,email:user.email,name:user.name};
    }

    return null;
  }

  login(user: User) {
    return {
      user,
      authToken: this.jwtService.sign(
        {
          email: user.email,
          name: user.name,
          sub: user._id,
        },
        {
          secret:this.configService.get<string>('JWT_SECRET'),
          expiresIn: '1h', 
        },
      ),
    };
  }

  async signup(payload: CreateUserInput) {
    const user = await this.userService.findOneByEmail(payload.email);

    if (user) {
      throw new Error('User already exists');
    }

    const hash = await bcrypt.hash(payload.password,10);

    const newUser= await  this.userService.createUser({ ...payload, password: hash });
    
    return {
      user:newUser,
      authToken: this.jwtService.sign(
        {
          email: newUser.email,
          name: newUser.name,
          sub: newUser._id,
        },
        {
          secret:this.configService.get<string>('JWT_SECRET'),
          expiresIn: '1h', 
        },
      ),
    };
  }
}