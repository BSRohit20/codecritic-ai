from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
import os
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Code Review Assistant", version="1.0.0")

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

class CodeReviewResult(BaseModel):
    overall_score: int = Field(..., ge=0, le=100, description="Overall code quality score 0-100")
    summary: str = Field(..., description="Brief summary of the code review")
    strengths: List[str] = Field(..., description="What's good about the code")
    bugs: List[Bug] = Field(default_factory=list, description="Detected bugs")
    security_issues: List[SecurityIssue] = Field(default_factory=list, description="Security vulnerabilities")
    performance_tips: List[PerformanceTip] = Field(default_factory=list, description="Performance improvements")
    refactoring_suggestions: List[RefactoringSuggestion] = Field(default_factory=list, description="Refactoring recommendations")

# Request model
class CodeReviewRequest(BaseModel):
    code: str = Field(..., min_length=1, description="Code to review")
    language: str = Field(default="auto", description="Programming language")

# Initialize Pydantic AI Agent
# Using Llama 3.3 70B - free model with function calling support
import httpx

model = OpenAIModel(
    model_name="meta-llama/llama-3.3-70b-instruct:free",  # Free Llama 3.3 70B
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY", ""),
    http_client=httpx.AsyncClient(timeout=60.0)  # 60 second timeout
)

agent = Agent(
    model=model,
    result_type=CodeReviewResult,
    system_prompt="""Expert code reviewer. Analyze code and provide:
1. Quality score (0-100)
2. Brief summary (1-2 sentences)
3. Top 2-3 strengths
4. Critical bugs only (max 5)
5. Security issues (max 3)
6. Performance tips (max 3)
7. Key refactoring suggestions (max 2)

Be concise, specific, and actionable. Focus on critical issues."""
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
        prompt = f"""Review this {request.language} code:

```{request.language}
{request.code}
```

Focus on critical issues. Keep responses brief."""

        # Run the agent with timeout
        result = await agent.run(prompt, model_settings={"max_tokens": 2000})
        
        return result.data
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during code review: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
