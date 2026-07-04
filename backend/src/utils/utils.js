function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function otpTemplate(otp) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Verification Code</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#2563eb;padding:30px;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;">
                🔐 Verify Your Account
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 30px;color:#374151;">

              <h2 style="margin:0 0 15px;font-size:24px;color:#111827;">
                Hello 👋
              </h2>

              <p style="margin:0 0 20px;font-size:16px;line-height:1.7;">
                We received a request to verify your account.
                Please use the One-Time Password (OTP) below to continue.
              </p>

              <!-- OTP Box -->
              <div style="margin:35px 0;text-align:center;">
                <div style="
                  display:inline-block;
                  background:#eff6ff;
                  border:2px dashed #2563eb;
                  color:#2563eb;
                  font-size:34px;
                  font-weight:bold;
                  letter-spacing:10px;
                  padding:18px 35px;
                  border-radius:10px;
                ">
                  ${otp}
                </div>
              </div>

              <p style="font-size:15px;line-height:1.7;color:#6b7280;">
                ⏳ This OTP is valid for <strong>10 minutes</strong>.
              </p>

              <p style="font-size:15px;line-height:1.7;color:#6b7280;">
                If you didn't request this verification, you can safely ignore this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background:#f9fafb;padding:25px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:13px;color:#9ca3af;">
                This is an automated email. Please do not reply.
              </p>

              <p style="margin:10px 0 0;font-size:13px;color:#9ca3af;">
                © ${new Date().getFullYear()} Your Company. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export { generateOTP, otpTemplate };