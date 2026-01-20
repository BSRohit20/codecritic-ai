# CodeCritic AI 🚀

An intelligent, full-stack AI-powered code review assistant built with Pydantic AI and modern web technologies. Get instant, comprehensive feedback on code quality, security vulnerabilities, performance issues, and refactoring opportunities.

## 🌐 Live Demo

- **Frontend**: [https://codecritic-ai.vercel.app](https://codecritic-ai.vercel.app)
- **Backend API**: [https://codecritic-ai-backend.onrender.com](https://codecritic-ai-backend.onrender.com)
- **GitHub**: [https://github.com/BSRohit20/codecritic-ai](https://github.com/BSRohit20/codecritic-ai)

## ✨ Key Features

### 🎯 Comprehensive Code Analysis
- **Quality Scoring**: Get an overall code quality score (0-100)
- **Bug Detection**: Identify potential bugs with severity ratings (critical, high, medium, low)
- **Security Scanning**: Detect security vulnerabilities and get remediation advice
- **Performance Tips**: Receive optimization suggestions to improve code efficiency
- **Refactoring Guidance**: View side-by-side code comparisons for better implementations

### 🎨 Premium User Experience
- **Line Numbers**: Professional code editor with line numbering
- **One-Click Copy**: Copy suggestions directly to clipboard with visual feedback
- **Side-by-Side Comparison**: View current vs. improved code for refactoring suggestions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Loading States**: Smooth animations while AI analyzes your code
- **Multi-Language Support**: JavaScript, TypeScript, Python, Java, C++, Go, Rust, PHP, Ruby

### 🤖 Powered by Advanced AI
- **Pydantic AI**: Structured, type-safe AI outputs
- **Mistral Devstral 2512**: Free, powerful AI model optimized for code via OpenRouter
- **Intelligent Retries**: Automatic retry logic for reliability
- **Detailed Error Handling**: Clear feedback when issues occur

### ⚠️ Important: Rate Limits
- **Free Tier**: 50 requests per day (resets every 24 hours)
- **Paid Tier**: Add 10 credits (~$10) for 1,000 requests per day
- **Upgrade**: Visit [OpenRouter Credits](https://openrouter.ai/credits) to add credits

## 🏗️ Tech Stack

### Backend
- **FastAPI 0.115.0**: High-performance async Python web framework
- **Pydantic AI 0.0.14**: Type-safe AI agent with structured outputs
- **OpenRouter API**: Access to Mistral Devstral 2512 (free tier, code-optimized)
- **Python 3.13.4**: Latest Python with improved performance
- **Uvicorn**: Lightning-fast ASGI server

### Frontend
- **Next.js 15.5.9**: React framework with App Router and server components
- **React 18.3.1**: Modern React with concurrent features
- **TypeScript**: Full type safety across the application
- **Tailwind CSS 3.4.0**: Utility-first CSS framework
- **Lucide React**: Beautiful, consistent icon library

### Deployment & DevOps
- **Vercel**: Frontend hosting with automatic deployments
- **Render**: Backend hosting with auto-deploy from GitHub
- **Git & GitHub**: Version control and CI/CD

## 📋 Prerequisites

- Python 3.10+ (3.13.4 recommended)
- Node.js 18+ 
- OpenRouter API key (free at [openrouter.ai](https://openrouter.ai))

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

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API key
echo OPENROUTER_API_KEY=your_key_here > .env
```

**Get your free OpenRouter API key:**
1. Visit [openrouter.ai](https://openrouter.ai)
2. Sign up (free)
3. Go to Keys section
4. Create new API key
5. Copy to `.env` file

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
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
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
│   ├── main.py              # FastAPI application with Pydantic AI agent
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Environment variables (not in git)
│   └── .gitignore          # Python/backend ignores
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Main application page
│   │   ├── layout.tsx       # Root layout with metadata
│   │   ├── globals.css      # Global styles
│   │   └── favicon.ico      # App icon
│   ├── components/
│   │   ├── CodeEditor.tsx   # Code input with line numbers
│   │   ├── ReviewResults.tsx # AI review display with copy buttons
│   │   └── LoadingState.tsx  # Loading animation
│   ├── package.json         # Node dependencies
│   ├── tsconfig.json        # TypeScript configuration
│   ├── tailwind.config.ts   # Tailwind CSS configuration
│   ├── next.config.js       # Next.js configuration
│   └── .gitignore          # Node/frontend ignores
│
├── README.md               # This file
├── render.yaml            # Render deployment config
└── .gitignore            # Root gitignore
```

## 🎯 How to Use

1. **Open the App**: Visit [codecritic-ai.vercel.app](https://codecritic-ai.vercel.app)
2. **Paste Your Code**: Copy code you want reviewed into the editor
3. **Select Language**: Choose from 9 supported languages
4. **Click "Review Code"**: Wait 10-30 seconds for AI analysis
5. **View Results**: See comprehensive feedback with:
   - ✅ Overall quality score
   - 💡 Code strengths
   - 🐛 Bugs with severity levels
   - 🔒 Security vulnerabilities
   - ⚡ Performance optimizations
   - 🔄 Refactoring suggestions (with side-by-side code comparison)
6. **Copy Suggestions**: Use copy buttons to grab specific recommendations

## 🔧 Key Technical Decisions

### Why Llama 3.3 70B?
- **Function Calling Support**: Required for Pydantic AI structured outputs
- **Free Tier**: Cost-effective for demonstration
- **Quality**: 70B parameters provide detailed, accurate reviews
- **Reliability**: Tested multiple models; this one had best success rate

### Why Pydantic AI?
- **Type Safety**: Structured outputs guarantee consistent response format
- **Validation**: Automatic data validation prevents runtime errors
- **Developer Experience**: Clear, typed interfaces for AI responses
- **Framework Agnostic**: Works with any Python backend

### Architecture Highlights
- **Separation of Concerns**: Clear backend/frontend split
- **Type Safety**: TypeScript frontend + Pydantic backend
- **Error Handling**: Retry logic, timeouts, clear error messages
- **User Experience**: Loading states, copy buttons, responsive design
- **Production Ready**: CORS configured, environment variables, deployment configs

## 🧪 Testing the Application

### Sample Code to Try:

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

## 🎥 Demo Video

For hiring assessment submission, create 1-minute Loom video showing:
1. ✅ Your face visible (required)
2. 🖥️ Live demo of deployed app
3. 📝 Paste code → Submit → View results
4. 💬 Brief tech stack mention
5. ✨ Highlight unique feature (e.g., side-by-side comparison)

## � Unique Features & Selling Points

### For Hiring Assessment:
✅ **Full-Stack Mastery**: Complete end-to-end implementation  
✅ **Modern Tech Stack**: Latest Next.js 15, FastAPI, Pydantic AI  
✅ **Production-Grade**: Deployed, live, and functional  
✅ **Excellent UX**: Line numbers, copy buttons, side-by-side comparisons  
✅ **Real Problem Solved**: Addresses actual developer pain points  
✅ **Clean Architecture**: Modular, maintainable, scalable code  
✅ **Error Resilience**: Retry logic, timeout handling, clear error messages  
✅ **Type Safety**: Full TypeScript + Pydantic validation  

### Standout Features:
1. **Side-by-Side Code Comparison**: Unique visual refactoring suggestions
2. **One-Click Copy**: Every suggestion has instant clipboard copy
3. **Line Numbers in Editor**: Professional code editor experience
4. **Intelligent Retries**: Handles API failures gracefully
5. **Multi-Severity Ratings**: Critical/High/Medium/Low issue classification
6. **Comprehensive Analysis**: Bugs, security, performance, refactoring in one view

## 🐛 Troubleshooting

### Backend Issues

**"Rate limit exceeded" errors**
- **Cause**: Free tier limited to 50 requests per day
- **Solutions**:
  1. Wait for rate limit to reset (24 hours from first request)
  2. Add 10 credits to your OpenRouter account for 1,000 requests/day
  3. Use a different OpenRouter account temporarily
- **Check limit reset time**: Look at error message for reset timestamp
- **Upgrade**: Visit [openrouter.ai/credits](https://openrouter.ai/credits)

**"ModuleNotFoundError: No module named '_griffe'"**
- Solution: Pin griffe to version 1.5.0 (already in requirements.txt)
- Run: `pip install griffe==1.5.0`

**"Empty model response" errors**
- Cause: Free model rate limits or overload
- Solution: Retry after a few seconds (automatic retry logic included)
- Alternative: Consider upgrading to paid model if persistent

**Port already in use**
- Check: `netstat -ano | findstr :8000` (Windows)
- Kill process or use different port in main.py

### Frontend Issues

**CORS errors**
- Verify `NEXT_PUBLIC_API_URL` points to correct backend
- Check backend CORS middleware allows your frontend origin

**Build fails**
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Verify Node.js version: `node --version` (need 18+)

**Type errors**
- Ensure frontend interfaces match backend Pydantic models exactly
- Check imports and paths

### Deployment Issues

**Render: "Cannot find main.py"**
- Solution: Set Root Directory to `backend` in Render dashboard
- Settings → Root Directory → `backend` → Save

**Vercel: Build fails**
- Check Root Directory is set to `frontend`
- Verify all environment variables are set
- Check build logs for specific errors

## 📚 API Documentation

### Endpoints

**GET /**
```json
{
  "message": "AI Code Review Assistant API",
  "version": "1.0.0",
  "status": "healthy"
}
```

**GET /health**
```json
{
  "status": "healthy",
  "api_configured": true
}
```

**POST /api/review**

Request:
```json
{
  "code": "function example() { return 42; }",
  "language": "javascript"
}
```

Response:
```json
{
  "overall_score": 85,
  "summary": "Clean function with good practices",
  "strengths": ["Clear function name", "Simple logic"],
  "bugs": [],
  "security_issues": [],
  "performance_tips": [],
  "refactoring_suggestions": []
}
```

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

