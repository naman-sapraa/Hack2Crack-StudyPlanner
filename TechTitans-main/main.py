# Imports
from flask import Flask, request, jsonify
import google.generativeai as genai
from googleapiclient.discovery import build
from Resources.config.keys import YOUTUBE_API_KEY, GEMINI_API_KEY, MONGO_URI
from flask_bcrypt import Bcrypt
from flask_pymongo import PyMongo
import json
from flask_cors import CORS

# Config
app = Flask(__name__)
CORS(app, origins=["*"])

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-pro')
app.config['MONGO_URI'] = MONGO_URI
mongo = PyMongo(app)
bcrypt = Bcrypt(app)

#! APIs
# Signup
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    
    if not username or not email or not password:
        return jsonify({"error": "Fields are required"}), 400
    
    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400
    
    hashed = bcrypt.generate_password_hash(password).decode('utf-8')
    user_id = mongo.db.users.insert_one({
        "username": username,
        "email": email,
        "password": hashed
    }).inserted_id
    
    return jsonify({"message": "User registered successfully", "user_id": str(user_id)})

# Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    user = mongo.db.users.find_one({"email": email})
    if user and bcrypt.check_password_hash(user['password'], password):
        return jsonify({"message": "Login successful", "user_id": str(user['_id'])})
    else:
        return jsonify({"error": "Invalid email or password"}), 401

# Takes many inputs and plans a study routine
@app.route('/generate-study-plan', methods=['POST'])
def generate_study_plan():
    data = request.json
    prompt = f"""
    You are an expert educational consultant specializing in entrance exam preparation. Create a personalized study plan for a student with the following profile:

    Name: {data['name']}
    Age: {data['age']}
    Current educational status: {data['education_status']}
    Target exam(s): {', '.join(data['target_exams'])}
    Exam date(s): {', '.join(data['exam_dates'])}
    Grade percentage: {data['grade_percentage']}
    Strongest subjects: {', '.join(data['strongest_subjects'])}
    Weakest subjects: {', '.join(data['weakest_subjects'])}
    Previous scores: {data['previous_scores']}
    Weekday study hours: {data['weekday_study_hours']}
    Weekend study hours: {data['weekend_study_hours']}
    Best study time: {data['best_study_time']}
    Break frequency: {data['break_frequency']}
    Learning style: {data['learning_style']}
    Textbooks: {', '.join(data['textbooks'])}
    Online courses: {', '.join(data['online_courses'])}
    Coaching classes: {data['coaching_classes']}
    Mock tests: {data['mock_tests']}
    Sleep schedule: {data['sleep_schedule']}
    Physical activity: {data['physical_activity']}
    Health conditions: {data['health_conditions']}
    Other commitments: {data['other_commitments']}
    Target college: {data['target_college']}
    Target score: {data['target_score']}
    Preparation months: {data['preparation_months']}
    Priority areas: {', '.join(data['priority_areas'])}
    """

    try:
        response = model.generate_content(prompt)
        return jsonify({"study_plan": response.text})
    except Exception as e:
        return jsonify({"error": str(e)})

# Takes user_query and gives youtube links and resources
@app.route('/search', methods=['POST'])
def search_resources():
    data = request.json
    query = data['user_query']
    try:
        youtube_results = search_youtube(query)
        info = fetch_info(query)

        formatted_videos = [
            f"{idx}. **{video.get('title', 'No Title')}** - {video.get('creator', 'Unknown')} - [Watch here]({video.get('link', '#' )})"
            for idx, video in enumerate(youtube_results, start=1)
        ]

        return jsonify({
            "youtube_results": formatted_videos,
            "educational_resources": info
        })
    except Exception as e:
        return jsonify({"error": str(e)})

# Takes text input and returns text response  
@app.route('/generate-response', methods=['POST'])
def generate_response():
    data = request.json
    query = data.get("input")
    
    if not query:
        return jsonify({"error": "Input query is required"}), 400
    
    system_prompt = (
        "You are an assistant for question-answering tasks. "
        "Use the following pieces of retrieved context to answer "
        "the question. If you don't know the answer, say that you "
        "don't know. Use three sentences maximum and keep the "
        "answer concise."
        "\n\n"
        "{context}"
    )
    
    prompt = system_prompt.replace("{context}", "") + f"\nUser: {query}\nAssistant:"
    
    try:
        response = model.generate_content(prompt)
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)})

# Quiz Generator API
@app.route("/generate-quiz", methods=["POST"])
def generate_quiz():
    data = request.json
    exam_type = data.get("exam_type")
    subject = data.get("subject")
    num_questions = data.get("num_questions", 5)
    difficulty = data.get("difficulty", "Mixed")

    EXAM_SUBJECTS = {
    "JEE": ["Physics", "Chemistry", "Mathematics"],
    "NEET": ["Physics", "Chemistry", "Biology"],
    "MHT-CET": ["Physics", "Chemistry", "Mathematics", "Biology"]
    }
    
    if not exam_type or not subject or subject not in EXAM_SUBJECTS.get(exam_type, []):
        return jsonify({"error": "Invalid exam type or subject"}), 400
    
    prompt = f"""
    Generate {num_questions} multiple-choice questions (MCQs) for {exam_type} entrance exam on the subject of {subject} with {difficulty} difficulty level.
    
    Requirements:
    - Questions must be at {exam_type} entrance exam level.
    - Each question should have exactly 4 options (A, B, C, D) with one correct answer.
    - Include the correct answer and a brief explanation.
    - Format should be a valid JSON array.
    
    Format:
    [
        {{
            "question": "Sample question?",
            "options": {{ "A": "Option 1", "B": "Option 2", "C": "Option 3", "D": "Option 4" }},
            "correct_answer": "A",
            "explanation": "Brief explanation",
            "topic": "Specific topic",
            "difficulty": "Easy/Medium/Hard"
        }}
    ]
    
    Return only the JSON array.
    """
    
    try:
        response = model.generate_content(prompt)
        response_text = response.text
        
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        
        questions = json.loads(response_text)
        
        return jsonify({"quiz": questions})
    except Exception as e:
        return jsonify({"error": str(e)})


# Helper Functions
def fetch_info(query):
    genai.configure(api_key=GEMINI_API_KEY)
    prompt = f"""
    1. Recommend **free online books** related to '{query}' with a **link to read** and also add **One line Description**.
    2. Recommend **free educational websites** where users can learn about '{query}', including the **website link** with **One line Description**.
    """
    response = model.generate_content(prompt)
    return response.text

def search_youtube(query, max_results=5):
    youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
    
    request = youtube.search().list(
        q=query,
        part="snippet",
        type="video",
        maxResults=max_results
    )
    
    response = request.execute()
    
    video_details = [
        {
            "title": item["snippet"]["title"],
            "creator": item["snippet"]["channelTitle"],
            "link": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
            "thumbnail": (
                item["snippet"]["thumbnails"].get("high", {}).get("url") or
                item["snippet"]["thumbnails"].get("medium", {}).get("url") or
                item["snippet"]["thumbnails"].get("default", {}).get("url")
            )
        }
        for item in response.get("items", [])
    ]
    
    return video_details


if __name__ == '__main__':
    app.run(debug=True)

