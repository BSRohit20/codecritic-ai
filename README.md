# AI Code Review Assistant 🚀

A full-stack generative AI application that provides instant, comprehensive code reviews using Pydantic AI. Built for developers who want fast, intelligent feedback on their code quality, security, and performance.

## 🎯 Features

- **Instant Code Analysis**: Get AI-powered reviews in seconds
- **Comprehensive Feedback**:
  - Overall quality score (0-100)
  - Bug detection with severity levels
  - Security vulnerability scanning
  - Performance optimization tips
  - Refactoring suggestions
- **Multi-Language Support**: JavaScript, TypeScript, Python, Java, C++, Go, Rust, PHP, Ruby
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Real-time Results**: See detailed analysis with color-coded categories

## 🏗️ Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **Pydantic AI**: Structured AI agent outputs
- **OpenRouter**: Free AI models (Llama 3.2 3B)
- **Python 3.10+**

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Beautiful icon set

## 📋 Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- OpenRouter API key (free at [openrouter.ai](https://openrouter.ai))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "Potpie AI"
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Add your OpenRouter API key to .env
# OPENROUTER_API_KEY=your_api_key_here
```

### 3. Frontend Setup

```bash
# Navigate to frontend (open new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.local.example .env.local

# Update API URL if needed (default: http://localhost:8000)
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
# Backend runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

### 5. Open in Browser

Visit [http://localhost:3000](http://localhost:3000) and start reviewing code!

## 🔑 Getting OpenRouter API Key

1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up for a free account
3. Navigate to Keys section
4. Create a new API key
5. Copy the key to your `backend/.env` file

**Free Model Used**: `meta-llama/llama-3.2-3b-instruct:free`

## 📦 Deployment

### Deploy Backend (Railway/Render)

**Railway:**
1. Connect GitHub repo to Railway
2. Select `backend` as root directory
3. Add environment variable: `OPENROUTER_API_KEY`
4. Deploy

**Render:**
1. Create new Web Service
2. Connect GitHub repo
3. Root Directory: `backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable: `OPENROUTER_API_KEY`

### Deploy Frontend (Vercel)

1. Connect GitHub repo to Vercel
2. Root Directory: `frontend`
3. Framework Preset: Next.js
4. Add environment variable: `NEXT_PUBLIC_API_URL` (your backend URL)
5. Deploy

## 🎨 Project Structure

```
Potpie AI/
├── backend/
│   ├── main.py              # FastAPI app with Pydantic AI agent
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment template
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Main page
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── CodeEditor.tsx   # Code input component
│   │   ├── ReviewResults.tsx # Results display
│   │   └── LoadingState.tsx # Loading UI
│   ├── package.json
│   └── .env.local.example
└── README.md
```

## 🧪 Testing the App

1. Open the app at http://localhost:3000
2. Paste sample code or use the default example
3. Select programming language
4. Click "Review Code"
5. View comprehensive analysis with:
   - Overall score
   - Strengths
   - Bugs & issues
   - Security vulnerabilities
   - Performance tips
   - Refactoring suggestions

## 🎥 Demo Video Requirements

For submission, record a 1-minute Loom video showing:
1. Your face (required)
2. Live demo of the application
3. Paste code → Click review → Show results
4. Brief explanation of tech stack
5. One unique feature highlight

## 📝 Submission Checklist

- [ ] Live deployed URL (Vercel + Railway/Render)
- [ ] Public GitHub repository
- [ ] 1-minute Loom video with face visible
- [ ] Resume in PDF format
- [ ] All submitted via Google Form

## 🔥 Key Selling Points for Hiring Process

✅ **Full-Stack**: Complete backend + frontend integration  
✅ **Modern Stack**: Latest Next.js, FastAPI, Pydantic AI  
✅ **Production Ready**: Error handling, loading states, validation  
✅ **Great UX**: Smooth animations, responsive, polished design  
✅ **Real Value**: Solves actual developer pain point  
✅ **Scalable**: Clean architecture, modular components  

## 🐛 Troubleshooting

**Backend won't start:**
- Check Python version: `python --version` (need 3.10+)
- Verify API key in `.env` file
- Check port 8000 is not in use

**Frontend won't start:**
- Check Node version: `node --version` (need 18+)
- Clear cache: `rm -rf .next`
- Reinstall: `rm -rf node_modules && npm install`

**CORS errors:**
- Update `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Check backend CORS settings in `main.py`

**API errors:**
- Verify OpenRouter API key is valid
- Check API key has credits
- Review backend logs for errors

## 📧 Support

For issues or questions, check:
- [Pydantic AI Docs](https://ai.pydantic.dev)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Next.js Docs](https://nextjs.org/docs)
- [OpenRouter Docs](https://openrouter.ai/docs)

## 📄 License

MIT License - feel free to use for your assessment!

---

**Built with ❤️ using Pydantic AI**

Good luck with your submission! 🚀
