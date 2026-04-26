from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from ai_service import get_fitness_recommendation
from guardrails import check_fitness_goal, check_activity_spike, check_overtraining

app = Flask(__name__)
CORS(app)

DATA_FILE = 'data.json'

def load_data():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                content = json.load(f)
                # If it's the old single-user format, migrate it
                if "users" not in content:
                    return {"users": {}}
                return content
        except:
            return {"users": {}}
    return {"users": {}}

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

@app.route('/register', methods=['POST'])
def register():
    data = load_data()
    user_info = request.json
    email = user_info.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    if email in data['users']:
        return jsonify({"error": "User already exists"}), 400
    
    # Store user with password and initial empty profile/activities/water
    data['users'][email] = {
        "password": user_info.get('password'),
        "profile": user_info.get('profile', {}),
        "activities": [],
        "water": 0
    }
    save_data(data)
    return jsonify({"status": "success", "message": "User registered successfully"})

@app.route('/login', methods=['POST'])
def login():
    data = load_data()
    creds = request.json
    email = creds.get('email')
    password = creds.get('password')
    
    if email in data['users'] and data['users'][email]['password'] == password:
        user_data = data['users'][email]
        return jsonify({
            "status": "success", 
            "profile": user_data['profile'],
            "email": email
        })
    
    return jsonify({"error": "Invalid email or password"}), 401

@app.route('/profile', methods=['POST'])
def update_profile():
    email = request.headers.get('x-user-email')
    if not email: return jsonify({"error": "Unauthorized"}), 401
    
    data = load_data()
    if email not in data['users']: return jsonify({"error": "User not found"}), 404
    
    new_profile = request.json
    
    # Run guardrails on goal if applicable (only if all fields are present)
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
    
    data['users'][email]['profile'] = new_profile
    save_data(data)
    
    return jsonify({
        "status": "success", 
        "profile": data['users'][email]['profile'],
        "warning": warning
    })

@app.route('/activities', methods=['GET'])
def get_activities():
    email = request.headers.get('x-user-email')
    if not email: return jsonify([])
    
    data = load_data()
    if email not in data['users']: return jsonify([])
    
    return jsonify(data['users'][email]['activities'])

@app.route('/log-activity', methods=['POST'])
def log_activity():
    email = request.headers.get('x-user-email')
    if not email: return jsonify({"error": "Unauthorized"}), 401
    
    data = load_data()
    if email not in data['users']: return jsonify({"error": "User not found"}), 404
    
    activity = request.json
    user_activities = data['users'][email]['activities']
    
    # Calculate recent average for spike detection
    recent_durations = [a['duration'] for a in user_activities[-5:]]
    avg_duration = sum(recent_durations) / len(recent_durations) if recent_durations else 0
    
    warning = check_activity_spike(avg_duration, activity['duration'])
    
    user_activities.append(activity)
    save_data(data)
    
    # Check for overtraining after logging
    weekly_sessions = len(user_activities) 
    total_duration = sum(a['duration'] for a in user_activities)
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
    
    data = load_data()
    if email not in data['users']: return jsonify({"error": "User not found"}), 404
    
    user_data = data['users'][email]
    user_query = "Based on my logs and profile, give me a single, highly personalized fitness milestone or achievement insight in 2 sentences. Focus on my progress or upcoming goals. Mention specific numbers from my logs if possible."
    
    recommendation = get_fitness_recommendation(
        api_key, 
        user_data['profile'], 
        user_data['activities'],
        user_query
    )
    
    return jsonify({"milestone": recommendation})

@app.route('/get-recommendation', methods=['POST'])
def get_recommendation():
    api_key = request.headers.get('x-api-key')
    email = request.headers.get('x-user-email')
    if not api_key or not email:
        return jsonify({"error": "Missing credentials"}), 401
    
    data = load_data()
    if email not in data['users']: return jsonify({"error": "User not found"}), 404
    
    user_data = data['users'][email]
    user_query = request.json.get('query')
    
    recommendation = get_fitness_recommendation(
        api_key, 
        user_data['profile'], 
        user_data['activities'],
        user_query
    )
    
    return jsonify({"recommendation": recommendation})
    
@app.route('/get-water', methods=['GET'])
def get_water():
    email = request.headers.get('x-user-email')
    if not email: return jsonify({"glasses": 0})
    
    data = load_data()
    if email not in data['users']: return jsonify({"glasses": 0})
    
    return jsonify({"glasses": data['users'][email].get('water', 0)})

@app.route('/log-water', methods=['POST'])
def log_water():
    email = request.headers.get('x-user-email')
    if not email: return jsonify({"error": "Unauthorized"}), 401
    
    data = load_data()
    if email not in data['users']: return jsonify({"error": "User not found"}), 404
    
    glasses = request.json.get('glasses', 0)
    data['users'][email]['water'] = glasses
    save_data(data)
    
    return jsonify({"status": "success", "glasses": data['users'][email]['water']})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
