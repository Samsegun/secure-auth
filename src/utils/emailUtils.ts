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
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

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

export { sendVerificationEmail };
