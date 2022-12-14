import { MailService } from './../mail/mail.service';
import { Verification } from './../common/entities/verification.entity';
import { JwtService } from './../jwt/jwt.service';
import { LoginAccountInput } from './dtos/login.dto';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EditProfileInput } from './dtos/edit-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      const foundUser = await this.users.findOne({ where: { email } });

      if (foundUser) {
        return { ok: false, error: `User already exists` };
      }

      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      const verification = await this.verifications.save(
        this.verifications.create({ user }),
      );

      this.mailService.sendVerificationEmail(user.email, verification.code);

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
      const foundUser = await this.users.findOne({
        where: { email },
        select: ['id', 'password'],
      });
      if (!foundUser) {
        return {
          ok: false,
          error: 'User not found',
        };
      }

      const correctPassword = await foundUser.checkPassword(password);
      if (!correctPassword) {
        return {
          ok: false,
          error: 'Incorrect password',
        };
      }

      const token = this.jwtService.sign({ id: (await foundUser).id });
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findUserById(id: number): Promise<User> {
    return this.users.findOne({ where: { id } });
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<User> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (email) {
      user.email = email;
      user.verified = false;
      const verification = await this.verifications.save(
        this.verifications.create({ user }),
      );
      this.mailService.sendVerificationEmail(user.email, verification.code);
    }
    if (password) {
      user.password = password;
    }

    return this.users.save(user);
  }

  async verifyEmail(code: string): Promise<boolean> {
    try {
      const verification = await this.verifications.findOne({
        where: { code },
        relations: ['user'],
      });
      if (verification) {
        verification.user.verified = true;
        await this.users.save(verification.user);
        await this.verifications.delete(verification.id);

        return true;
      }
      throw new Error();
    } catch (error) {
      return false;
    }
  }
}
