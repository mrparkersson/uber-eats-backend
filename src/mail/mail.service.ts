import * as nodemailer from 'nodemailer';
import * as nodemailMailgun from 'nodemailer-mailgun-transport';
import { MailModuleOptions } from './mail.interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  private async sendEmail(
    subject: string,
    template: string,
    code: string,
    username: string,
  ) {
    const auth = {
      auth: {
        api_key: `${this.options.apiKey}`,
        domain: `${this.options.domain}`,
      },
    };

    const nodemailerMailgun = nodemailer.createTransport(nodemailMailgun(auth));

    nodemailerMailgun.sendMail(
      {
        from: `${this.options.fromEmail}`,
        to: 'jason44853@gmail.com', // An array if you have multiple recipients.
        subject,
        template,
        'v:code': code,
        'v:username': username,
      },
      (err, info) => {
        if (err) {
          console.log(`Error: ${err}`);
        } else {
          console.log(`Response: ${JSON.stringify(info)}`);
        }
      },
    );
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify your email', 'verify-email', code, email);
  }
}
