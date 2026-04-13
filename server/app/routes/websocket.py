from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from openai import OpenAI

from app.db.session import get_db
from app.services.message_service import save_message, get_chat_messages
from app.services.langchain_service import build_messages
from app.services.chat_service import update_chat_title
from app.core.config import settings
from app.models.chat import Chat

router = APIRouter()

# ✅ OpenAI client
client = OpenAI(api_key=settings.OPENAI_API_KEY)


@router.websocket("/ws/chat/{chat_id}")
async def chat_socket(websocket: WebSocket, chat_id: str):
    await websocket.accept()

    db_gen = get_db()
    db: Session = next(db_gen)

    try:
        while True:
            user_message = await websocket.receive_text()
            print("📩 Received:", user_message)

            # ✅ Ignore empty messages
            if not user_message.strip():
                continue

            # 🔒 CHECK CHAT EXISTS (🔥 FIXED)
            chat = db.query(Chat).filter(Chat.id == chat_id).first()

            if not chat:
                print("❌ Chat not found:", chat_id)
                await websocket.send_text("⚠️ Chat not found. Please create a new chat.")
                continue

            # ✅ Get history FIRST
            history = get_chat_messages(db, chat_id)

            # 🔥 Auto title (ONLY first message)
            if len(history) == 0:
                short_title = user_message[:30]
                update_chat_title(db, chat_id, short_title)

            # ✅ Save user message
            save_message(db, chat_id, "user", user_message)

            # ✅ Get updated history
            history = get_chat_messages(db, chat_id)

            # ✅ Build prompt
            messages = build_messages(history, user_message)
            print("🧠 Sending to AI:", messages)

            # 🔥 STREAMING RESPONSE
            stream = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                stream=True
            )

            full_response = ""

            for chunk in stream:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    full_response += content

                    await websocket.send_text(content)

            print("🤖 Full AI Response:", full_response)

            # ✅ Save AI response
            save_message(db, chat_id, "assistant", full_response)

    except WebSocketDisconnect:
        print(f"🔌 Client disconnected: {chat_id}")

    except Exception as e:
        print("❌ Error:", e)
        await websocket.close()

    finally:
        try:
            db.close()
        except:
            pass