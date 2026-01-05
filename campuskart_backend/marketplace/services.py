
import requests
import base64
import json
from django.conf import settings

# Simple function to check with AI
def analyze_image_with_gemini(image_file):
    
    # 1. Check API Key
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return {"error": "API Key is missing."}

    try:
        # 2. Prepare URL
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}"

        # 3. Read image and convert to text (Base64)
        image_data = image_file.read()
        base64_str = base64.b64encode(image_data).decode('utf-8')

        # 4. Ask the AI
        prompt = """
        Analyze this product image.
        Return ONLY valid JSON with:
        - title: Product Name
        - category: One of (Electronics, Books, Furniture, Clothing, Other)
        - description: Short description
        - estimated_price: Number (in INR)
        - price_reasoning: Short reason why
        """

        # 5. Send Request
        payload = {
            "contents": [{
                "parts": [
                    {"text": prompt},
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": base64_str
                        }
                    }
                ]
            }]
        }

        response = requests.post(url, json=payload, headers={'Content-Type': 'application/json'})

        # 6. Parse Response
        if response.status_code != 200:
            return {"error": "AI Server Error"}

        # Get the text answer
        data = response.json()
        answer = data['candidates'][0]['content']['parts'][0]['text']

        # Make sure it's JSON
        if "```json" in answer:
            answer = answer.replace("```json", "").replace("```", "")
            
        return json.loads(answer)

    except Exception as e:
        print(f"Error: {e}")
        return {"error": "Failed to analyze image"}
