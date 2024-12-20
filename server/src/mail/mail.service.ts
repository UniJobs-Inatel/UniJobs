import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // host: process.env.EMAIL_HOST,
      // port: parseInt(process.env.EMAIL_PORT, 10),
      // auth: {
      //   user: process.env.EMAIL_USER,
      //   pass: process.env.EMAIL_PASS,
      // },
      host: 'mail.smtpbucket.com',
      port: 8025,
    });
  }

  async sendVerificationEmail(
    to: string,
    verificationUrl: string,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@unijobs.com',
      to: 'unijobs@test.com',
      subject: 'Verify your account',
      text: `Please verify your account by clicking the following link: ${verificationUrl}`,
      html: `<p>Please verify your account by clicking the following link: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }
}
