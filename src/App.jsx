import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  async function generateAnswer() {
    if (question.trim() === "") return;

    const userMessage = { sender: "user", text: question };
    setChatHistory([...chatHistory, userMessage]);
    setLoading(true);
    setQuestion("");

    try {
      const response = await axios({
        url:"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCwOcxMgzCQ2YzNtvCTK_oV402vktgV2CM",
        method: "post",
        data: {
          contents: [{ "parts": [{ "text": question }] }],
        }
      });

      const aiMessage = {
        sender: "ai",
        text: formatResponse(response.data.candidates[0].content.parts[0].text),
      };
      setChatHistory([...chatHistory, userMessage, aiMessage]);
    } catch (error) {
      const errorMessage = {
        sender: "ai",
        text: "Something went wrong. Please try again later.",
      };
      setChatHistory([...chatHistory, userMessage, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  function formatResponse(text) {
    // Customize the response format for mental health support
    return text
      .replace(/(\n\n)/g, '\n\n\n') // Add extra space between paragraphs
      .replace(/(\n)/g, '\n• '); // Add bullet points for clarity
  }

  return (
    <div className="app-container">
      <div className="chat-window">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`chat-bubble ${chat.sender === "user" ? "user" : "ai"}`}
          >
            {chat.text}
          </div>
        ))}
        {loading && <div className="chat-bubble ai">Generating response...</div>}
      </div>
      <div className="input-section">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="How are you feeling today?..."
          cols="30"
          rows="3"
        ></textarea>
        <button onClick={generateAnswer} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
