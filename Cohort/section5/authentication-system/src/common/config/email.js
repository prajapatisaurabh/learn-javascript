import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async (to, subject, html) => {
  transporter.sendMail({
    from: "WRITE YOUR EMAIL",
    to,
    subject,
    html,
  });
};

const sendVerificationMail = async (to, subject, html, token) => {
  transporter.sendMail({
    from: "WRITE YOUR EMAIL",
    to,
    subject,
    html,
  });
};

export { sendMail, sendVerificationMail };
