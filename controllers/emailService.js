const SibApiV3Sdk = require("sib-api-v3-sdk")

const defaultClient = SibApiV3Sdk.ApiClient.instance;

//Brevo API key authorization
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

//API instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

//Password Reset Email
const passwordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/password/change?token=${token}`;

  const sendSMTPEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSMTPEmail.sender = {
    name: "Skirill",
    email: "info@skirill.org",
  };

  sendSMTPEmail.to = [{ email }];

  sendSMTPEmail.subject = "Reset your Skirill password";

  sendSMTPEmail.htmlContent = `
    <div style="background:#f6f8fb;padding:40px 12px;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #eaeaea;">

        <!-- HEADER -->
        <div style="padding:24px 32px;text-align:center;border-bottom:1px solid #f0f0f0;">
          <img 
            src="https://publication-site.s3.eu-north-1.amazonaws.com/site_images/favicon.png"
            alt="Skirill Logo"
            style="width:42px;height:42px;margin-bottom:8px;"
          />
          <div style="font-size:20px;font-weight:800;color:#064e3b;letter-spacing:-0.3px;">
            Skirill
          </div>
        </div>

        <!-- BODY -->
        <div style="padding:32px;text-align:center;">
          <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">
            Password Reset Request
          </h2>

          <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">
            We received a request to reset your password. If this was you, click the button below to proceed.
          </p>

          <a href="${resetUrl}"
            style="
              display:inline-block;
              background:#065f46;
              color:#ffffff;
              text-decoration:none;
              padding:12px 22px;
              border-radius:8px;
              font-weight:600;
              font-size:14px;
            ">
            Reset Password
          </a>

          <p style="margin-top:24px;color:#9ca3af;font-size:12px;line-height:1.5;">
            This link will expire shortly for security reasons.
            <br/>
            If you did not request this, you can safely ignore this email.
          </p>
        </div>

        <!-- FOOTER -->
        <div style="padding:20px 32px;text-align:center;background:#fafafa;border-top:1px solid #f0f0f0;">
          <p style="margin:0;color:#9ca3af;font-size:11px;">
            © ${new Date().getFullYear()} Skirill. All rights reserved.
          </p>
          <p style="margin:6px 0 0;color:#c0c0c0;font-size:11px;">
            info@skirill.org
          </p>
        </div>

      </div>
    </div>
    `;

  try {
    const response = await apiInstance.sendTransacEmail(sendSMTPEmail);
  } catch (error) {
    console.error("Brevo API Error:", error.response?.text || error.message);
    throw error;
  }
};

//Subscription Verification Email
// const newslletterVerificationEmail = async (email, token) => {

module.exports = { passwordResetEmail }