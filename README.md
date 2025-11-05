# 👁️ Real-Time Face Recognition Attendance System

A full-stack web application for automated attendance tracking using facial recognition technology. The system features real-time video processing, user registration, and automated attendance logging with CSV export capabilities.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116-green)
![Next.js](https://img.shields.io/badge/Next.js-15.4-black)
![React](https://img.shields.io/badge/React-19.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

---

## 🚀 Features

- **👤 User Registration**: Upload facial images with name for system enrollment
- **📷 Real-Time Face Recognition**: Live webcam feed with continuous face detection
- **🎯 Automatic Attendance Logging**: Tracks attendance with timestamps, prevents duplicate entries
- **📊 CSV Export**: Export recognized faces list for record-keeping
- **🔍 Visual Feedback**: Real-time bounding boxes and name labels on detected faces
- **🌙 Dark Mode Support**: Modern responsive UI with light/dark theme
- **⚡ Instant Notifications**: Toast messages for successful recognition
- **📈 Recognition Dashboard**: View all recognized individuals in the current session

---

## 🛠️ Technologies Used

### Backend
- **FastAPI** - High-performance Python web framework
- **face_recognition** - Face detection and recognition (powered by dlib)
- **OpenCV** - Computer vision and image processing
- **NumPy** - Numerical computing and array operations
- **Pandas** - Data manipulation and CSV handling
- **Pillow** - Image file handling
- **Uvicorn** - ASGI server

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS 4** - Utility-first CSS framework
- **HTML5 Canvas** - For drawing face bounding boxes

---

## 📁 Project Structure

```
Face-Recognition/
│
├── backend/
│   ├── main.py                    # FastAPI application with endpoints
│   ├── requirements.txt           # Python dependencies
│   ├── known_faces/              # Registered user face images (.jpg)
│   ├── face_encodings/           # Saved face encodings (.npy files)
│   └── attendance_logs/          # CSV attendance records
│       └── attendance.csv
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # User registration page
│   │   └── recognize/
│   │       └── page.tsx          # Face recognition dashboard
│   ├── package.json              # Node.js dependencies
│   └── tailwind.config.ts        # TailwindCSS configuration
│
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites

- **Python 3.11+** installed
- **Node.js 20+** and npm installed
- **Webcam** for face recognition
- **dlib** dependencies (see installation notes below)

> **📌 Important Note:** After cloning this repository, the following folders will be empty (preserved with `.gitkeep` files):
> - `backend/known_faces/` - Will store registered user face images
> - `backend/face_encodings/` - Will store face encoding data (.npy files)
> - `backend/attendance_logs/` - Will store attendance CSV files
>
> These folders are automatically populated when you register users and run face recognition. The actual user data is gitignored for privacy and security.

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

   > **Note**: Installing `dlib` may require additional system dependencies:
   > - **Windows**: Install CMake and Visual Studio Build Tools
   > - **macOS**: `brew install cmake`
   > - **Linux**: `sudo apt-get install cmake build-essential`

5. **Run the FastAPI server**
   ```bash
   uvicorn main:app --reload
   ```

   Backend will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:3000`

---

## 📖 Usage Guide

### 1. Register a New User

1. Navigate to `http://localhost:3000`
2. Enter the user's full name
3. Upload a clear facial image (good lighting, face clearly visible)
4. Click **"Register"**
5. System will:
   - Validate the image contains a face
   - Generate and save face encoding
   - Store the image and encoding for future recognition

### 2. Face Recognition

1. Click **"Go to Recognition"** or navigate to `http://localhost:3000/recognize`
2. Allow camera access when prompted
3. Click **"Start"** to begin real-time recognition
4. System will:
   - Capture frames every second
   - Detect faces in the frame
   - Match against registered users
   - Draw green bounding boxes with names
   - Log attendance automatically (once per day per person)
   - Show toast notification for new recognitions

### 3. Export Recognition Data

- Click **"Export"** to download CSV file with recognized names
- File will be named `recognized_YYYY-MM-DD.csv`

### 4. View Attendance Logs

Attendance records are stored in:
```
backend/attendance_logs/attendance.csv
```

Format:
```csv
Name,Date,Time
John Doe,2025-01-06,14:30:45
Jane Smith,2025-01-06,14:31:12
```

---

## 🔌 API Endpoints

### `POST /register`

Register a new user with facial image.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `name` (string): User's full name
  - `file` (file): Image file (JPEG, PNG, etc.)

**Response:**
```json
{
  "message": "User John Doe registered successfully"
}
```

**Error Cases:**
- No face detected in image
- Invalid image format
- Face encoding generation failed

### `POST /recognize`

Recognize faces in uploaded image.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `file` (file): Image file with face(s)

**Response:**
```json
{
  "recognized": ["John Doe", "Jane Smith"],
  "boxes": [
    {
      "top": 120,
      "right": 340,
      "bottom": 280,
      "left": 180,
      "name": "John Doe"
    }
  ]
}
```

### `GET /`

Health check endpoint.

**Response:**
```json
{
  "message": "🚀 FastAPI backend is working!"
}
```

---

## 🔧 Configuration

### Face Recognition Settings

Edit these parameters in `backend/main.py`:

```python
# Face matching tolerance (lower = more strict)
# Default: 0.5 (recommended for accuracy)
if face_distances[best_match_index] < 0.5:
    name = list(known_encodings.keys())[best_match_index]
```

### CORS Settings

Allowed origins are configured in `backend/main.py`:
```python
allow_origins=["http://localhost:3000", "http://192.168.0.101:3000"]
```

### Recognition Frequency

Frame capture interval in `frontend/app/recognize/page.tsx`:
```typescript
intervalRef.current = setInterval(sendFrame, 1000); // 1 second
```

---

## 🎨 Features in Detail

### Real-Time Face Detection
- Captures webcam frames at 1-second intervals
- Uses dlib's HOG-based face detector
- Generates 128-dimensional face encodings
- Compares with registered faces using Euclidean distance

### Attendance Management
- Automatically logs attendance when face is recognized
- Prevents duplicate entries (one entry per person per day)
- Stores data in CSV format for easy access
- Includes name, date, and time for each entry

### User Interface
- Modern gradient design with glassmorphism effects
- Responsive layout (mobile and desktop friendly)
- Real-time status indicators
- Image preview before registration
- Recognition logs panel with clear button
- Control buttons (Start, Stop, Snapshot, Export)

---

## 🚫 Git Configuration

### Files Excluded from Version Control

The following are gitignored for privacy, security, or being generated files:

**User Data (Privacy & Security):**
```
backend/known_faces/*.jpg           # User face images
backend/known_faces/*.png
backend/face_encodings/*.npy        # Face encoding data
backend/attendance_logs/*.csv       # Attendance records
```

**Development Files:**
```
backend/venv/                       # Python virtual environment
backend/__pycache__/                # Python cache
frontend/node_modules/              # Node.js dependencies
frontend/.next/                     # Next.js build output
```

**Environment & System Files:**
```
.env                                # Environment variables
.DS_Store, Thumbs.db               # OS files
*.log                               # Log files
```

### Folders Preserved in Git

These folders are kept using `.gitkeep` files to maintain the directory structure:
```
backend/known_faces/.gitkeep
backend/face_encodings/.gitkeep
backend/attendance_logs/.gitkeep
```

When someone clones the repository, these folders will exist but will be empty until they register users and start using the system.

---

## 🐛 Troubleshooting

### "No face detected in the image"
- Ensure good lighting
- Face should be clearly visible and front-facing
- Image should not be blurry
- Try a higher resolution image

### "Camera access denied"
- Check browser permissions
- Ensure no other application is using the camera
- Try different browser (Chrome/Edge recommended)

### "dlib installation failed"
- Install CMake: `pip install cmake`
- Install Visual Studio Build Tools (Windows)
- Try: `pip install dlib --no-cache-dir`

### CORS Errors
- Ensure backend is running on `http://127.0.0.1:8000`
- Ensure frontend is running on `http://localhost:3000`
- Check CORS configuration in `backend/main.py`

---

## 🔮 Future Enhancements

- [ ] Multiple face recognition per frame optimization
- [ ] Face recognition from video files
- [ ] Admin dashboard with analytics
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Email notifications for attendance
- [ ] Mobile application (React Native)
- [ ] Cloud deployment (AWS/Azure)
- [ ] Facial landmark detection
- [ ] Age and gender estimation
- [ ] Mask detection feature

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

Built with ❤️ for automated attendance tracking

---

## 🙏 Acknowledgments

- [face_recognition](https://github.com/ageitgey/face_recognition) by Adam Geitgey
- [dlib](http://dlib.net/) by Davis King
- [FastAPI](https://fastapi.tiangolo.com/) by Sebastián Ramírez
- [Next.js](https://nextjs.org/) by Vercel

---

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

**Happy Coding!** 🎉
