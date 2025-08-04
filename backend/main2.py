from fastapi import FastAPI, File, UploadFile, HTTPException
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
    return {"message": "main2.. FastAPI backend is working!"}

@app.post("/register")
async def register_user(name: str, file: UploadFile = File(...)):
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

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Convert frame to RGB (face_recognition uses RGB)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Find all faces and encodings in the current frame
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

        for face_encoding, (top, right, bottom, left) in zip(face_encodings, face_locations):
            # Compare with known faces
            matches = face_recognition.compare_faces(list(known_encodings.values()), face_encoding)
            name = "Unknown"

            if True in matches:
                match_index = matches.index(True)
                name = list(known_encodings.keys())[match_index]

            # Draw rectangle and label
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
            cv2.putText(frame, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

            # Log attendance if recognized
            if name != "Unknown":
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

        # Display the frame (optional, for testing)
        cv2.imshow("Face Recognition", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    return {"message": "Face recognition completed"}
