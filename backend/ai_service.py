import google.generativeai as genai
import os

def get_fitness_recommendation(api_key, user_profile, activities, user_query=None):
    """
    Interfaces with Gemini to provide fitness coaching.
    """
    if not api_key:
        return "Error: No API key provided."

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-3.1-flash-lite-preview')
        
        system_prompt = f"""
        You are 'Vitality AI', a safe and supportive personal fitness coach.
        
        USER PROFILE:
        - Name: {user_profile.get('name', 'User')}
        - Goal: {user_profile.get('goal', 'Stay active')}
        - Experience: {user_profile.get('experience', 'Beginner')}
        
        RECENT ACTIVITIES:
        {activities[-5:] if activities else 'No recent activities logged.'}
        
        GUIDELINES:
        1. Always be supportive and encouraging.
        2. Give realistic, achievable advice based on the user's experience level.
        3. Avoid recommending extreme diets or dangerous workout volumes.
        4. If the user mentions pain or injury, advise them to consult a professional.
        5. Include a disclaimer: 'I am an AI coach, not a medical professional.'
        """
        
        prompt = user_query if user_query else "Give me a personalized fitness tip for today based on my profile and recent activities."
        
        response = model.generate_content([system_prompt, prompt])
        return response.text
    except Exception as e:
        return f"Error connecting to AI service: {str(e)}"
