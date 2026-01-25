"""
Test MongoDB Atlas connection
Run: python test_mongo.py
"""
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")

print(f"Testing connection to: {MONGODB_URL}")

try:
    # Test connection
    client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
    
    # Trigger connection
    client.admin.command('ping')
    
    print("✅ Successfully connected to MongoDB Atlas!")
    
    # List databases
    dbs = client.list_database_names()
    print(f"Available databases: {dbs}")
    
    # Test codecritic database
    db = client['codecritic']
    print(f"Collections in codecritic: {db.list_collection_names()}")
    
    client.close()
    
except Exception as e:
    print(f"❌ Connection failed: {e}")
