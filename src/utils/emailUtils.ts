import nodemailer from "nodemailer";

const SMTP_USER = process.env.SMTP_USER!;
const GOOGLE_APP_PASSWORD = process.env.GOOGLE_APP_PASSWORD!;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: SMTP_USER,
        pass: GOOGLE_APP_PASSWORD,
    },
});

async function sendVerificationEmail(email: string, verificationToken: string) {
    const verificationUrl = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${verificationToken}`;

    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "Verify Your Email Address - Secure Auth",
        html: `
        <section>
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        </section>
      `,
    };

    try {
        console.log("Sending email...");

        await transporter.sendMail(mailOptions);

        console.log("Email sent");
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

async function sendPasswordResetEmail(
    email: string,
    resetPasswordToken: string
) {
    const resetPasswordUrl = `${process.env.CLIENT_URL}/api/auth/reset-password?token=${resetPasswordToken}`;

    const mailOptions = {
        from: process.env.FROM_EMAIL!,
        to: email,
        subject: "Reset Your Password - Secure Auth",
        html: `
        <section>
        <h1>Reset Password</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetPasswordUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        </section>
      `,
    };

    try {
        console.log("Sending email...");

        await transporter.sendMail(mailOptions);

        console.log("Email sent");
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

export { sendPasswordResetEmail, sendVerificationEmail };
