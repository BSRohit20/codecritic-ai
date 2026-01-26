# Email Verification Setup Guide

## Overview
CodeCritic AI now includes email verification to ensure users have valid email addresses. When users register, they receive a verification email with a unique token.

## Features
- ✅ **Email verification with unique tokens**
- ✅ **Beautiful HTML email templates**
- ✅ **24-hour token expiration**
- ✅ **Resend verification email option**
- ✅ **Welcome email after verification**
- ✅ **Verification status tracking**

## Setup Instructions

### 1. Get Resend API Key (Free)

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your account
4. Go to API Keys section
5. Create a new API key
6. Copy the API key

### 2. Configure Environment Variables

Add to your `backend/.env` file:

```env
# Resend Email Service
RESEND_API_KEY=re_123456789_your_actual_key_here
FROM_EMAIL=onboarding@resend.dev
FRONTEND_URL=https://codecritic-ai.vercel.app
```

**Notes:**
- `FROM_EMAIL`: Use `onboarding@resend.dev` for testing
- For production, add your own domain in Resend dashboard
- `FRONTEND_URL`: Your frontend URL (for verification links)

### 3. Update Render Environment Variables

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service
3. Go to "Environment" tab
4. Add the following variables:
   - `RESEND_API_KEY` = your_resend_api_key
   - `FROM_EMAIL` = onboarding@resend.dev (or your domain)
   - `FRONTEND_URL` = https://codecritic-ai.vercel.app

5. Save changes (this will trigger a redeploy)

### 4. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

The new dependency `resend==2.0.0` will be installed.

## How It Works

### Registration Flow

1. **User Registers**
   - User submits registration form
   - Account created with `email_verified: false`
   - Verification token generated (JWT with 24h expiry)
   - Verification email sent automatically

2. **Email Sent**
   - Beautiful HTML email with verification link
   - Link format: `https://yourapp.com/verify-email?token=...`
   - Email includes sender branding

3. **User Clicks Link**
   - Frontend `/verify-email` page validates token
   - Backend verifies token and updates user
   - Welcome email sent
   - User redirected to homepage

### API Endpoints

#### Verify Email
```http
GET /api/auth/verify-email?token={token}
```

**Response:**
```json
{
  "message": "Email verified successfully!",
  "email": "user@example.com",
  "verified": true
}
```

#### Resend Verification
```http
POST /api/auth/resend-verification
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Verification email sent! Please check your inbox.",
  "success": true
}
```

#### Get User Info (Updated)
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "email_verified": true
}
```

## Development Mode

If `RESEND_API_KEY` is not set, the system runs in development mode:
- Verification link is printed to console
- Emails are not actually sent
- You can still test the verification flow

## Database Schema Updates

Users collection now includes:
```javascript
{
  email: String,
  name: String,
  password: String (hashed),
  created_at: Date,
  is_active: Boolean,
  email_verified: Boolean,  // NEW
  verification_token: String,  // NEW (removed after verification)
  verified_at: Date  // NEW (set when verified)
}
```

## Frontend Pages

### `/verify-email` Page
- Automatically validates token from URL
- Shows loading, success, error, or already-verified states
- Redirects to homepage after 3 seconds
- Full mobile responsive

## Testing

### Local Testing

1. Start backend:
```bash
cd backend
python main.py
```

2. Start frontend:
```bash
cd frontend
npm run dev
```

3. Register a new user
4. Check console for verification link (dev mode)
5. Copy link and paste in browser
6. Verify email verification works

### Production Testing

1. Deploy to Render/Vercel
2. Register with real email
3. Check email inbox (and spam folder)
4. Click verification link
5. Confirm account is verified

## Customization

### Email Templates

Edit `backend/email_service.py` to customize:
- Email HTML templates
- Branding and colors
- Email content
- Button styles

### Token Expiry

Edit `backend/auth.py`:
```python
def create_verification_token(email: str, expires_hours: int = 24):
    # Change expires_hours to desired value
```

### Verification Page Design

Edit `frontend/app/verify-email/page.tsx` to customize:
- Colors and styling
- Success/error messages
- Redirect behavior
- Icons and animations

## Troubleshooting

### Emails Not Sending

**Check:**
1. `RESEND_API_KEY` is set correctly
2. API key is active in Resend dashboard
3. `FROM_EMAIL` is valid
4. Check Resend dashboard for error logs

### Token Expired

**Solution:**
- User can request new verification email
- Call `/api/auth/resend-verification` endpoint
- Frontend can add "Resend Email" button

### Already Verified

- System detects and shows friendly message
- Redirects user to homepage
- No error thrown

## Security Considerations

1. **Token Security**
   - JWT tokens signed with SECRET_KEY
   - 24-hour expiration
   - Single-use (removed from DB after verification)

2. **Email Privacy**
   - Emails only sent to registered addresses
   - No email enumeration possible
   - Verification status not publicly exposed

3. **Rate Limiting** (Recommended)
   - Add rate limiting to resend endpoint
   - Prevent spam/abuse
   - Use libraries like `slowapi`

## Production Checklist

- [ ] Resend API key configured
- [ ] Custom domain added to Resend (optional)
- [ ] FROM_EMAIL set to your domain
- [ ] FRONTEND_URL points to production URL
- [ ] SECRET_KEY is strong and secure
- [ ] Test registration flow end-to-end
- [ ] Test verification email delivery
- [ ] Test resend verification
- [ ] Monitor Resend dashboard for issues

## Support

For issues or questions:
- Check Resend documentation: https://resend.com/docs
- Review Resend dashboard logs
- Test with different email providers
- Check spam folders

---

**Note:** Free Resend tier includes:
- 3,000 emails per month
- 100 emails per day
- Multiple email addresses

For higher volumes, upgrade to Resend paid plan.
