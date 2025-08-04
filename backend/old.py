# from fastapi import FastAPI, File, UploadFile, HTTPException, Form
# from fastapi.middleware.cors import CORSMiddleware
# import face_recognition
# import numpy as np
# import os
# from pathlib import Path

# app = FastAPI()

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Adjust to match your frontend URL
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Directories for storing images and encodings
# KNOWN_FACES_DIR = Path("known_faces")
# FACE_ENCODINGS_DIR = Path("face_encodings")
# KNOWN_FACES_DIR.mkdir(exist_ok=True)
# FACE_ENCODINGS_DIR.mkdir(exist_ok=True)

# @app.get("/")
# def read_root():
#     return {"message": "🚀 FastAPI backend is working!...."}

# @app.post("/register")
# async def register_user(name: str = Form(...), file: UploadFile = File(...)):
#     # Validate file type
#     if not file.content_type.startswith("image/"):
#         raise HTTPException(status_code=400, detail="File must be an image")

#     # Save the uploaded image
#     image_path = KNOWN_FACES_DIR / f"{name}.jpg"
#     with image_path.open("wb") as buffer:
#         content = await file.read()
#         buffer.write(content)

#     # Generate and save face encoding
#     try:
#         image = face_recognition.load_image_file(image_path)
#         encodings = face_recognition.face_encodings(image)
#         if not encodings:
#             image_path.unlink()  # Remove image if no face detected
#             raise HTTPException(status_code=400, detail="No face detected in the image")
#     except Exception as e:
#         image_path.unlink()  # Remove image on error
#         raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

#     # Save the first face encoding
#     encoding_path = FACE_ENCODINGS_DIR / f"{name}.npy"
#     np.save(encoding_path, encodings[0])

#     return {"message": f"User {name} registered successfully"}
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import face_recognition
import numpy as np
import os
from pathlib import Path
import cv2
import pandas as pd
from datetime import datetime

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.0.101:3000"],  # Adjust if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories for storing images and encodings
KNOWN_FACES_DIR = Path("known_faces")
FACE_ENCODINGS_DIR = Path("face_encodings")
ATTENDANCE_LOGS_DIR = Path("attendance_logs")
KNOWN_FACES_DIR.mkdir(exist_ok=True)
FACE_ENCODINGS_DIR.mkdir(exist_ok=True)
ATTENDANCE_LOGS_DIR.mkdir(exist_ok=True)

# Load known face encodings
known_encodings = {}
for file in FACE_ENCODINGS_DIR.glob("*.npy"):
    name = file.stem
    known_encodings[name] = np.load(file)

# Attendance log file
ATTENDANCE_FILE = ATTENDANCE_LOGS_DIR / "attendance.csv"
if not ATTENDANCE_FILE.exists():
    pd.DataFrame(columns=["Name", "Date", "Time"]).to_csv(ATTENDANCE_FILE, index=False)

@app.get("/")
def read_root():
    return {"message": "🚀 FastAPI backend is working!"}

@app.post("/register")
async def register_user(name: str = Form(...), file: UploadFile = File(...)):
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Save the uploaded image
    image_path = KNOWN_FACES_DIR / f"{name}.jpg"
    with image_path.open("wb") as buffer:
        content = await file.read()
        buffer.write(content)

    # Generate and save face encoding
    try:
        image = face_recognition.load_image_file(image_path)
        encodings = face_recognition.face_encodings(image)
        if not encodings:
            image_path.unlink()
            raise HTTPException(status_code=400, detail="No face detected in the image")
    except Exception as e:
        image_path.unlink()
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

    # Save the first face encoding
    encoding_path = FACE_ENCODINGS_DIR / f"{name}.npy"
    np.save(encoding_path, encodings[0])
    known_encodings[name] = encodings[0]  # Update in-memory cache

    return {"message": f"User {name} registered successfully"}

@app.get("/recognize")
async def recognize():
    # Initialize webcam
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        raise HTTPException(status_code=500, detail="Could not open webcam")

    ret, frame = cap.read()
    cap.release()
    if not ret:
        raise HTTPException(status_code=500, detail="Failed to capture frame")

    # Convert frame to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Find faces and encodings
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
    recognized_names = []

    for face_encoding, (top, right, bottom, left) in zip(face_encodings, face_locations):
        matches = face_recognition.compare_faces(list(known_encodings.values()), face_encoding)
        name = "Unknown"

        if True in matches:
            match_index = matches.index(True)
            name = list(known_encodings.keys())[match_index]
            recognized_names.append(name)

            # Log attendance
            current_time = datetime.now()
            attendance_data = pd.DataFrame({
                "Name": [name],
                "Date": [current_time.strftime("%Y-%m-%d")],
                "Time": [current_time.strftime("%H:%M:%S")]
            })
            attendance_df = pd.read_csv(ATTENDANCE_FILE)
            if not any((attendance_df["Name"] == name) & (attendance_df["Date"] == current_time.strftime("%Y-%m-%d"))):
                attendance_df = pd.concat([attendance_df, attendance_data], ignore_index=True)
                attendance_df.to_csv(ATTENDANCE_FILE, index=False)

    return {"recognized_names": recognized_names, "attendance_logged": len(recognized_names) > 0}