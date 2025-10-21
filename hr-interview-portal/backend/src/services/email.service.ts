import nodemailer, { Transporter } from 'nodemailer';
import { config } from '../config';
import logger from '../config/logger';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Service to send emails using Nodemailer
 */
class EmailService {
  private transporter: Transporter;
  
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });
  }
  
  /**
   * Send email
   */
  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: config.email.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      
      logger.info('Email sent successfully:', { to: options.to, subject: options.subject });
    } catch (error) {
      logger.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
  
  /**
   * Send interview invitation email
   */
  async sendInterviewInvitation(
    candidateEmail: string,
    candidateName: string,
    jobTitle: string,
    interviewLink: string
  ): Promise<void> {
    const subject = `Interview Invitation - ${jobTitle}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Interview Invitation</h1>
          </div>
          <div class="content">
            <p>Dear ${candidateName},</p>
            <p>Thank you for your application for the <strong>${jobTitle}</strong> position.</p>
            <p>We are pleased to invite you to participate in a virtual interview. Please use the link below to join your interview session:</p>
            <p style="text-align: center;">
              <a href="${interviewLink}" class="button">Join Interview</a>
            </p>
            <p>Interview Link: <a href="${interviewLink}">${interviewLink}</a></p>
            <p><strong>Important Instructions:</strong></p>
            <ul>
              <li>Please ensure you have a stable internet connection</li>
              <li>Test your camera and microphone before the interview</li>
              <li>Find a quiet, well-lit space for the interview</li>
              <li>This link will remain valid for 7 days</li>
            </ul>
            <p>We look forward to speaking with you!</p>
            <p>Best regards,<br>The Hiring Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email from the HR Interview Portal. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const text = `Dear ${candidateName},\n\nThank you for your application for the ${jobTitle} position.\n\nWe are pleased to invite you to participate in a virtual interview. Please use the link below to join your interview session:\n\n${interviewLink}\n\nImportant Instructions:\n- Please ensure you have a stable internet connection\n- Test your camera and microphone before the interview\n- Find a quiet, well-lit space for the interview\n- This link will remain valid for 7 days\n\nWe look forward to speaking with you!\n\nBest regards,\nThe Hiring Team`;
    
    await this.sendEmail({
      to: candidateEmail,
      subject,
      html,
      text,
    });
  }
}

export default new EmailService();
