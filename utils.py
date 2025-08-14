import os
import openai
from datetime import datetime, timedelta
openai_api_key = os.getenv("OPENAI_API_KEY", None)
if openai_api_key:
    openai.api_key = openai_api_key
def _heuristic_priority_from_text(task_title, task_description, daily_context_text):
    keywords_urgent = ['urgent','asap','today','immediately','deadline','due']
    score = 3.0
    text = (task_title or "") + " " + (task_description or "")
    if any(k in text.lower() for k in keywords_urgent) or any(k in (daily_context_text or "").lower() for k in keywords_urgent):
        score += 4.0
    length = len(task_description or "")
    if length < 40:
        score += 1.0
    elif length < 150:
        score += 0.5
    else:
        score += 0.0
    return max(0.0, min(10.0, score))
def _heuristic_deadline(task_title, task_description, current_task_load=0):
    length = len(task_description or "")
    if length < 40:
        days = 1
    elif length < 150:
        days = 3
    else:
        days = 7
    days += int(current_task_load/3)
    return (datetime.utcnow() + timedelta(days=days)).isoformat() + 'Z'
def generate_ai_suggestions(payload):
    current_task = payload.get('current_task', {})
    daily_context = payload.get('daily_context', [])
    context_text = "\n".join(daily_context)
    current_task_load = int(payload.get('current_task_load', 0))
    if openai_api_key:
        try:
            prompt = f"""You are an assistant to manage tasks.
Daily context:
{context_text}
Current task:
Title: {current_task.get('title','')}
Description: {current_task.get('description','')}
Provide a JSON object with fields:
- priority_score (0-10 number)
- suggested_deadline (ISO8601)
- enhanced_description (string)
- suggested_category (single word)
"""
            resp = openai.ChatCompletion.create(
                model="gpt-4o-mini" if hasattr(openai,'ChatCompletion') else "gpt-4",
                messages=[{"role":"user","content":prompt}],
                temperature=0.2,
                max_tokens=500
            )
            text = resp['choices'][0]['message']['content']
            import re, json
            m = re.search(r'\{.*\}', text, flags=re.S)
            if m:
                parsed = json.loads(m.group(0))
                return parsed
            return {
                "priority_score": _heuristic_priority_from_text(current_task.get('title',''), current_task.get('description',''), context_text),
                "suggested_deadline": _heuristic_deadline(current_task.get('title',''), current_task.get('description',''), current_task_load),
                "enhanced_description": text,
                "suggested_category": "general"
            }
        except Exception:
            pass
    priority = _heuristic_priority_from_text(current_task.get('title',''), current_task.get('description',''), context_text)
    deadline = _heuristic_deadline(current_task.get('title',''), current_task.get('description',''), current_task_load)
    enhanced_description = (current_task.get('description','') or '') + "\n\nContext summary: " + (context_text[:300] + ('...' if len(context_text)>300 else ''))
    suggested_category = "general"
    return {
        "priority_score": priority,
        "suggested_deadline": deadline,
        "enhanced_description": enhanced_description,
        "suggested_category": suggested_category
    }
