import * as nodemailer from 'nodemailer';
import * as nodemailMailgun from 'nodemailer-mailgun-transport';
import { MailModuleOptions } from './mail.interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    this.sendEmail('Please confirm your account', 'verify-email');
  }

  private async sendEmail(subject: string, template: string) {
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
        'v:code': 'asdfs',
        'v:username': 'parker',
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
}
