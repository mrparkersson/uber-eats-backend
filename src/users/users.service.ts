import { LoginAccountInput } from './dtos/login.dto';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      const foundUser = await this.users.findOne({ where: { email } });
      if (foundUser) {
        return { ok: false, error: `User with ${email} already exists` };
      }

      await this.users.save(this.users.create({ email, password, role }));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: `Couldn't create account` };
    }
  }

  async login({ email, password }: LoginAccountInput): Promise<{
    ok: boolean;
    error?: string;
    token?: string;
  }> {
    //check if the email is correct
    //check if the password is correct
    //make a jwt and give it to the User

    try {
      const foundUser = this.users.findOne({ where: { email } });
      if (!foundUser) {
        return {
          ok: false,
          error: 'User not found',
        };
      }

      const correctPassword = await (await foundUser).checkPassword(password);
      if (!correctPassword) {
        return {
          ok: false,
          error: 'Incorrect password',
        };
      }

      return {
        ok: true,
        token: 'you are the right user',
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
