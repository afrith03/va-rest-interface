"use client"
import { useState } from "react";
import axios from "axios";

export default function ChatInterface() {
  var url = "https://dyootiincdemo3.service-now.com/api/sn_va_as_service/bot/integration";
  var headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer <your-access-token>",
    },
    auth: {
      username: "admin",
      password: "Welcome@123",
    },
  }
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [firstmsg, setfirstmsg] = useState(0);
  var body1 = {
    "requestId": "asd2423-sda23-qwe23-we23",
    "action": "START_CONVERSATION",
    "enterpriseId": "ServiceNow",
    "nowBotId": "A85PWLERF",
    "clientSessionId": "",
    "nowSessionId": "",
    "message": {
      "text": "password reset",
      "typed": true,
      "clientMessageId": "ABC-123456"
    },
    "userId": "admin",
    "emailId": "admin@example.com",
    "timestamp": 1588824102,
    "timezone": "America/New_York"
  }
  var body2 = {
    "requestId": "322bas2be70-sadsa-we32-3eq2-1231ra9",
    "botToBot": false,
    "clientSessionId": "",
    "silentMessage": false,
    "message": {
      "text": "Live Agent Support.",
      "typed": true

    },
    "userId": "admin",
    "emailId": "admin@example.com",
    "timestamp": 1588824102,
    "timezone": "America/New_York"
  }
  var requestBody = {};
  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "You" };
      if (firstmsg === 0) {
        body1.message.text = input;
      } else {
        body2.message.text = input;
      }
      setfirstmsg(firstmsg + 1);
      console.log(firstmsg, "firstmsg");
      console.log(firstmsg === 0 ? body1 : body2, "body");
      setMessages([...messages, userMessage]);
      setInput("");

      try {
        const response = await axios.post(
          url,
          firstmsg === 0 ? body1 : body2,
          headers
        );

        if (response.status === 200) {
          const data = response.data;
          let newMessages = [];
          console.log(response);
          data.body.forEach((item) => {
            if (item.uiType === "OutputText") {
              newMessages.push({ text: item.value, sender: "Bot" });
            } else if (item.uiType === "TopicPickerControl") {
              newMessages.push({
                text: item.promptMsg,
                sender: "Bot",
                options: item.options,
              });
            }
          });

          setMessages((prevMessages) => [...prevMessages, ...newMessages]);
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 max-w-md mx-auto w-full h-screen">
      <div className="w-full mb-4 p-2 h-80 overflow-y-auto border border-gray-300 rounded-lg bg-white shadow-md">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 p-2 rounded ${msg.sender === "You" ? "bg-blue-100 text-gray-900" : "bg-gray-100 text-gray-900"}`}>
            <strong>{msg.sender}:</strong> {msg.text}
            {msg.options && (
              <div className="mt-2">
                {msg.options.map((option, idx) => (
                  <button
                    key={idx}
                    className="block mt-1 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                    onClick={() => setInput(option.label)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex w-full gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}