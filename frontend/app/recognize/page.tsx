// // // "use client";
// // // import { useState, useEffect } from "react";

// // // export default function Home() {
// // //   const [recognizedNames, setRecognizedNames] = useState<string[]>([]);
// // //   const [attendanceLogged, setAttendanceLogged] = useState<boolean>(false);
// // //   const [loading, setLoading] = useState<boolean>(false);
// // //   const [error, setError] = useState<string | null>(null);

// // //   const handleRecognize = async () => {
// // //     setLoading(true);
// // //     setError(null);
// // //     try {
// // //       const response = await fetch("http://127.0.0.1:8000/recognize", {
// // //         method: "GET",
// // //       });
// // //       const data = await response.json();
// // //       if (response.ok) {
// // //         setRecognizedNames(data.recognized_names);
// // //         setAttendanceLogged(data.attendance_logged);
// // //       } else {
// // //         throw new Error(data.detail || "Recognition failed");
// // //       }
// // //     } catch (err) {
// // //       setError(err instanceof Error ? err.message : "An error occurred");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     // Optional: Auto-refresh every 5 seconds
// // //     const interval = setInterval(handleRecognize, 5000);
// // //     return () => clearInterval(interval);
// // //   }, []);

// // //   return (
// // //     <div style={{ padding: "20px" }}>
// // //       <h1>Face Recognition Attendance</h1>
// // //       <button
// // //         onClick={handleRecognize}
// // //         disabled={loading}
// // //         style={{ padding: "10px", marginBottom: "20px" }}
// // //       >
// // //         {loading ? "Recognizing..." : "Start Recognition"}
// // //       </button>
// // //       {error && <p style={{ color: "red" }}>Error: {error}</p>}
// // //       {recognizedNames.length > 0 && (
// // //         <div>
// // //           <h2>Recognized Users:</h2>
// // //           <ul>
// // //             {recognizedNames.map((name, index) => (
// // //               <li key={index}>{name}</li>
// // //             ))}
// // //           </ul>
// // //         </div>
// // //       )}
// // //       {attendanceLogged && <p>Attendance logged successfully!</p>}
// // //       <p>
// // //         Note: Ensure your webcam is on and a registered user is visible. Check
// // //         attendance_logs/attendance.csv for records.
// // //       </p>
// // //     </div>
// // //   );
// // // }

// // "use client";
// // import { useRef, useState, useEffect } from "react";

// // export default function Home() {
// //   const videoRef = useRef<HTMLVideoElement>(null);
// //   const canvasRef = useRef<HTMLCanvasElement>(null);
// //   const [error, setError] = useState<string | null>(null);

// //   const drawBoxes = (boxes: any[]) => {
// //     const canvas = canvasRef.current;
// //     const ctx = canvas?.getContext("2d");
// //     const video = videoRef.current;

// //     if (!ctx || !video || !canvas) return;

// //     canvas.width = video.videoWidth;
// //     canvas.height = video.videoHeight;
// //     ctx.clearRect(0, 0, canvas.width, canvas.height);

// //     boxes.forEach((box) => {
// //       const { top, right, bottom, left, name } = box;
// //       ctx.strokeStyle = "green";
// //       ctx.lineWidth = 2;
// //       ctx.strokeRect(left, top, right - left, bottom - top);

// //       ctx.fillStyle = "green";
// //       ctx.font = "16px Arial";
// //       ctx.fillText(name, left + 5, top - 5);
// //     });
// //   };

// //   const sendFrame = async () => {
// //     const video = videoRef.current;
// //     if (!video) return;

// //     const canvas = document.createElement("canvas");
// //     canvas.width = video.videoWidth;
// //     canvas.height = video.videoHeight;
// //     const ctx = canvas.getContext("2d");
// //     if (!ctx) return;
// //     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

// //     const blob = await new Promise<Blob>((resolve, reject) => {
// //       canvas.toBlob((blob) => {
// //         if (blob) {
// //           resolve(blob);
// //         } else {
// //           reject(new Error("Canvas toBlob failed"));
// //         }
// //       }, "image/jpeg");
// //     });
    
// //     try {
// //       const formData = new FormData();
// //       formData.append("file", blob, "frame.jpg");

// //       const response = await fetch("http://127.0.0.1:8000/recognize", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       const data = await response.json();
// //       if (response.ok) {
// //         drawBoxes(data.boxes);
// //       } else {
// //         throw new Error(data.detail || "Recognition failed");
// //       }
// //     } catch (err) {
// //       setError("Error: " + (err as any).message);
// //     }
// //   };

// //   useEffect(() => {
// //     const startCamera = async () => {
// //       try {
// //         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
// //         if (videoRef.current) {
// //           videoRef.current.srcObject = stream;
// //           videoRef.current.play();
// //         }
// //       } catch (e) {
// //         setError("Camera access denied");
// //       }
// //     };
// //     startCamera();

// //     const interval = setInterval(sendFrame, 1000);
// //     return () => clearInterval(interval);
// //   }, []);

// //   return (
// //     <div>
// //       <h1>Face Recognition Live</h1>
// //       {error && <p style={{ color: "red" }}>{error}</p>}
// //       <div style={{ position: "relative" }}>
// //         <video ref={videoRef} style={{ width: "640px" }} muted autoPlay />
// //         <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
// //       </div>
// //       <p>Make sure you're a registered face. Press F12 to view console if needed.</p>
// //     </div>
// //   );
// // }
// "use client";
// import { useRef, useState, useEffect } from "react";

// export default function Home() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [running, setRunning] = useState(false);
//   const [recognizedNames, setRecognizedNames] = useState<string[]>([]);

//   const drawBoxes = (boxes: any[]) => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext("2d");
//     const video = videoRef.current;

//     if (!ctx || !video || !canvas) return;

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     boxes.forEach((box) => {
//       const { top, right, bottom, left, name } = box;
//       ctx.strokeStyle = "green";
//       ctx.lineWidth = 2;
//       ctx.strokeRect(left, top, right - left, bottom - top);

//       ctx.fillStyle = "green";
//       ctx.font = "16px Arial";
//       ctx.fillText(name, left + 5, top - 5);

//       // Popup logic
//       if (!recognizedNames.includes(name)) {
//         setRecognizedNames((prev) => [...prev, name]);
//         alert(`${name} recognized`);
//       }
//     });
//   };

//   const sendFrame = async () => {
//     const video = videoRef.current;
//     if (!video) return;

//     const canvas = document.createElement("canvas");
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     const blob = await new Promise<Blob>((resolve, reject) => {
//       canvas.toBlob((blob) => {
//         if (blob) {
//           resolve(blob);
//         } else {
//           reject(new Error("Canvas toBlob failed"));
//         }
//       }, "image/jpeg");
//     });

//     try {
//       const formData = new FormData();
//       formData.append("file", blob, "frame.jpg");

//       const response = await fetch("http://127.0.0.1:8000/recognize", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();
//       if (response.ok) {
//         drawBoxes(data.boxes);
//       } else {
//         throw new Error(data.detail || "Recognition failed");
//       }
//     } catch (err) {
//       setError("Error: " + (err as any).message);
//     }
//   };

//   useEffect(() => {
//     const startCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.play();
//         }
//       } catch (e) {
//         setError("Camera access denied");
//       }
//     };

//     startCamera();
//   }, []);

//   useEffect(() => {
//     if (!running) return;
//     const interval = setInterval(() => {
//       sendFrame();
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [running]);

//   return (
//     <div>
//       <h1>Face Recognition Live</h1>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <div style={{ position: "relative" }}>
//         <video ref={videoRef} style={{ width: "640px" }} muted autoPlay />
//         <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
//       </div>
//       <div style={{ marginTop: "10px" }}>
//         <button onClick={() => setRunning(true)} disabled={running}>
//           Start Recognition
//         </button>
//         <button onClick={() => setRunning(false)} disabled={!running} style={{ marginLeft: "10px" }}>
//           Stop Recognition
//         </button>
//       </div>
//       <p>Make sure you're a registered face. Press F12 to view console if needed.</p>
//     </div>
//   );
// }

"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

type Box = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  name: string;
};

export default function RecognizePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

  const drawBoxes = (boxes: Box[]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const video = videoRef.current;

    if (!ctx || !video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    boxes.forEach((box) => {
      const { top, right, bottom, left, name } = box;
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 3;
      ctx.strokeRect(left, top, right - left, bottom - top);

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 18px Arial";
      ctx.fillText(name, left + 5, top - 10);

      // Log and Toast (if new)
      if (!logs.includes(name) && name !== "Unknown") {
        setLogs((prev) => [...prev, name]);
        showToast(`${name} recognized`);
      }
    });
  };

  const showToast = (message: string) => {
    const toast = document.createElement("div");
    toast.innerText = message;
    toast.className = "fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-semibold animate-bounce";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  const sendFrame = async () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject("Canvas toBlob failed")), "image/jpeg");
      });

      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      const res = await fetch("http://127.0.0.1:8000/recognize", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        drawBoxes(data.boxes);
      } else {
        throw new Error(data.detail || "Recognition failed");
      }
    } catch (err) {
      setError("Error: " + (err as any).message);
    }
  };

  const startRecognition = () => {
    if (!intervalRef.current) {
      setIsRunning(true);
      setError(null);
      intervalRef.current = setInterval(sendFrame, 1000);
    }
  };

  const stopRecognition = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const exportCSV = () => {
    const csv = "Name\n" + logs.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `recognized_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch {
        setError("Camera access denied. Please allow camera permissions.");
      }
    };
    startCamera();
    return stopRecognition;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              📷 Face Recognition Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Real-time facial recognition and attendance tracking
            </p>
          </div>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-lg"
          >
            ← Back to Register
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Live Camera Feed
              </h2>
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-auto"
                  muted
                  autoPlay
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>

              {/* Control Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <button
                  onClick={startRecognition}
                  disabled={isRunning}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
                >
                  ▶ Start
                </button>
                <button
                  onClick={stopRecognition}
                  disabled={!isRunning}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
                >
                  ⏹ Stop
                </button>
                <button
                  onClick={sendFrame}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-lg"
                >
                  📸 Snapshot
                </button>
                <button
                  onClick={exportCSV}
                  disabled={logs.length === 0}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
                >
                  📤 Export
                </button>
              </div>

              {/* Status Indicator */}
              <div className="mt-4 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {isRunning ? 'Recognition Active' : 'Recognition Stopped'}
                </span>
              </div>
            </div>
          </div>

          {/* Recognized People Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recognized ({logs.length})
                </h2>
                {logs.length > 0 && (
                  <button
                    onClick={clearLogs}
                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No faces recognized yet
                  </p>
                ) : (
                  logs.map((name, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 px-4 py-3 rounded-lg"
                    >
                      <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
                      <span className="font-medium text-gray-900 dark:text-white">{name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Info Card */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                💡 Tips
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Ensure good lighting</li>
                <li>• Face the camera directly</li>
                <li>• Stay within frame</li>
                <li>• Register users first</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}