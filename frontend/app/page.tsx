"use client";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) {
      alert("Please provide a name and select an image.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setName("");
        setFile(null);
        setPreview(null);
      } else {
        alert(`Error: ${JSON.stringify(data.detail)}`);
      }
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            👁️ Face Recognition
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Register a new user with facial recognition
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Upload Photo
              </label>
              <input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-200 transition-all"
              />
            </div>

            {preview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Preview:</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? "Registering..." : "✓ Register"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/recognize"
              className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              📷 Go to Recognition
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}