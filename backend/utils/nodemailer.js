import nodemailer from "nodemailer";

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "95f1b7001@smtp-brevo.com",
    pass: "9HLB5V8Qx6CznDtT",
  },
});

//Export
export { transporter };
