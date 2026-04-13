from openai import OpenAI
from app.core.config import settings

# ✅ Initialize client safely
client = OpenAI(api_key=settings.OPENAI_API_KEY)


def get_ai_response(messages):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # ✅ fast & cost-effective
            messages=messages,
            temperature=0.7,      # ✅ more natural responses
        )

        return response.choices[0].message.content

    except Exception as e:
        print("❌ OpenAI Error:", e)

        # ✅ fallback response (VERY IMPORTANT)
        return "⚠️ AI is currently unavailable. Please try again."