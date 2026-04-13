def build_messages(history, user_input):
    messages = []

    for msg in history:
        messages.append({
            "role": msg.role,
            "content": msg.content
        })

    messages.append({
        "role": "user",
        "content": user_input
    })

    return messages