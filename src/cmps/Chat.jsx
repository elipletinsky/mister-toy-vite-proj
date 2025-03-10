import { useState } from "react";

export function Chat(){
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
  
    const sendMessage = () => {
      if (!input.trim()) return;
      const newMessages = [...messages, { text: input, sender: "user" }];
      setMessages(newMessages);
      setInput("");
  
      setTimeout(() => {
        setMessages((msgs) => [...msgs, { text: "Support-response", sender: "support" }]);
      }, 1000)
    }
  
    return (
      <div className="chat">
        <div className="chat-content">
          {messages.map((msg, index) => (
            <div key={index} className={msg.sender}>
              <span className={msg.sender === "user" ? "bg-blue-500 text-white p-1 rounded" : "bg-gray-300 p-1 rounded"}>
                {msg.sender+": "+msg.text}
              </span>
            </div>
          ))}
        </div>
        <input
          className="border p-1 w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="mt-2 w-full" onClick={sendMessage}>Send</button>
      </div>
    )
  }
  