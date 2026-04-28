from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
from pymongo import MongoClient
from dotenv import load_dotenv
from ai_service import get_fitness_recommendation
from guardrails import check_fitness_goal, check_activity_spike, check_overtraining

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Setup
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['vitality_ai']
users_collection = db['users']

@app.route('/register', methods=['POST'])
def register():
    user_info = request.json
    email = user_info.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400
    
    # Store user with hashed password
    new_user = {
        "email": email,
        "password": generate_password_hash(user_info.get('password')),
        "profile": user_info.get('profile', {}),
        "activities": [],
        "water": 0
    }
    users_collection.insert_one(new_user)
    return jsonify({"status": "success", "message": "User registered successfully"})

@app.route('/login', methods=['POST'])
def login():
    creds = request.json
    email = creds.get('email')
    password = creds.get('password')
    
    user = users_collection.find_one({"email": email})
    if user and check_password_hash(user['password'], password):
        return jsonify({
            "status": "success", 
            "profile": user.get('profile', {}),
            "email": email
        })
    
    return jsonify({"error": "Invalid email or password"}), 401

@app.route('/profile', methods=['POST'])
def update_profile():
    email = request.headers.get('x-user-email')
    if not email: return jsonify({"error": "Unauthorized"}), 401
    
    user = users_collection.find_one({"email": email})
    if not user: return jsonify({"error": "User not found"}), 404
    
    new_profile = request.json
    
    # Run guardrails on goal if applicable
    warning = None
    try:
        if all(k in new_profile for k in ['current_weight', 'target_weight', 'weeks']):
            warning = check_fitness_goal(
                float(new_profile['current_weight']), 
                float(new_profile['target_weight']), 
                int(new_profile['weeks'])
            )
    except (ValueError, TypeError):
        pass
    
    users_collection.update_one({"email": email}, {"$set": {"profile": new_profile}})
    
    return jsonify({
        "status": "success", 
        "profile": new_profile,
        "warning": warning
    })

@app.route('/activities', methods=['GET'])
def get_activities():
    email = request.headers.get('x-user-email')
    if not email: return jsonify([])
    
    user = users_collection.find_one({"email": email})
    if not user: return jsonify([])
    
    return jsonify(user.get('activities', []))

@app.route('/log-activity', methods=['POST'])
def log_activity():
    email = request.headers.get('x-user-email')
    if not email: return jsonify({"error": "Unauthorized"}), 401
    
    user = users_collection.find_one({"email": email})
    if not user: return jsonify({"error": "User not found"}), 404
    
    activity = request.json
    user_activities = user.get('activities', [])
    
    # Calculate recent average for spike detection
    recent_durations = [a['duration'] for a in user_activities[-5:]]
    avg_duration = sum(recent_durations) / len(recent_durations) if recent_durations else 0
    
    warning = check_activity_spike(avg_duration, activity['duration'])
    
    # Push activity to the array in MongoDB
    users_collection.update_one({"email": email}, {"$push": {"activities": activity}})
    
    # Check for overtraining after logging
    # Note: Using the updated list for check
    updated_activities = user_activities + [activity]
    weekly_sessions = len(updated_activities) 
    total_duration = sum(a['duration'] for a in updated_activities)
    overtraining_caution = check_overtraining(weekly_sessions, total_duration)
    
    return jsonify({
        "status": "success", 
        "warning": warning,
        "overtraining": overtraining_caution
    })

@app.route('/get-milestone', methods=['POST'])
def get_milestone():
    api_key = request.headers.get('x-api-key')
    email = request.headers.get('x-user-email')
    if not api_key or not email:
        return jsonify({"error": "Missing credentials"}), 401
    
    user = users_collection.find_one({"email": email})
    if not user: return jsonify({"error": "User not found"}), 404
    
    user_query = "Based on my logs and profile, give me a single, highly personalized fitness milestone or achievement insight in 2 sentences. Focus on my progress or upcoming goals. Mention specific numbers from my logs if possible."
    
    recommendation = get_fitness_recommendation(
        api_key, 
        user.get('profile', {}), 
        user.get('activities', []),
        user_query
    )
    
    return jsonify({"milestone": recommendation})

@app.route('/get-recommendation', methods=['POST'])
def get_recommendation():
    api_key = request.headers.get('x-api-key')
    email = request.headers.get('x-user-email')
    if not api_key or not email:
        return jsonify({"error": "Missing credentials"}), 401
    
    user = users_collection.find_one({"email": email})
    if not user: return jsonify({"error": "User not found"}), 404
    
    user_query = request.json.get('query')
    
    recommendation = get_fitness_recommendation(
        api_key, 
        user.get('profile', {}), 
        user.get('activities', []),
        user_query
    )
    
    return jsonify({"recommendation": recommendation})
    
@app.route('/get-water', methods=['GET'])
def get_water():
    email = request.headers.get('x-user-email')
    if not email: return jsonify({"glasses": 0})
    
    user = users_collection.find_one({"email": email})
    if not user: return jsonify({"glasses": 0})
    
    return jsonify({"glasses": user.get('water', 0)})

@app.route('/log-water', methods=['POST'])
def log_water():
    email = request.headers.get('x-user-email')
    if not email: return jsonify({"error": "Unauthorized"}), 401
    
    user = users_collection.find_one({"email": email})
    if not user: return jsonify({"error": "User not found"}), 404
    
    glasses = request.json.get('glasses', 0)
    users_collection.update_one({"email": email}, {"$set": {"water": glasses}})
    
    return jsonify({"status": "success", "glasses": glasses})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
