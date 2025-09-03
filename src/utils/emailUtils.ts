import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST,
    // port: parseInt(process.env.SMTP_PORT || "587"),
    // secure: false,
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
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
