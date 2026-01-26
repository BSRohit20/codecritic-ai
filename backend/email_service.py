import os
import resend
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY", "")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
FROM_EMAIL = os.getenv("FROM_EMAIL", "onboarding@resend.dev")

async def send_verification_email(email: str, token: str):
    """Send email verification link to user"""
    try:
        verification_link = f"{FRONTEND_URL}/verify-email?token={token}"
        
        params = {
            "from": FROM_EMAIL,
            "to": [email],
            "subject": "Verify Your Email - CodeCritic AI",
            "html": f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f7f7f7; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .button {{ display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                    .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🚀 Welcome to CodeCritic AI!</h1>
                    </div>
                    <div class="content">
                        <h2>Verify Your Email Address</h2>
                        <p>Thanks for signing up! Please verify your email address to get started with CodeCritic AI.</p>
                        <p>Click the button below to verify your email:</p>
                        <a href="{verification_link}" class="button">Verify Email Address</a>
                        <p>Or copy and paste this link in your browser:</p>
                        <p style="word-break: break-all; color: #667eea;">{verification_link}</p>
                        <p><strong>This link will expire in 24 hours.</strong></p>
                        <p>If you didn't create an account, you can safely ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>© 2026 CodeCritic AI. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """
        }
        
        # Only send email if API key is configured
        if resend.api_key and resend.api_key != "":
            print(f"📧 Sending verification email to {email} with Resend API...")
            email_result = resend.Emails.send(params)
            print(f"✅ Email sent successfully! ID: {email_result.get('id')}")
            return {"success": True, "id": email_result.get("id")}
        else:
            # In development without API key, just log the link
            print(f"📧 Email verification link (API key not configured): {verification_link}")
            return {"success": True, "dev_mode": True, "link": verification_link}
            
    except Exception as e:
        print(f"❌ Error sending verification email to {email}: {str(e)}")
        print(f"Error details: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return {"success": False, "error": str(e)}

async def send_welcome_email(email: str, name: str):
    """Send welcome email after verification"""
    try:
        params = {
            "from": FROM_EMAIL,
            "to": [email],
            "subject": "Welcome to CodeCritic AI! 🎉",
            "html": f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f7f7f7; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .feature {{ margin: 15px 0; padding: 15px; background: white; border-radius: 5px; }}
                    .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 You're All Set!</h1>
                    </div>
                    <div class="content">
                        <h2>Welcome, {name}!</h2>
                        <p>Your email has been verified and your account is ready to use.</p>
                        <h3>What you can do with CodeCritic AI:</h3>
                        <div class="feature">
                            <strong>🐛 Bug Detection</strong>
                            <p>Find potential bugs with severity ratings</p>
                        </div>
                        <div class="feature">
                            <strong>🔒 Security Scanning</strong>
                            <p>Detect vulnerabilities and get remediation advice</p>
                        </div>
                        <div class="feature">
                            <strong>⚡ Performance Tips</strong>
                            <p>Optimize your code for better efficiency</p>
                        </div>
                        <div class="feature">
                            <strong>📊 Code Analytics</strong>
                            <p>Track your code quality over time</p>
                        </div>
                        <p style="margin-top: 20px;">Start reviewing your code now at <a href="{FRONTEND_URL}">{FRONTEND_URL}</a></p>
                    </div>
                    <div class="footer">
                        <p>© 2026 CodeCritic AI. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """
        }
        
        if resend.api_key and resend.api_key != "":
            resend.Emails.send(params)
        else:
            print(f"📧 Welcome email (dev mode) sent to {email}")
            
    except Exception as e:
        print(f"Error sending welcome email: {str(e)}")
