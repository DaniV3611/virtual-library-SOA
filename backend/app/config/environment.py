from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

JWT_SECRET=os.getenv("JWT_SECRET")
JWT_EXPIRATION=int(os.getenv("JWT_EXPIRATION"))
