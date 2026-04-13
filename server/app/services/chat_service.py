from sqlalchemy.orm import Session
from app.models.chat import Chat

def create_chat(db: Session, user_id: str):
    chat = Chat(user_id=user_id)

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return chat

def get_user_chats(db: Session, user_id: str):
    return db.query(Chat).filter(Chat.user_id == user_id).all()

def update_chat_title(db, chat_id, title):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if chat:
        chat.title = title
        db.commit()