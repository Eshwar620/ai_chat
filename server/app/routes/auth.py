from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.user_schema import UserRegister, UserLogin
from app.services.auth_service import register_user, login_user
from app.db.session import get_db
from app.models.user import User  # ✅ IMPORTANT

router = APIRouter(prefix="/auth", tags=["Auth"])


# ✅ REGISTER
@router.post("/register")
def register(data: UserRegister, db: Session = Depends(get_db)):
    user = register_user(db, data.name, data.email, data.password)

    return {
        "message": "User created successfully",
        "user": {
            "name": user.name,
            "email": user.email
        }
    }


# ✅ LOGIN
@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):

    # 🔥 get token
    token = login_user(db, data.email, data.password)

    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 🔥 get user from DB
    user = db.query(User).filter(User.email == data.email).first()

    return {
        "access_token": token,
        "user": {
            "name": user.name,
            "email": user.email
        }
    }