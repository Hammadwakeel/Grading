import { useState } from "react";
import { motion } from "framer-motion";
import logo from "./assets/logo.jpg";

export default function App() {
  // File states
  const [answerKeyFile, setAnswerKeyFile] = useState(null);
  const [studentPaperFile, setStudentPaperFile] = useState(null);
  // Extraction states
  const [extractedAnswerKey, setExtractedAnswerKey] = useState(null);
  const [extractedStudentAnswers, setExtractedStudentAnswers] = useState(null);
  // Evaluation response & processing state
  const [response, setResponse] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Base API URL
  const baseURL = "https://hammad712-grading.hf.space";

  // Handler to upload and extract Answer Key
  const handleAnswerKeyUpload = async (event) => {
    const file = event.target.files[0];
    setAnswerKeyFile(file);
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch(`${baseURL}/extract/`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setExtractedAnswerKey(data);
      } catch (error) {
        console.error("Error extracting Answer Key:", error);
        alert("An error occurred during answer key extraction.");
      }
    }
  };

  // Handler to upload and extract Student Paper
  const handleStudentPaperUpload = async (event) => {
    const file = event.target.files[0];
    setStudentPaperFile(file);
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch(`${baseURL}/extract/`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setExtractedStudentAnswers(data);
      } catch (error) {
        console.error("Error extracting Student Paper:", error);
        alert("An error occurred during student paper extraction.");
      }
    }
  };

  // Evaluate using pre-extracted answers via JSON payload.
  // Wrap the answer arrays inside objects with an "answers" key.
  const handleCalculateMarks = async () => {
    if (!extractedAnswerKey || !extractedStudentAnswers) {
      alert("Please extract answers from both files first.");
      return;
    }
    setProcessing(true);
    const payload = {
      answer_key: { answers: extractedAnswerKey.answers },
      student: { answers: extractedStudentAnswers.answers },
    };
    try {
      const res = await fetch(`${baseURL}/evaluate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error evaluating answers:", error);
      alert("An error occurred while evaluating the answers.");
    } finally {
      setProcessing(false);
    }
  };

  // Download extracted JSON files
  const handleDownload = (type) => {
    let dataToDownload;
    let filename;
    if (type === "answerKey" && extractedAnswerKey) {
      dataToDownload = extractedAnswerKey;
      filename = "extracted-answer-key.json";
    } else if (type === "studentPaper" && extractedStudentAnswers) {
      dataToDownload = extractedStudentAnswers;
      filename = "extracted-student-paper.json";
    } else {
      alert("No extracted data available to download.");
      return;
    }
    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Reset all states for a new chat
  const handleNewChat = () => {
    setAnswerKeyFile(null);
    setStudentPaperFile(null);
    setExtractedAnswerKey(null);
    setExtractedStudentAnswers(null);
    setResponse(null);
  };

  // Unified gradient style for buttons.
  const gradientStyle = {
    background: "#8A2387",
    backgroundImage: "linear-gradient(to right, #F27121, #E94057, #8A2387)",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col md:flex-row min-h-screen text-white"
      style={{
        background: "#0f0c29",
        backgroundImage: "linear-gradient(to right, #24243e, #302b63, #0f0c29)",
      }}
    >
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/4 bg-gray-900 p-5 flex flex-col items-center"
      >
        <img src={logo} alt="Company Logo" className="w-20 h-auto mb-4 rounded-full" />
        <div className="flex flex-col space-y-4 w-full">
          {/* Answer Key Row */}
          <div className="flex flex-col w-full space-y-2">
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
              <input
                type="file"
                id="upload-answer-key"
                accept=".pdf"
                className="hidden"
                onChange={handleAnswerKeyUpload}
              />
              <label
                htmlFor="upload-answer-key"
                style={gradientStyle}
                className="w-full sm:flex-1 text-center px-3 py-2 rounded cursor-pointer text-white transition transform duration-300 hover:scale-105"
              >
                Upload Answer Key
              </label>
              <button
                style={gradientStyle}
                className="w-full sm:flex-1 text-center px-3 py-2 rounded transition transform duration-300 hover:scale-105"
                onClick={() => handleDownload("answerKey")}
                disabled={!extractedAnswerKey}
              >
                Download Answer Key
              </button>
            </div>
            {answerKeyFile && (
              <p className="text-green-400 text-xs text-center">
                Answer Key uploaded successfully!
              </p>
            )}
          </div>
          {/* Student Paper Row */}
          <div className="flex flex-col w-full space-y-2">
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
              <input
                type="file"
                id="upload-student-paper"
                accept=".pdf"
                className="hidden"
                onChange={handleStudentPaperUpload}
              />
              <label
                htmlFor="upload-student-paper"
                style={gradientStyle}
                className="w-full sm:flex-1 text-center px-3 py-2 rounded cursor-pointer text-white transition transform duration-300 hover:scale-105"
              >
                Upload Student Paper
              </label>
              <button
                style={gradientStyle}
                className="w-full sm:flex-1 text-center px-3 py-2 rounded transition transform duration-300 hover:scale-105"
                onClick={() => handleDownload("studentPaper")}
                disabled={!extractedStudentAnswers}
              >
                Download Student Paper
              </button>
            </div>
            {studentPaperFile && (
              <p className="text-green-400 text-xs text-center">
                Student Paper uploaded successfully!
              </p>
            )}
          </div>
          {/* New Chat Button */}
          <button
            style={gradientStyle}
            className="mt-4 w-full text-center px-3 py-2 rounded transition transform duration-300 hover:scale-105"
            onClick={handleNewChat}
          >
            New Chat
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-5/6 p-5 md:p-10 flex flex-col items-center"
      >
        <h1 className="text-3xl font-semibold mb-6">Extracted Answers</h1>
        <div className="flex flex-col space-y-6 w-full items-center">
          <div className="flex flex-col md:flex-row md:space-x-4 w-full max-w-4xl">
            {/* Left Column: Student Answers */}
            <div className="w-full md:w-1/2 bg-gray-800 p-4 rounded">
              <h2 className="text-xl font-semibold mb-2">Student Answers</h2>
              {extractedStudentAnswers && extractedStudentAnswers.answers ? (
                <ol className="list-decimal pl-5">
                  {extractedStudentAnswers.answers.map((answer, index) => (
                    <li key={index} className="mb-1">
                      {answer}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm">No extraction yet.</p>
              )}
            </div>
            {/* Right Column: Answer Key */}
            <div className="w-full md:w-1/2 bg-gray-800 p-4 rounded mt-4 md:mt-0">
              <h2 className="text-xl font-semibold mb-2">Answer Key</h2>
              {extractedAnswerKey && extractedAnswerKey.answers ? (
                <ol className="list-decimal pl-5">
                  {extractedAnswerKey.answers.map((answer, index) => (
                    <li key={index} className="mb-1">
                      {answer}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm">No extraction yet.</p>
              )}
            </div>
          </div>

          {/* Show Calculate Marks button only when both extractions exist */}
          {extractedAnswerKey && extractedStudentAnswers && (
            <div className="flex flex-col sm:flex-row sm:space-x-4 w-full max-w-md">
              <button
                style={gradientStyle}
                className="w-full sm:flex-1 text-center px-6 py-2 rounded transition transform duration-300 hover:scale-105"
                onClick={handleCalculateMarks}
                disabled={processing}
              >
                {processing ? "Processing" : "Calculate Marks"}
              </button>
            </div>
          )}

          {/* Display Evaluation Response using Framer Motion */}
          {response && (
            <motion.div
              className="bg-gray-800 p-5 rounded w-full md:w-2/3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {response.answers ? (
                <ol className="list-decimal pl-5">
                  {response.answers.map((answer, index) => (
                    <li key={index} className="mb-2">
                      {answer}
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="space-y-2">
                  {Object.entries(response).map(([key, value]) => (
                    <p key={key}>
                      <strong>{key}:</strong>{" "}
                      {typeof value === "object" ? JSON.stringify(value) : value}
                    </p>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.main>
    </motion.div>
  );
}
