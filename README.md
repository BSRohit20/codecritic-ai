# CodeCritic AI 🚀

A production-ready, full-stack AI-powered code review platform with user authentication, email verification, and comprehensive code analysis. Built with Pydantic AI, FastAPI, Next.js, and MongoDB.

## 🌐 Live Demo

- **Frontend**: [https://codecritic-ai.vercel.app](https://codecritic-ai.vercel.app)
- **Backend API**: [https://codecritic-ai-backend.onrender.com](https://codecritic-ai-backend.onrender.com)
- **GitHub**: [https://github.com/BSRohit20/codecritic-ai](https://github.com/BSRohit20/codecritic-ai)

## ✨ Key Features

### 🔐 Authentication & Security
- **User Registration & Login**: Secure JWT-based authentication
- **Email Verification**: Brevo-powered email verification with resend functionality
- **Password Hashing**: Bcrypt encryption for secure password storage
- **Protected Routes**: Role-based access control
- **Session Management**: Persistent login with token refresh

### 🎯 Comprehensive Code Analysis
- **Quality Scoring**: Overall code quality score (0-100)
- **Bug Detection**: Identify bugs with severity ratings (critical, high, medium, low)
- **Security Scanning**: Detect vulnerabilities (SQL injection, XSS, auth flaws, etc.)
- **Performance Tips**: Optimization suggestions for better efficiency
- **Refactoring Guidance**: Side-by-side code comparisons with improvements
- **Complexity Analysis**: Automatic Big O notation for time and space complexity

### 🎨 Premium User Experience
- **Modern UI/UX**: Gradient backgrounds, smooth animations, responsive design
- **Code Diff Viewer**: Side-by-side comparison with syntax highlighting
- **One-Click Copy**: Copy suggestions directly to clipboard
- **Real-time Feedback**: Loading states and progress indicators
- **Multi-Language Support**: JavaScript, TypeScript, Python, Java, C++, Go, Rust, PHP, Ruby
- **Mobile Responsive**: Works seamlessly on all devices

### 💡 Advanced Features
- **📊 Code History**: Track all reviews with timestamps and filtering
- **💬 AI Chat Assistant**: Interactive chat about your code
- **📚 Snippet Library**: Save and organize reusable code patterns
- **⚡ Performance Benchmarking**: Algorithm complexity analysis
- **👥 Real-time Collaboration**: Share reviews and collaborate
- **📈 Analytics Dashboard**: View trends and export data (JSON/PDF)

### 🤖 AI-Powered by Mistral
- **Pydantic AI**: Structured, type-safe AI outputs
- **Mistral Devstral 2512**: Free, code-optimized AI model via OpenRouter
- **Intelligent Retries**: Automatic retry logic for reliability
- **Context-Aware**: Maintains conversation context for better suggestions

## 🏗️ Tech Stack

### Backend
- **FastAPI 0.115.0**: High-performance async Python framework
- **Pydantic AI 0.0.14**: Type-safe AI agent with structured outputs
- **MongoDB**: NoSQL database for user data and review history
- **Brevo API**: Transactional email service (300 emails/day free)
- **JWT Authentication**: Secure token-based auth
- **Python 3.13.4**: Latest Python with performance improvements

### Frontend
- **Next.js 15.5.9**: React framework with App Router
- **React 18.3.1**: Modern React with hooks and context
- **TypeScript**: Full type safety
- **Tailwind CSS 3.4.0**: Utility-first styling
- **Lucide React**: Beautiful icon library

### Infrastructure
- **Vercel**: Frontend hosting with edge network
- **Render**: Backend hosting with auto-deploy
- **MongoDB Atlas**: Cloud database
- **GitHub Actions**: CI/CD pipeline

## 📋 Prerequisites

- Python 3.10+ (3.13.4 recommended)
- Node.js 18+
- MongoDB account (free at [mongodb.com](https://mongodb.com))
- OpenRouter API key (free at [openrouter.ai](https://openrouter.ai))
- Brevo account (free at [brevo.com](https://brevo.com))

## 🚀 Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/BSRohit20/codecritic-ai.git
cd codecritic-ai
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with required variables
echo OPENROUTER_API_KEY=your_key_here > .env
echo MONGODB_URL=your_mongodb_connection_string >> .env
echo JWT_SECRET_KEY=your_secret_key >> .env
echo BREVO_API_KEY=your_brevo_api_key >> .env
echo FROM_EMAIL=your_verified_email@domain.com >> .env
echo FRONTEND_URL=http://localhost:3000 >> .env
```

**Required API Keys:**
1. **OpenRouter** (AI): Visit [openrouter.ai](https://openrouter.ai) → Sign up → Keys → Create
2. **MongoDB** (Database): Visit [mongodb.com](https://mongodb.com) → Create free cluster → Connect → Get connection string
3. **Brevo** (Email): Visit [brevo.com](https://brevo.com) → Sign up → SMTP & API → Generate API key → Verify sender email
4. **JWT Secret**: Generate a random string (e.g., `openssl rand -hex 32`)

### 3. Frontend Setup

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
```

### 4. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
python main.py
# 🚀 Backend running at http://localhost:8000
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
# ✨ Frontend running at http://localhost:3000
```

**Open your browser:** [http://localhost:3000](http://localhost:3000)

## 🌍 Production Deployment

### Backend Deployment (Render)

1. **Create Web Service** on [render.com](https://render.com)
2. **Connect GitHub repository**: `BSRohit20/codecritic-ai`
3. **Configure Settings**:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Add Environment Variables**:
   ```
   OPENROUTER_API_KEY=your_openrouter_key
   MONGODB_URL=your_mongodb_connection_string
   DATABASE_NAME=codecritic
   JWT_SECRET_KEY=your_secret_key
   BREVO_API_KEY=your_brevo_api_key
   FROM_EMAIL=your_verified_email@domain.com
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
5. **Deploy** (auto-deploys on git push)

### Frontend Deployment (Vercel)

1. **Import Project** on [vercel.com](https://vercel.com)
2. **Connect GitHub repository**: `BSRohit20/codecritic-ai`
3. **Configure Settings**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
4. **Add Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Your backend URL (e.g., `https://codecritic-ai-backend.onrender.com`)
5. **Deploy** (auto-deploys on git push)

## 📁 Project Structure

```
codecritic-ai/
├── backend/
│   ├── main.py                      # FastAPI app with Pydantic AI
│   ├── auth.py                      # JWT authentication & password hashing
│   ├── database.py                  # MongoDB connection & operations
│   ├── email_service_brevo.py       # Brevo email service
│   ├── requirements.txt             # Python dependencies
│   ├── .env                         # Environment variables (not in git)
│   └── test_*.py                    # Test files
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx                 # Main app with verification wall
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Global styles
│   │   └── verify-email/
│   │       └── page.tsx             # Email verification page
│   ├── components/
│   │   ├── Login.tsx                # Login form
│   │   ├── Register.tsx             # Registration form
│   │   ├── CodeEditor.tsx           # Code input
│   │   ├── ReviewResults.tsx        # Review display
│   │   ├── LoadingState.tsx         # Loading animation
│   │   ├── DiffViewer.tsx           # Code comparison
│   │   ├── CodeHistory.tsx          # Review history
│   │   ├── ChatAssistant.tsx        # AI chat
│   │   ├── SnippetLibrary.tsx       # Code snippets
│   │   ├── Collaboration.tsx        # Team features
│   │   └── PerformanceBenchmark.tsx # Performance tools
│   ├── contexts/
│   │   └── AuthContext.tsx          # Auth state management
│   │   ├── PerformanceBenchmark.tsx # Complexity analysis display
│   │   ├── Collaboration.tsx        # Sharing & comments
│   │   ├── Login.tsx                # Login component
│   │   └── Register.tsx             # Registration component
│   ├── contexts/
│   │   └── AuthContext.tsx          # Authentication context
│   ├── package.json         # Node dependencies
│   ├── tsconfig.json        # TypeScript configuration
│   ├── tailwind.config.ts   # Tailwind CSS configuration
│   ├── next.config.js       # Next.js configuration
│   └── .gitignore          # Node/frontend ignores
│
├── README.md               # This file
├── NEW_FEATURES.md        # Detailed feature documentation
├── render.yaml            # Render deployment config
└── .gitignore            # Root gitignore
```

## 🎯 How to Use

### For End Users

1. **Register an Account**: 
   - Visit [codecritic-ai.vercel.app](https://codecritic-ai.vercel.app)
   - Click "Create Account"
   - Enter your email, name, and password
   - Verify your email (check inbox/spam)

2. **Login & Start Reviewing**:
   - After email verification, you can access the app
   - Paste your code into the editor
   - Select programming language
   - Click "Review Code"

3. **View Comprehensive Results**:
   - ✅ Overall quality score (0-100)
   - 💡 Code strengths and best practices
   - 🐛 Bugs with line numbers and severity
   - 🔒 Security vulnerabilities with fixes
   - ⚡ Performance tips and complexity analysis
   - 🔄 Refactoring suggestions with code comparisons

4. **Use Advanced Features**:
   - 📈 **View History**: Track all your reviews
   - 💬 **AI Chat**: Ask questions about your code
   - 📚 **Snippets**: Save reusable code patterns
   - 👥 **Share**: Collaborate with teammates

### For Developers

See the [Development Setup](#-local-development-setup) section above.

## 🚀 New Features

### 📊 Code Diff Viewer
View side-by-side comparisons of original vs. improved code with:
- Color-coded highlighting (red for current, green for improved)
- Line-by-line comparison
- One-click copy to clipboard
- One-click apply changes to editor

### 📈 Code History & Analytics
Track your code quality journey:
- Stores up to 50 recent reviews in localStorage
- Analytics dashboard with quality trends
- Export history as JSON or PDF
- Visual trend analysis (improving, declining, or stable)

### 💬 AI Chat Assistant
Interactive chat about your code:
- Context-aware responses about your review
- Suggested quick-start questions
- Maintains conversation history
- Floating, non-intrusive interface

### 📚 Code Snippet Library
Organize and reuse code patterns:
- Save frequently reviewed code snippets
- Tag-based organization
- Search by title, description, or code
- Usage tracking and favorites
- Auto-suggestions based on current code

### ⚡ Performance Benchmarking
Algorithm complexity analysis:
- Automatic Big O notation for time and space complexity
- Color-coded complexity ratings (Excellent → Very Poor)
- Detailed explanations and optimization suggestions
- Complexity reference guide

### 👥 Real-time Collaboration
Share and collaborate on reviews:
- Generate shareable links for code reviews
- Email sharing integration
- Line-specific comments
- Team workspace (coming soon)

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```
Response: `{ "access_token", "user": {...}, "message" }`

#### POST `/api/auth/login`
Login with email and password
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```
Response: `{ "access_token", "user": {...} }`

#### GET `/api/auth/me`
Get current user info (requires authentication)
Headers: `Authorization: Bearer <token>`

#### GET `/api/auth/verify-email?token=<token>`
Verify email address with token from email

#### POST `/api/auth/resend-verification`
Resend verification email (requires authentication)

### Code Review Endpoints

#### POST `/api/review`
Submit code for AI review
```json
{
  "code": "function example() { ... }",
  "language": "javascript"
}
```
Response: Complete code review with bugs, security, performance, etc.

#### POST `/api/history/save`
Save review to history (requires authentication)

#### GET `/api/history`
Get user's review history (requires authentication)

### Health Check

#### GET `/health`
Check service status and configuration
Response: Shows if API keys and services are configured

For detailed API documentation, see the [API Reference](#) or visit `/docs` on the backend URL.

## 🔧 Key Technical Decisions

### Email Service (Brevo)
- **Why Brevo**: SMTP ports (587, 465) are blocked on Render
- **HTTP API**: Uses REST API instead of SMTP
- **Free Tier**: 300 emails/day - sufficient for the app
- **No Domain Required**: Can send from verified email addresses

### Authentication (JWT)
- **Stateless**: No server-side session storage needed
- **Scalable**: Works across multiple server instances
- **Secure**: Bcrypt password hashing + token expiration

### Database (MongoDB)
- **Flexible Schema**: Easy to add features without migrations
- **Cloud-Native**: MongoDB Atlas with auto-scaling
- **Performance**: Fast queries for user data and history

### Why Mistral Devstral 2512?
- **Free Tier**: Cost-effective for users
- **Code-Optimized**: Specifically trained for code analysis
- **Function Calling**: Required for Pydantic AI structured outputs
- **Reliability**: Better success rate than other free models

### Why Pydantic AI?
- **Type Safety**: Structured outputs guarantee consistent responses
- **Validation**: Automatic data validation prevents runtime errors
- **Developer Experience**: Clear, typed interfaces
- **Framework Agnostic**: Works with any Python backend

## 🔐 Security Features

- ✅ **Password Hashing**: Bcrypt with salt
- ✅ **JWT Tokens**: Secure authentication
- ✅ **Email Verification**: Required before app access
- ✅ **CORS**: Properly configured for production
- ✅ **Environment Variables**: Sensitive data not in code
- ✅ **Input Validation**: Pydantic models validate all inputs
- ✅ **Rate Limiting**: Protected against abuse (via OpenRouter)

## ⚠️ Rate Limits & Quotas

### OpenRouter (AI)
- **Free Tier**: 50 requests/day
- **Paid**: $10 for ~1,000 requests
- **Upgrade**: [openrouter.ai/credits](https://openrouter.ai/credits)

### Brevo (Email)
- **Free Tier**: 300 emails/day
- **More than enough** for typical usage

### MongoDB Atlas
- **Free Tier**: 512MB storage
- **Sufficient** for thousands of users

## 🧪 Testing the Application

### Sample Code to Try

**JavaScript (with intentional issues):**
```javascript
function addNumbers(a, b) {
  return a + b;
}

var userPassword = "admin123";
console.log(userPassword);

let data = [];
for (var i = 0; i < 10000; i++) {
  data.push(i);
}
```

**Expected Analysis:**
- Bug: `var` scope issue in loop
- Security: Hardcoded password
- Performance: Inefficient array building
- Refactoring: Use const/let, Array.from()

## 🐛 Troubleshooting

### Backend Issues

**"Email not sending"**
- Verify `BREVO_API_KEY` is set correctly
- Check `FROM_EMAIL` is verified in Brevo dashboard
- Check Render logs for detailed error messages
- Ensure SMTP ports aren't blocked (use Brevo HTTP API)

**"Rate limit exceeded"**
- **Cause**: Free tier limited to 50 requests/day
- **Solution**: Wait 24 hours or upgrade at [openrouter.ai/credits](https://openrouter.ai/credits)

**"MongoDB connection failed"**
- Verify `MONGODB_URL` is correct
- Whitelist your IP in MongoDB Atlas
- Check network access settings

**Port already in use**
- Windows: `netstat -ano | findstr :8000`
- Linux/Mac: `lsof -i :8000`
- Kill process or use different port

### Frontend Issues

**"Cannot connect to backend"**
- Verify `NEXT_PUBLIC_API_URL` environment variable
- Check backend is running (`/health` endpoint)
- Check CORS settings in backend

**Build fails**
- Clear cache: `rm -rf .next`
- Reinstall: `rm -rf node_modules && npm install`
- Verify Node.js 18+

**Email verification not working**
- Check spam/junk folder
- Use "Resend Email" button
- Check Render logs for email sending status
- Ensure backend is running and `/api/chat` endpoint is accessible
### Deployment Issues

**Render: Build fails**
- Set **Root Directory** to `backend`
- Verify all environment variables are set
- Check logs for missing dependencies

**Vercel: Build fails**
- Set **Root Directory** to `frontend`
- Verify `NEXT_PUBLIC_API_URL` is set
- Check build logs for TypeScript errors

**Email not working in production**
- Verify Brevo API key is active
- Check FROM_EMAIL is verified in Brevo
- Ensure FRONTEND_URL matches your actual frontend URL

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rohit BS**
- GitHub: [@BSRohit20](https://github.com/BSRohit20)
- Email: rohitbs2004@gmail.com
- LinkedIn: [Rohit BS](https://linkedin.com/in/rohitbs)

## 🙏 Acknowledgments

- **Pydantic AI** team for the amazing AI framework
- **OpenRouter** for providing free access to powerful AI models
- **Mistral AI** for the Devstral code-optimized model
- **Brevo** for reliable email delivery service
- **Vercel** and **Render** for excellent free hosting
- **MongoDB** for their generous free tier

## 📞 Support

For issues, questions, or suggestions:
- 🐛 [Open an Issue](https://github.com/BSRohit20/codecritic-ai/issues)
- 💬 [Discussions](https://github.com/BSRohit20/codecritic-ai/discussions)
- 📧 Email: rohitbs2004@gmail.com

---

**⭐ If you find this project helpful, please give it a star on GitHub!**

Built with ❤️ using FastAPI, Next.js, and Pydantic AI
  "code": "function example() { return 42; }",
  "language": "javascript",
  "review_context": {},
  "chat_history": []
}
```

Response:
```json
{
  "response": "This function is already optimized with O(1) complexity..."
}
```

## 💾 Local Storage

The application uses browser localStorage for client-side persistence:
- `codeReviewHistory` - Review history (max 50 items)
- `codeSnippets` - Saved code snippets with tags
- `reviewComments` - Collaboration comments

**Note**: Data is stored locally in your browser. Clear cache or use incognito mode will reset this data.

## 🤝 Contributing

This is a hiring assessment project, but feedback is welcome!

1. Fork the repository
2. Create feature branch: `git checkout -b feature/improvement`
3. Commit changes: `git commit -m 'Add improvement'`
4. Push to branch: `git push origin feature/improvement`
5. Open Pull Request

## 📜 License

MIT License - Free to use for assessments and learning!

## 🙏 Acknowledgments

- **Pydantic AI**: Amazing framework for structured AI outputs
- **OpenRouter**: Free access to Llama models
- **FastAPI**: High-performance Python web framework
- **Next.js**: Excellent React framework
- **Vercel & Render**: Free deployment platforms

## 📞 Contact

- **GitHub**: [@BSRohit20](https://github.com/BSRohit20)
- **Project**: [codecritic-ai](https://github.com/BSRohit20/codecritic-ai)

---

**Built with ❤️ and AI for developer productivity**

🚀 **Live Demo**: [codecritic-ai.vercel.app](https://codecritic-ai.vercel.app)

