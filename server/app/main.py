from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from app.db.init_db import init_db
from app.routes import auth, chat, websocket



# ✅ Define lifespan FIRST
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting up...")
    init_db()
    yield
    print("🛑 Shutting down...")

# ✅ Create app AFTER defining lifespan
app = FastAPI(lifespan=lifespan)
app.include_router(websocket.router)

# ✅ Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Add routes (ONLY ONCE)
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(websocket.router)

# ✅ Root endpoint
@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}