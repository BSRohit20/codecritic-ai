from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "codecritic")

# Async MongoDB client for FastAPI
class Database:
    client: AsyncIOMotorClient = None
    
database = Database()

async def get_database():
    return database.client[DATABASE_NAME]

async def connect_to_mongo():
    """Connect to MongoDB on startup"""
    # Let pymongo auto-detect SSL from mongodb+srv:// URI
    database.client = AsyncIOMotorClient(MONGODB_URL)
    print(f"Connected to MongoDB at {MONGODB_URL}")
    
async def close_mongo_connection():
    """Close MongoDB connection on shutdown"""
    database.client.close()
    print("Closed MongoDB connection")

def get_users_collection():
    """Get users collection"""
    db = database.client[DATABASE_NAME]
    return db.users
