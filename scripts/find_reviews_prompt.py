import json

transcript_path = r'C:\Users\Admin\.gemini\antigravity\brain\5ebe793b-d55b-46c2-acd3-35db97bfd706\.system_generated\logs\transcript_full.jsonl'
with open(transcript_path, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT':
            content = data.get('content', '')
            step = data.get('step_index')
            if 'What Our Customers Say' in content or 'Ranjith' in content:
                print(f"Found at line {idx}, step {step}, len {len(content)}")
                with open('full_user_reviews_prompt.txt', 'w', encoding='utf-8') as out:
                    out.write(content)
                print("Written to full_user_reviews_prompt.txt")

