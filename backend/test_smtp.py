import asyncio
import os
from dotenv import load_dotenv
from email_service import send_verification_email

load_dotenv()

async def test():
    result = await send_verification_email("rohitbs2004@gmail.com", "test_token_12345")
    print(f"Result: {result}")

asyncio.run(test())
