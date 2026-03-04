import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const { EMAIL_USER, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;

  if (!EMAIL_USER || !CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    throw new Error(
      "Missing email OAuth env vars. Required: EMAIL_USER, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN",
    );
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: EMAIL_USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
    },
  });

  return transporter;
}

const sendEmail = async (to, subject, text, html) => {
  const mailTransporter = getTransporter();

  const info = await mailTransporter.sendMail({
    from: `"Backend Ledger" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Backend Ledger";
  const html = `<h1>Welcome ${name}!</h1><p>Thank you for registering.</p>`;
  await sendEmail(userEmail, subject, "", html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Alert";
  const html = `<h1>Hi ${name}!</h1><p>You have a transaction of amount ${amount} to account ${toAccount}.</p>`;
  await sendEmail(userEmail, subject, "", html);
}

async function sendTransactionFailedEmail(
  userEmail,
  name,
  amount,
  fromAccount,
) {
  const subject = "Transaction Failed";
  const html = `<h1>Hi ${name}!</h1><p>Your transaction of amount ${amount} from account ${fromAccount} failed.</p>`;
  await sendEmail(userEmail, subject, "", html);
}

export {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailedEmail,
};
