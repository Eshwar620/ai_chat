from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi import Body
from app.db.session import get_db
from app.services.chat_service import create_chat, get_user_chats
from app.services.message_service import get_chat_messages
from app.dependencies.auth_dependency import get_current_user
from app.models.chat import Chat

router = APIRouter(prefix="/chat", tags=["Chat"])


# ✅ CREATE NEW CHAT
@router.post("/create")
def create_new_chat(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    chat = create_chat(db, str(user.id))
    return {"chat_id": str(chat.id)}


# ✅ GET ALL CHATS (SIDEBAR)
@router.get("/")
def get_chats(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    chats = get_user_chats(db, str(user.id))

    return [
        {
            "id": str(chat.id),
            "title": chat.title or "New Chat",
            "created_at": chat.created_at
        }
        for chat in chats
    ]


# ✅ GET MESSAGES OF A CHAT (🔥 IMPORTANT FIX)
@router.get("/{chat_id}/messages")
def get_messages(
    chat_id: str,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    messages = get_chat_messages(db, chat_id)

    return [
        {
            "id": str(msg.id),
            "role": msg.role,
            "content": msg.content,
            "created_at": msg.created_at
        }
        for msg in messages
    ]

@router.delete("/{chat_id}")
def delete_chat(chat_id: str, db: Session = Depends(get_db)):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if chat:
        db.delete(chat)
        db.commit()
    return {"message": "Chat deleted"}



@router.put("/{chat_id}")
def update_chat(chat_id: str, data: dict = Body(...), db: Session = Depends(get_db)):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if chat:
        chat.title = data.get("title", chat.title)
        db.commit()
    return {"message": "Chat updated"}