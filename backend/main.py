from fastapi import FastAPI, UploadFile, File, HTTPException, Form 
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from datetime import datetime
import face_recognition
import numpy as np
import pandas as pd
import cv2
import os
import io
from PIL import Image

app = FastAPI()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.0.101:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
KNOWN_FACES_DIR = Path("known_faces")
FACE_ENCODINGS_DIR = Path("face_encodings")
ATTENDANCE_LOGS_DIR = Path("attendance_logs")

for d in [KNOWN_FACES_DIR, FACE_ENCODINGS_DIR, ATTENDANCE_LOGS_DIR]:
    d.mkdir(exist_ok=True)

# Load known encodings
known_encodings = {}
for file in FACE_ENCODINGS_DIR.glob("*.npy"):
    known_encodings[file.stem] = np.load(file)

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

@app.post("/recognize")
async def recognize_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Read uploaded image
    image_data = await file.read()
    img = Image.open(io.BytesIO(image_data)).convert("RGB")
    frame = np.array(img)

    face_locations = face_recognition.face_locations(frame)
    face_encodings = face_recognition.face_encodings(frame, face_locations)

    recognized = []
    boxes = []

    for face_encoding, location in zip(face_encodings, face_locations):
        matches = face_recognition.compare_faces(list(known_encodings.values()), face_encoding)
        name = "Unknown"

        if True in matches:
            idx = matches.index(True)
            name = list(known_encodings.keys())[idx]

        # Log attendance
        if name != "Unknown":
            current_time = datetime.now()
            attendance_data = pd.DataFrame({
                "Name": [name],
                "Date": [current_time.strftime("%Y-%m-%d")],
                "Time": [current_time.strftime("%H:%M:%S")]
            })
            attendance_df = pd.read_csv(ATTENDANCE_FILE)
            if not ((attendance_df["Name"] == name) & (attendance_df["Date"] == current_time.strftime("%Y-%m-%d"))).any():
                attendance_df = pd.concat([attendance_df, attendance_data], ignore_index=True)
                attendance_df.to_csv(ATTENDANCE_FILE, index=False)

        recognized.append(name)
        top, right, bottom, left = location
        boxes.append({"top": top, "right": right, "bottom": bottom, "left": left, "name": name})

    return {"recognized": recognized, "boxes": boxes}
