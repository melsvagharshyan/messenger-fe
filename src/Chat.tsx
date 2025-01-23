import { useEffect, useState } from "react";
import { socket } from "./socket";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ message: string; _id: string }>
  >([]);

  useEffect(() => {
    const handlePreviousMessages = (
      data: Array<{ message: string; _id: string }>
    ) => {
      setMessages(data);
    };
    socket?.on("previous-messages", handlePreviousMessages);
    socket?.on("client-path", handlePreviousMessages);

    return () => {
      socket?.off("client-path", handlePreviousMessages);
    };
  }, []);

  const handleSendMessage = () => {
    socket?.emit("create-message", { message });
    setMessage(""); // Clear the textarea after sending
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4 w-[500px]">
      {/* Header */}
      <div className="text-center font-bold text-xl text-gray-800 mb-4">
        Chat App
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow-md mb-4"
        id="messages"
      >
        {messages?.map((message) => (
          <div
            key={message._id}
            className="bg-blue-100 text-gray-800 p-3 rounded-md mb-2"
          >
            {message.message}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex items-center space-x-4">
        <textarea
          className="flex-1 p-2 border text-black border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
