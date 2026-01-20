from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
import os
from typing import List, Optional
from dotenv import load_dotenv
import asyncio

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

# Create HTTP client with custom headers to disable streaming
http_client = httpx.AsyncClient(
    timeout=120.0,
    headers={
        "HTTP-Referer": "https://codecritic-ai.vercel.app",
        "X-Title": "CodeCritic AI"
    }
)

model = OpenAIModel(
    model_name="meta-llama/llama-3.3-70b-instruct:free",  # Llama 3.3 70B - back to original
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
5. Security vulnerabilities with risk assessments
6. Performance optimization opportunities
7. Refactoring suggestions for better code quality

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
