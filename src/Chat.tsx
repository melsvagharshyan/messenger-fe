import { useEffect, useState, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { socket } from "./socket";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ message: string; _id: string }>
  >([]);
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // Scroll to top when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  }, [messages]);

  useEffect(() => {
    const handlePreviousMessages = (
      data: Array<{ message: string; _id: string }>
    ) => {
      setMessages(data.reverse());
    };
    socket?.on("previous-messages", handlePreviousMessages);
    socket?.on("client-path", handlePreviousMessages);

    return () => {
      socket?.off("client-path", handlePreviousMessages);
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket?.emit("create-message", { message });
      setMessage("");
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    socket?.emit("delete-message", { messageId });
  };

  const togglePopover = (messageId: string) => {
    setActivePopover(activePopover === messageId ? null : messageId);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 max-w-full border-x border-gray-300">
      <div className="bg-white p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full mr-3"></div>
          <div>
            <div className="font-semibold text-gray-800">Messenger Chat</div>
            <div className="text-xs text-gray-500">Active now</div>
          </div>
        </div>
        <div className="text-gray-600 text-xl">...</div>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col-reverse"
      >
        {messages?.map((message) => (
          <div key={message._id} className="flex justify-end">
            <div className="relative max-w-[70%] p-2 bg-blue-500 text-white rounded-xl mb-2">
              <div className="flex justify-between items-center">
                <span>{message.message}</span>

                <div className="relative ml-2">
                  <button
                    className="text-white/70 hover:text-white cursor-pointer"
                    onClick={() => togglePopover(message._id)}
                  >
                    ...
                  </button>

                  {activePopover === message._id && (
                    <div
                      ref={popoverRef}
                      className="absolute right-0 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-1"
                    >
                      <div
                        className="p-2 text-red-500 hover:bg-red-100 cursor-pointer rounded-lg"
                        onClick={() => handleDeleteMessage(message._id)}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 border-t border-gray-200 flex items-center space-x-2">
        <textarea
          className="flex-1 p-2 border text-black border-gray-300 focus:border-white rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={1}
        />
        <IoMdSend
          className="cursor-pointer"
          fill={message.trim() ? "#2b7fff" : "#2b7fffd1"}
          size={40}
          onClick={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
