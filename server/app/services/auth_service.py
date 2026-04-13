from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token

def register_user(db: Session, name: str, email: str, password: str):
    hashed = hash_password(password)

    user = User(
        name=name,
        email=email,
        password_hash=hashed
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def login_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    token = create_access_token({"user_id": str(user.id)})

    return token