export const makeWelcomeHtml = ({
  name = "Friend",
  ctaLink = "https://sastacollege.example/get-started",
} = {}) => {
  return `<!doctype html>
<html lang="en" style="margin:0;padding:0;">
<head>
  <meta charset="utf-8" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Welcome to SastaCollege</title>
  <style>
    @media (prefers-color-scheme: dark) {
      .bg { background:#0b0b0c !important; }
      .card { background:#161617 !important; border-color:#2a2a2b !important; }
      .text { color:#e9e9ea !important; }
      .muted { color:#b3b3b6 !important; }
      .btn { background:#5b8cff !important; }
    }
    @media only screen and (max-width:600px) {
      .container { width:100% !important; }
      .px { padding-left:20px !important; padding-right:20px !important; }
      .logo { margin:0 auto !important; }
    }
    .hover-underline:hover { text-decoration:underline !important; }
  </style>
</head>
<body class="bg" style="margin:0;padding:0;background:#f4f5f7;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <!-- Hidden preheader text -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    Welcome to SastaCollege — your learning journey starts now.
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f4f5f7;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" class="container" cellpadding="0" cellspacing="0" width="600" style="width:600px;max-width:600px;">
          <!-- Logo -->
          <tr>
            <td align="left" class="px" style="padding:8px 32px 16px;">
              <a href="https://sastacollege.example" target="_blank" rel="noopener" style="text-decoration:none;">
                <img class="logo" src="https://dummyimage.com/160x40/111/fff&text=SastaCollege" width="160" height="40" alt="SastaCollege" style="display:block;border:0;outline:none;text-decoration:none;">
              </a>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td class="card px" style="background:#ffffff;border:1px solid #e6e8eb;border-radius:12px;padding:32px;">
              <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#0f172a;">
                Welcome, ${name} 🎉
              </h1>

              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#475569;">
                We're excited to have you with <strong>SastaCollege</strong>. Your account is ready — start exploring courses, track your progress and join our community.
              </p>

              <!-- CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td>
                    <a href="${ctaLink}" target="_blank" rel="noopener"
                       style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:10px;padding:12px 20px;font-size:16px;font-weight:600;">
                      Get Started
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#0f172a;">
                Helpful links:
              </p>
              <ul style="margin:0 0 24px 20px;padding:0;font-size:15px;line-height:1.7;color:#0f172a;">
                <li><a href="https://sastacollege.example/courses" style="color:#2563eb;text-decoration:none;">Browse Courses</a></li>
                <li><a href="https://sastacollege.example/community" style="color:#2563eb;text-decoration:none;">Community</a></li>
                <li><a href="https://sastacollege.example/help" style="color:#2563eb;text-decoration:none;">Help & Support</a></li>
              </ul>

              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #eef2f7;padding-top:16px;">
                <tr>
                  <td style="font-size:13px;color:#6b7280;line-height:1.5;">
                    If you didn't create an account with this email, please ignore this message or contact our support.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:12px 32px;color:#9aa1ab;font-size:13px;">
              SastaCollege • 123 Learning St • City, Country<br/>
              <a href="https://sastacollege.example/unsubscribe" style="color:#9aa1ab;text-decoration:underline;">Unsubscribe</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
