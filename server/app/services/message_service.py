from sqlalchemy.orm import Session
from app.models.message import Message

def save_message(db: Session, chat_id: str, role: str, content: str):
    msg = Message(
        chat_id=chat_id,
        role=role,
        content=content
    )

    db.add(msg)
    db.commit()
    db.refresh(msg)

    return msg

def get_chat_messages(db: Session, chat_id: str):
    return db.query(Message).filter(Message.chat_id == chat_id).all()