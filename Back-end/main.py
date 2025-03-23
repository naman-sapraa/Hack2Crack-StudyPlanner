# Imports
from flask import Flask, request, jsonify
import google.generativeai as genai
from googleapiclient.discovery import build
from Resources.config.keys import YOUTUBE_API_KEY, GEMINI_API_KEY, MONGO_URI
from flask_bcrypt import Bcrypt
from flask_pymongo import PyMongo
import json
from flask_cors import CORS
from datetime import datetime, timedelta
import random

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

@app.route("/generate-quiz", methods=["POST"])
def generate_quiz():
    data = request.json
    exam_type = data.get("exam_type", "MIXED")  # Default to MIXED if not specified
    subjects = data.get("subjects", [])
    difficulty = data.get("difficulty", "Mixed")
    test_name = data.get("test_name", "Custom Test")

    # Updated exam subjects mapping to be more flexible
    EXAM_SUBJECTS = {
        "JEE": ["Physics", "Chemistry", "Mathematics"],
        "NEET": ["Physics", "Chemistry", "Biology"],
        "MHT-CET": ["Physics", "Chemistry", "Mathematics", "Biology"],
        "MIXED": ["Physics", "Chemistry", "Mathematics", "Biology"]  # Allow all subjects
    }
    
    if not subjects:
        return jsonify({"error": "No subjects selected"}), 400
    
    # Automatically determine exam type based on subjects if not explicitly set
    if exam_type == "MIXED":
        if "Biology" in [s.get("name") for s in subjects]:
            if "Mathematics" in [s.get("name") for s in subjects]:
                exam_type = "MHT-CET"
            else:
                exam_type = "NEET"
        else:
            exam_type = "JEE"

    # Validate subjects against the flexible subject list
    valid_subjects = EXAM_SUBJECTS["MIXED"]  # Use the complete subject list for validation
    for subject_data in subjects:
        subject_name = subject_data.get("name")
        if subject_name not in valid_subjects:
            return jsonify({"error": f"Invalid subject {subject_name}"}), 400

    all_questions = []
    
    # Generate questions for each subject
    for subject_data in subjects:
        subject_name = subject_data.get("name")
        question_count = subject_data.get("question_count", 5)
        topics = subject_data.get("topics", [])
        
        # Adjust difficulty and context based on subject and exam type
        subject_context = ""
        if subject_name == "Biology" and exam_type in ["NEET", "MHT-CET"]:
            subject_context = "with focus on NEET/MHT-CET biology concepts"
        elif exam_type == "JEE":
            subject_context = "with focus on JEE level concepts"
        
        topics_str = f"focusing on these topics: {', '.join(topics)}" if topics else ""
        
        prompt = f"""
        Generate {question_count} multiple-choice questions (MCQs) for {exam_type} entrance exam on the subject of {subject_name} 
        with {difficulty} difficulty level {topics_str} {subject_context}.
        
        Requirements:
            1. Questions must be strictly at {exam_type} entrance exam level for {subject_name}
            2. Questions should test conceptual understanding and application
            3. Each question must have exactly 4 options (A, B, C, D)
            4. One and only one option must be correct
            5. Include the correct answer and a brief explanation for each question
            6. Questions should be diverse and cover different topics within {subject_name}
            7. All questions must be original and accurate
            8. If {difficulty} is "Mixed", create a mix of easy, medium, and hard questions
            
        Format:
        [
            {{
                "question": "Sample question?",
                "options": {{ "A": "Option 1", "B": "Option 2", "C": "Option 3", "D": "Option 4" }},
                "correct_answer": "A",
                "explanation": "Brief explanation",
                "topic": "Specific topic",
                "subject": "{subject_name}",
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
            
            subject_questions = json.loads(response_text)
            all_questions.extend(subject_questions)
            
        except Exception as e:
            return jsonify({"error": f"Error generating questions for {subject_name}: {str(e)}"}), 500

    # Shuffle questions to mix subjects
    import random
    random.shuffle(all_questions)
    
    return jsonify({
        "quiz": all_questions,
        "metadata": {
            "test_name": test_name,
            "exam_type": exam_type,
            "subjects": [s.get("name") for s in subjects],
            "total_questions": len(all_questions),
            "difficulty": difficulty
        }
    })

@app.route('/generate-study-schedule', methods=['POST'])
def generate_study_schedule():
    data = request.json
    
    # Extract data from request
    subjects = data.get('subjects', [])
    weak_subjects = data.get('weakSubjects', [])
    hours_per_day = data.get('hoursPerDay', 4)
    target_score = data.get('targetScore', 80)
    exam_date = datetime.strptime(data.get('examDate', ''), '%Y-%m-%d')
    exam_type = data.get('examType', 'JEE Mains')
    
    today = datetime.now()
    days_until_exam = (exam_date - today).days
    
    # Generate schedule
    schedule = []
    current_date = today
    
    while current_date <= exam_date:
        # Skip generating past dates
        if current_date < today:
            current_date += timedelta(days=1)
            continue
            
        day_schedule = []
        remaining_hours = hours_per_day
        
        # Prioritize weak subjects
        if weak_subjects and current_date.weekday() < 5:  # Weekdays
            weak_subject = random.choice(weak_subjects)
            day_schedule.append({
                "id": f"event-{current_date.strftime('%Y%m%d')}-1",
                "title": weak_subject,
                "time": "09:00 AM",
                "duration": "90 min",
                "difficulty": "hard",
                "examType": exam_type,
                "isComplete": False
            })
            remaining_hours -= 1.5
        
        # Distribute remaining hours among other subjects
        available_subjects = [s for s in subjects if s not in weak_subjects]
        time_slots = ["11:00 AM", "02:00 PM", "04:00 PM", "06:00 PM"]
        durations = ["60 min", "90 min", "45 min"]
        difficulties = ["easy", "medium", "hard"]
        
        while remaining_hours > 0 and available_subjects and time_slots:
            subject = random.choice(available_subjects)
            time_slot = time_slots.pop(0)
            duration = random.choice(durations)
            difficulty = random.choice(difficulties)
            
            duration_hours = float(duration.split()[0]) / 60
            if duration_hours <= remaining_hours:
                day_schedule.append({
                    "id": f"event-{current_date.strftime('%Y%m%d')}-{len(day_schedule)+1}",
                    "title": subject,
                    "time": time_slot,
                    "duration": duration,
                    "difficulty": difficulty,
                    "examType": exam_type,
                    "isComplete": False
                })
                remaining_hours -= duration_hours
        
        if day_schedule:
            schedule.append({
                "date": current_date.strftime('%Y-%m-%d'),
                "events": day_schedule
            })
        
        current_date += timedelta(days=1)
    
    return jsonify({
        "schedule": schedule,
        "metadata": {
            "examType": exam_type,
            "daysUntilExam": days_until_exam,
            "totalStudyHours": hours_per_day * days_until_exam,
            "subjects": subjects,
            "weakSubjects": weak_subjects
        }
    })

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

