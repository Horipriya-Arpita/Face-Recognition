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

type Box = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  name: string;
};

export default function Home() {
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
      ctx.strokeStyle = "green";
      ctx.lineWidth = 2;
      ctx.strokeRect(left, top, right - left, bottom - top);

      ctx.fillStyle = "green";
      ctx.font = "16px Arial";
      ctx.fillText(name, left + 5, top - 5);

      // Log and Toast (if new)
      if (!logs.includes(name)) {
        setLogs((prev) => [...prev, name]);
        showToast(`${name} recognized`);
      }
    });
  };

  const showToast = (message: string) => {
    const toast = document.createElement("div");
    toast.innerText = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#4caf50";
    toast.style.color = "#fff";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "5px";
    toast.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
    toast.style.zIndex = "1000";
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

  const exportCSV = () => {
    const csv = logs.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "recognized_people.csv";
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
        setError("Camera access denied");
      }
    };
    startCamera();
    return stopRecognition;
  }, []);

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial" }}>
      <h1>Face Recognition Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ position: "relative" }}>
        <video ref={videoRef} style={{ width: "640px" }} muted autoPlay />
        <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={startRecognition} disabled={isRunning}>▶ Start</button>
        <button onClick={stopRecognition} disabled={!isRunning}>⏹ Stop</button>
        <button onClick={sendFrame}>📷 Recognize Once</button>
        <button onClick={exportCSV} disabled={logs.length === 0}>📤 Export CSV</button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <h3>Recognized People</h3>
        <ul>
          {logs.map((name, index) => (
            <li key={index}>✅ {name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// cd F:\Intern\My Projects\Face-Recognition\backend
// source venv/Scripts/activate
// uvicorn main:app --reload