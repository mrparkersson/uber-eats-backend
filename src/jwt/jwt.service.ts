import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interface';
import * as jwt from 'jsonwebtoken';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}
  sign(payload: object): string {
    return jwt.sign(payload, this.options.privateKey);
  }
  verify(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }
}
