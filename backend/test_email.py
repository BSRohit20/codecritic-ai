import os
import resend
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY", "")

# Test email sending
try:
    params = {
        "from": "onboarding@resend.dev",
        "to": ["delivered@resend.dev"],  # Resend test email
        "subject": "Test Email from CodeCritic AI",
        "html": "<h1>Test Email</h1><p>If you receive this, email is working!</p>"
    }
    
    print(f"API Key: {resend.api_key[:20]}...")
    print(f"Sending test email...")
    
    result = resend.Emails.send(params)
    print(f"✅ Email sent successfully!")
    print(f"Result: {result}")
    
except Exception as e:
    print(f"❌ Error sending email: {str(e)}")
    print(f"Error type: {type(e).__name__}")
