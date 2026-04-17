import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import * as fs from "fs";
import * as path from "path";
import { capitalize } from "lodash";

@Injectable()
export class MailerService {
    private readonly logger = new Logger(MailerService.name);
    private transporter;

    constructor() {
        try {
            this.transporter = nodemailer.createTransport({
                host: process.env.MAILGUN_SMTP_HOST || "smtp.eu.mailgun.org",
                port: parseInt(process.env.MAILGUN_SMTP_PORT || "587"),
                secure: process.env.MAILGUN_SMTP_SECURE === "true",
                auth: {
                    user: process.env.MAILGUN_SMTP_USER,
                    pass: process.env.MAILGUN_SMTP_PASSWORD,
                },
                // Add timeout to prevent hanging connections
                connectionTimeout: 10000, // 10 seconds
                greetingTimeout: 10000, // 10 seconds
                socketTimeout: 30000, // 30 seconds
            });

            this.logger.log("Email transporter initialized successfully");
        } catch (error) {
            this.logger.error(
                `Failed to initialize email transporter: ${error.message}`
            );
        }
    }

    private async sendMail(data: any): Promise<void> {
        // Only try to send if transporter is properly initialized
        if (!this.transporter) {
            this.logger.error(
                "Email transporter not initialized. Cannot send email."
            );
            throw new Error("Email service unavailable");
        }

        try {
            this.logger.log(`Sending email to: ${data.to}`);

            // Add timeout to the email sending process
            const res = await Promise.race([
                this.transporter.sendMail(data),
                new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error("Email sending timed out")),
                        30000
                    )
                ),
            ]);

            this.logger.log(`Email sent successfully to: ${data.to}`);
        } catch (error) {
            this.logger.error(
                `Error sending email to ${data.to}: ${error.message}`
            );
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    public async sendPasswordResetEmail(
        email: string,
        token: string,
        userName: string,
        academyName: string
    ): Promise<void> {
        const template = this.loadTemplate(
            "password-reset-email-ar.template.html"
        );
        const resetUrl = `${process.env.FRONTEND_URLS}/auth/reset_password/${token}`;
        const domain = process.env.DOMAIN;
        const html = this.replaceTemplateVariables(template, {
            resetUrl,
            domain,
            userName,
            academyName,
        });
        const data = this.buildEmail(email, html, userName, academyName);
        await this.sendMail(data);
    }

    private loadTemplate(filename: string): string {
        const templatePath = path.resolve(
            __dirname,
            "..",
            "..",
            "src",
            "mailer",
            "templates",
            filename
        );
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found: ${templatePath}`);
        }
        return fs.readFileSync(templatePath, "utf-8");
    }

    private replaceTemplateVariables(
        template: string,
        variables: { [key: string]: string }
    ): string {
        let output = template;
        for (const [key, value] of Object.entries(variables)) {
            output = output.replace(new RegExp(`{{${key}}}`, "g"), value);
        }
        return output;
    }

    private buildEmail(
        email: string,
        html: string,
        userName: string,
        academyName: string
    ) {
        return {
            from: `no-reply@${process.env.MAILGUN_DOMAIN}`,
            to: email,
            subject: `${capitalize(userName)}, Reset Your Password for ${capitalize(academyName)}`,
            html,
        };
    }

    public async sendRegistrationEmail(
        email: string,
        userName: string,
        academyName: string
    ): Promise<void> {
        try {
            this.logger.log(`Preparing registration email for: ${email}`);
            const domain = process.env.DOMAIN || "example.com";

            const template = this.loadTemplate(
                "registration-email-ar.template.html"
            );

            const html = this.replaceTemplateVariables(template, {
                userName,
                academyName,
                domain,
            });

            await this.sendMail({
                from: `no-reply@${process.env.MAILGUN_DOMAIN || "example.com"}`,
                to: email,
                subject: `${capitalize(userName)}, Welcome to ${capitalize(academyName)}`,
                html,
            });

            this.logger.log(
                `Registration email sent successfully to: ${email}`
            );
        } catch (error) {
            this.logger.error(
                `Failed to send registration email: ${error.message}`
            );
            // Re-throw the error, but allow the registration process to continue
            throw error;
        }
    }

    public async sendApprovalEmail(
        email: string,
        userName: string,
        isApproved: boolean
    ): Promise<void> {
        if (!isApproved) return;

        const domain = process.env.DOMAIN;
        const frontURL = process.env.FRONTEND_URLS;
        const status = isApproved ? "Approved" : "Rejected";
        const templateName = "approval-email-ar.template.html";
        const template = this.loadTemplate(templateName);
        const html = this.replaceTemplateVariables(template, {
            userName,
            status,
            frontURL,
            domain,
        });
        const data = {
            from: `no-reply@${process.env.MAILGUN_DOMAIN}`,
            to: email,
            subject: `${capitalize(status)} Account Notification: ${userName}`,
            html,
        };
        await this.sendMail(data);
    }

    public async sendNotificationEmail(
        email: string,
        userName: string,
        academyName: string,
        notifications: any[]
    ): Promise<void> {
        const domain = process.env.DOMAIN;
        const template = this.loadTemplate(
            "unseen-notifications-email-ar.template.html"
        );
        const notificationMessages = notifications
            .map((notification) => notification.message)
            .join("<br>");
        const html = this.replaceTemplateVariables(template, {
            userName,
            academyName,
            domain,
            notificationMessages,
        });
        await this.sendMail({
            from: `no-reply@${process.env.MAILGUN_DOMAIN}`,
            to: email,
            subject: `${capitalize(userName)}, You Have Unseen Notifications from ${capitalize(academyName)}`,
            html,
        });
    }
}
