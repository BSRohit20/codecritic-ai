from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import os
from dotenv import load_dotenv

load_dotenv()

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production-min-32-chars")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def truncate_password(password: str, max_bytes: int = 72) -> str:
    """Truncate password to max_bytes ensuring valid UTF-8 and proper byte length"""
    encoded = password.encode('utf-8')
    if len(encoded) <= max_bytes:
        return password
    
    # Truncate byte by byte until we get valid UTF-8 under max_bytes
    for i in range(max_bytes, 0, -1):
        try:
            truncated = encoded[:i].decode('utf-8')
            # Double-check the byte length
            if len(truncated.encode('utf-8')) <= max_bytes:
                return truncated
        except UnicodeDecodeError:
            continue
    
    # Fallback - should never reach here
    return password[:max_bytes]

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    password = truncate_password(plain_password)
    return pwd_context.verify(password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    password = truncate_password(password)
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        return {"email": email, "user_id": payload.get("user_id")}
    except JWTError:
        raise credentials_exception
