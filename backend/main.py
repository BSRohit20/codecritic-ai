from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
import os
from typing import List, Optional
from dotenv import load_dotenv
import asyncio
from datetime import datetime, timedelta
from database import connect_to_mongo, close_mongo_connection, get_users_collection, database
from auth import get_password_hash, verify_password, create_access_token, get_current_user
import httpx
from bson.objectid import ObjectId

load_dotenv()

app = FastAPI(title="AI Code Review Assistant", version="1.0.0")

# Lifecycle events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for structured outputs
class Bug(BaseModel):
    line: Optional[int] = Field(None, description="Line number where bug exists")
    severity: str = Field(..., description="Severity: critical, high, medium, low")
    description: str = Field(..., description="Description of the bug")
    suggestion: str = Field(..., description="Suggested fix")

class SecurityIssue(BaseModel):
    line: Optional[int] = Field(None, description="Line number of security issue")
    severity: str = Field(..., description="Risk level: critical, high, medium, low")
    description: str = Field(..., description="Type of security vulnerability")
    recommendation: str = Field(..., description="How to fix the security issue")

class PerformanceTip(BaseModel):
    line: Optional[int] = Field(None, description="Line number of performance issue")
    description: str = Field(..., description="Description of performance concern")
    optimization: str = Field(..., description="Optimization suggestion")

class RefactoringSuggestion(BaseModel):
    line_range: str = Field(..., description="Line range like '10-15'")
    description: str = Field(..., description="What needs refactoring and why")
    current_code: str = Field(..., description="Current problematic code snippet")
    improved_code: str = Field(..., description="Improved code after refactoring")

class ComplexityAnalysis(BaseModel):
    time_complexity: str = Field(..., description="Big O time complexity like O(n), O(n^2)")
    space_complexity: str = Field(..., description="Big O space complexity")
    explanation: str = Field(..., description="Explanation of complexity analysis")
    optimization_potential: str = Field(..., description="Potential for optimization")

class CodeReviewResult(BaseModel):
    overall_score: int = Field(..., ge=0, le=100, description="Overall code quality score 0-100")
    summary: str = Field(..., description="Brief summary of the code review")
    strengths: List[str] = Field(..., description="What's good about the code")
    bugs: List[Bug] = Field(default_factory=list, description="Detected bugs")
    security_issues: List[SecurityIssue] = Field(default_factory=list, description="Security vulnerabilities")
    performance_tips: List[PerformanceTip] = Field(default_factory=list, description="Performance improvements")
    refactoring_suggestions: List[RefactoringSuggestion] = Field(default_factory=list, description="Refactoring recommendations")
    complexity_analysis: Optional[ComplexityAnalysis] = Field(None, description="Algorithm complexity analysis")

# Request model
class CodeReviewRequest(BaseModel):
    code: str = Field(..., min_length=1, description="Code to review")
    language: str = Field(default="auto", description="Programming language")

# Initialize Pydantic AI Agent
# Using Llama 3.3 70B - free model with function calling support
import httpx

# Create HTTP client with custom headers to disable streaming
http_client = httpx.AsyncClient(
    timeout=120.0,
    headers={
        "HTTP-Referer": "https://codecritic-ai.vercel.app",
        "X-Title": "CodeCritic AI"
    }
)

model = OpenAIModel(
    model_name="mistralai/devstral-2512:free",  # Mistral Devstral 2512 - trying another free model
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY", ""),
    http_client=http_client
)

agent = Agent(
    model=model,
    result_type=CodeReviewResult,
    system_prompt="""You are an expert code reviewer with deep knowledge across multiple programming languages.
    
Your task is to thoroughly review code and provide:
1. An overall quality score (0-100) based on: correctness, readability, maintainability, performance, security
2. A concise summary of the code's purpose and quality
3. Specific strengths of the code
4. Bugs and issues with severity levels
5. Security vulnerabilities with risk assessments - ALWAYS scan for common security issues like:
   - SQL injection vulnerabilities
   - XSS (Cross-Site Scripting) risks
   - Authentication/authorization flaws
   - Insecure data handling
   - Hard-coded credentials
   - Missing input validation
   - Insecure dependencies
6. Performance optimization opportunities
7. Refactoring suggestions for better code quality
8. Algorithm complexity analysis (Big O notation for time and space complexity)

IMPORTANT: You must ALWAYS check for security issues. If the code looks secure, you can return an empty security_issues list, but always perform the scan.
When analyzing algorithms or loops, provide complexity analysis with time/space complexity.
Be constructive, specific, and actionable. Focus on real issues, not nitpicks.
Provide line numbers when possible. Be encouraging about good practices while highlighting improvements.
"""
)

@app.get("/")
async def root():
    return {
        "message": "AI Code Review Assistant API",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "api_configured": bool(os.getenv("OPENROUTER_API_KEY"))}

@app.post("/api/review", response_model=CodeReviewResult)
async def review_code(request: CodeReviewRequest):
    """
    Review code and return structured feedback
    """
    try:
        if not os.getenv("OPENROUTER_API_KEY"):
            raise HTTPException(
                status_code=500,
                detail="OpenRouter API key not configured"
            )
        
        # Create the review prompt
        prompt = f"""Review the following {request.language} code:

```{request.language}
{request.code}
```

Provide a comprehensive code review with scores, bugs, security issues, performance tips, and refactoring suggestions."""

        # Run the agent with retry logic
        max_retries = 3
        last_error = None
        
        for attempt in range(max_retries):
            try:
                # Disable streaming explicitly with proper parameter name
                # OpenAI API uses 'stream' parameter
                result = await agent.run(
                    prompt,
                    model_settings={
                        "stream": False,
                        "temperature": 0.7,
                        "max_tokens": 2000
                    },
                    infer_name=False  # Avoid extra API calls
                )
                
                # Validate result has required data
                if result and hasattr(result, 'data') and result.data:
                    # Additional validation of data structure
                    data = result.data
                    if not isinstance(data, CodeReviewResult):
                        # Try to convert if it's a dict
                        if isinstance(data, dict):
                            data = CodeReviewResult(**data)
                        else:
                            raise ValueError(f"Invalid response type: {type(data)}")
                    
                    # Ensure overall_score is an integer
                    if not isinstance(data.overall_score, int):
                        if data.overall_score is None:
                            data.overall_score = 70  # Default score
                        else:
                            data.overall_score = int(float(data.overall_score))
                    
                    return data
                else:
                    last_error = "Empty or invalid response from AI model"
                    if attempt < max_retries - 1:
                        await asyncio.sleep(2)  # Wait before retry
                        continue
                        
            except ValueError as ve:
                last_error = f"Data validation error: {str(ve)}"
                if attempt < max_retries - 1:
                    await asyncio.sleep(2)
                    continue
            except Exception as e:
                last_error = f"{type(e).__name__}: {str(e)}"
                if attempt < max_retries - 1:
                    await asyncio.sleep(2)
                    continue
                    
        raise HTTPException(
            status_code=503,
            detail=f"AI service unavailable after {max_retries} attempts. The free model may be overloaded. Please try again in a few moments. Error: {last_error}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during code review: {str(e)}"
        )

# Chat endpoint for follow-up questions
class ChatRequest(BaseModel):
    message: str = Field(..., description="User's question")
    code: str = Field(..., description="The code being discussed")
    language: str = Field(..., description="Programming language")
    review_context: dict = Field(..., description="Previous review results")
    chat_history: List[dict] = Field(default_factory=list, description="Previous messages")

@app.post("/api/chat")
async def chat_about_review(request: ChatRequest):
    """
    Interactive chat about code review results
    """
    try:
        if not os.getenv("OPENROUTER_API_KEY"):
            raise HTTPException(status_code=500, detail="API key not configured")
        
        # Create chat agent for follow-up questions
        chat_agent = Agent(
            model=model,
            result_type=str,
            system_prompt=f"""You are a helpful AI code review assistant. A user has received a code review and has follow-up questions.

Code being discussed:
```{request.language}
{request.code}
```

Review Summary:
- Quality Score: {request.review_context.get('overall_score', 'N/A')}/100
- Bugs Found: {len(request.review_context.get('bugs', []))}
- Security Issues: {len(request.review_context.get('security_issues', []))}
- Performance Tips: {len(request.review_context.get('performance_tips', []))}

Provide helpful, detailed answers to the user's questions about their code review.
Be specific and reference line numbers when relevant. Provide code examples when helpful."""
        )
        
        # Build conversation context
        conversation = "\n".join([
            f"{'User' if msg['role'] == 'user' else 'Assistant'}: {msg['content']}"
            for msg in request.chat_history[-6:]  # Last 6 messages
        ])
        
        prompt = f"{conversation}\nUser: {request.message}"
        
        result = await chat_agent.run(prompt)
        
        return {"response": result.data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

# ==================== AUTH ENDPOINTS ====================

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    captcha_token: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    captcha_token: str

class CaptchaVerify(BaseModel):
    token: str

@app.post("/api/auth/verify-captcha")
async def verify_captcha(request: CaptchaVerify):
    """Verify Google reCAPTCHA token"""
    try:
        recaptcha_secret = os.getenv("RECAPTCHA_SECRET_KEY")
        if not recaptcha_secret:
            # For development, skip verification
            return {"success": True, "score": 0.9}
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://www.google.com/recaptcha/api/siteverify",
                data={
                    "secret": recaptcha_secret,
                    "response": request.token
                }
            )
            result = response.json()
            return {
                "success": result.get("success", False),
                "score": result.get("score", 0)
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CAPTCHA verification failed: {str(e)}")

@app.post("/api/auth/register")
async def register(user: UserRegister):
    """Register a new user"""
    try:
        users_collection = get_users_collection()
        
        # Verify CAPTCHA (in production)
        # captcha_result = await verify_captcha(CaptchaVerify(token=user.captcha_token))
        # if not captcha_result["success"]:
        #     raise HTTPException(status_code=400, detail="CAPTCHA verification failed")
        
        # Check if user already exists
        existing_user = await users_collection.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create user
        hashed_password = get_password_hash(user.password)
        user_doc = {
            "email": user.email,
            "name": user.name,
            "password": hashed_password,
            "created_at": datetime.utcnow(),
            "is_active": True
        }
        
        result = await users_collection.insert_one(user_doc)
        user_id = str(result.inserted_id)
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user.email, "user_id": user_id}
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "email": user.email,
                "name": user.name
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/api/auth/login")
async def login(user: UserLogin):
    """Login user"""
    try:
        users_collection = get_users_collection()
        
        # Verify CAPTCHA (in production)
        # captcha_result = await verify_captcha(CaptchaVerify(token=user.captcha_token))
        # if not captcha_result["success"]:
        #     raise HTTPException(status_code=400, detail="CAPTCHA verification failed")
        
        # Find user
        db_user = await users_collection.find_one({"email": user.email})
        if not db_user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Verify password
        if not verify_password(user.password, db_user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Create access token
        user_id = str(db_user["_id"])
        access_token = create_access_token(
            data={"sub": user.email, "user_id": user_id}
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "email": db_user["email"],
                "name": db_user["name"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@app.get("/api/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    try:
        users_collection = get_users_collection()
        from bson.objectid import ObjectId
        
        db_user = await users_collection.find_one({"email": current_user["email"]})
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "id": str(db_user["_id"]),
            "email": db_user["email"],
            "name": db_user["name"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user: {str(e)}")

# ==================== REVIEW HISTORY ENDPOINTS ====================

@app.post("/api/history/save")
async def save_review_history(
    request: dict,
    current_user: dict = Depends(get_current_user)
):
    """Save a code review to user's history"""
    try:
        db = database.client[os.getenv("DATABASE_NAME", "codecritic")]
        history_collection = db.review_history
        
        history_item = {
            "user_id": current_user["user_id"],
            "timestamp": datetime.utcnow(),
            "language": request.get("language"),
            "code_snippet": request.get("code", "")[:200],  # Store first 200 chars
            "full_code": request.get("code", ""),
            "result": request.get("result"),
        }
        
        result = await history_collection.insert_one(history_item)
        
        return {
            "success": True,
            "id": str(result.inserted_id)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save history: {str(e)}")

@app.get("/api/history")
async def get_review_history(
    limit: int = 50,
    current_user: dict = Depends(get_current_user)
):
    """Get user's review history"""
    try:
        db = database.client[os.getenv("DATABASE_NAME", "codecritic")]
        history_collection = db.review_history
        
        cursor = history_collection.find(
            {"user_id": current_user["user_id"]}
        ).sort("timestamp", -1).limit(limit)
        
        history = []
        async for item in cursor:
            history.append({
                "id": str(item["_id"]),
                "timestamp": item["timestamp"].isoformat(),
                "language": item.get("language"),
                "codeSnippet": item.get("code_snippet", ""),
                "result": item.get("result")
            })
        
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get history: {str(e)}")

@app.delete("/api/history/{history_id}")
async def delete_review_history(
    history_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a specific review from history"""
    try:
        db = database.client[os.getenv("DATABASE_NAME", "codecritic")]
        history_collection = db.review_history
        
        result = await history_collection.delete_one({
            "_id": ObjectId(history_id),
            "user_id": current_user["user_id"]
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="History item not found")
        
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete history: {str(e)}")

@app.delete("/api/history")
async def clear_review_history(current_user: dict = Depends(get_current_user)):
    """Clear all review history for the user"""
    try:
        db = database.client[os.getenv("DATABASE_NAME", "codecritic")]
        history_collection = db.review_history
        
        result = await history_collection.delete_many({
            "user_id": current_user["user_id"]
        })
        
        return {
            "success": True,
            "deleted_count": result.deleted_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear history: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
