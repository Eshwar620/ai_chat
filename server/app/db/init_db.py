from app.db.session import engine
from app.db.base import Base

# Import all models
from app.models import user, chat, message

def init_db():
    Base.metadata.create_all(bind=engine)