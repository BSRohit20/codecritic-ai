import os
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USERNAME)

async def send_verification_email(email: str, token: str):
    """Send email verification link to user"""
    try:
        verification_link = f"{FRONTEND_URL}/verify-email?token={token}"
        
        print(f"📧 Email Configuration:")
        print(f"   SMTP Host: {SMTP_HOST}:{SMTP_PORT}")
        print(f"   From: {FROM_EMAIL}")
        print(f"   To: {email}")
        print(f"   Frontend URL: {FRONTEND_URL}")
        print(f"   Credentials configured: {bool(SMTP_USERNAME and SMTP_PASSWORD)}")
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "Verify Your Email - CodeCritic AI"
        msg['From'] = FROM_EMAIL
        msg['To'] = email
        
        html_content = f"""
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
        
        msg.attach(MIMEText(html_content, 'html'))
        
        # Only send email if SMTP credentials are configured
        if SMTP_USERNAME and SMTP_PASSWORD:
            print(f"📧 Attempting to send verification email to {email} via SMTP...")
            try:
                # Use SSL (port 465) or STARTTLS (port 587) based on port
                use_tls = SMTP_PORT == 465
                
                await aiosmtplib.send(
                    msg,
                    hostname=SMTP_HOST,
                    port=SMTP_PORT,
                    username=SMTP_USERNAME,
                    password=SMTP_PASSWORD,
                    use_tls=use_tls,  # Use SSL for port 465
                    start_tls=(not use_tls),  # Use STARTTLS for port 587
                    timeout=30  # 30 second timeout
                )
                print(f"✅ Email sent successfully to {email}")
                return {"success": True, "recipient": email}
            except aiosmtplib.SMTPAuthenticationError as e:
                print(f"❌ SMTP Authentication failed! Check your Gmail app password.")
                print(f"   Error: {str(e)}")
                return {"success": False, "error": f"Authentication failed: {str(e)}"}
            except aiosmtplib.SMTPException as e:
                print(f"❌ SMTP error: {str(e)}")
                return {"success": False, "error": f"SMTP error: {str(e)}"}
            except Exception as e:
                print(f"❌ Unexpected error sending email: {str(e)}")
                import traceback
                traceback.print_exc()
                return {"success": False, "error": str(e)}
        else:
            # In development without credentials, just log the link
            print(f"⚠️  SMTP credentials not configured!")
            print(f"📧 Email verification link: {verification_link}")
            return {"success": False, "error": "SMTP not configured", "dev_mode": True, "link": verification_link}
            
    except Exception as e:
        print(f"❌ Error sending verification email to {email}: {str(e)}")
        print(f"Error details: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return {"success": False, "error": str(e)}

async def send_welcome_email(email: str, name: str):
    """Send welcome email after verification"""
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "Welcome to CodeCritic AI! 🎉"
        msg['From'] = FROM_EMAIL
        msg['To'] = email
        
        html_content = f"""
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
        
        msg.attach(MIMEText(html_content, 'html'))
        
        if SMTP_USERNAME and SMTP_PASSWORD:
            print(f"📧 Sending welcome email to {email}...")
            try:
                use_tls = SMTP_PORT == 465
                
                await aiosmtplib.send(
                    msg,
                    hostname=SMTP_HOST,
                    port=SMTP_PORT,
                    username=SMTP_USERNAME,
                    password=SMTP_PASSWORD,
                    use_tls=use_tls,
                    start_tls=(not use_tls),
                    timeout=30
                )
                print(f"✅ Welcome email sent successfully to {email}")
                return {"success": True, "recipient": email}
            except Exception as smtp_error:
                print(f"❌ Error sending welcome email via SMTP: {str(smtp_error)}")
                import traceback
                traceback.print_exc()
                return {"success": False, "error": str(smtp_error)}
        else:
            print(f"⚠️  SMTP not configured - Welcome email not sent to {email}")
            return {"success": False, "error": "SMTP not configured"}
            
    except Exception as e:
        print(f"❌ Error in send_welcome_email: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"success": False, "error": str(e)}
