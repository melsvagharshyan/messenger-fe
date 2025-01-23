import { useEffect, useState, useRef } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { socket } from "./socket";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ message: string; _id: string }>
  >([]);
  const [editMessage, setEditMessage] = useState<{
    message: string;
    _id: string;
  } | null>(null);
  const [activePopover, setActivePopover] = useState<string | null>(null); // Manage active popover state

  // Ref to store the popover container
  const popoverRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    // Close popover when clicking outside of it
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setActivePopover(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSendMessage = () => {
    if (editMessage) {
      // If we are editing an existing message, emit update event
      socket?.emit("update-message", {
        updatedMessage: { message },
        messageId: editMessage._id,
      });
      setEditMessage(null); // Reset the edit mode
    } else {
      socket?.emit("create-message", { message });
    }
    setMessage(""); // Clear the textarea after sending
  };

  const handleEditMessage = (messageToEdit: {
    message: string;
    _id: string;
  }) => {
    setEditMessage(messageToEdit);
    setMessage(messageToEdit.message); // Set the message in the textarea for editing
  };

  const handleDeleteMessage = (messageId: string) => {
    socket?.emit("delete-message", { messageId });
  };

  const togglePopover = (messageId: string) => {
    // Toggle the visibility of the popover
    setActivePopover(activePopover === messageId ? null : messageId);
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
            className="bg-blue-100 text-gray-800 p-3 rounded-md mb-2 relative"
          >
            <div className="flex justify-between items-center">
              <span>{message.message}</span>

              {/* Popover trigger */}
              <div className="relative">
                <button
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => togglePopover(message._id)} // Open/close popover for the clicked message
                >
                  <HiOutlineDotsHorizontal />
                </button>

                {/* Popover Menu */}
                {activePopover === message._id && (
                  <div
                    ref={popoverRef} // Attach ref to popover container
                    className="absolute right-0 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                  >
                    <div
                      className="p-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleEditMessage(message)}
                    >
                      Edit
                    </div>
                    <div
                      className="p-2 text-red-500 hover:bg-red-100 cursor-pointer"
                      onClick={() => handleDeleteMessage(message._id)}
                    >
                      Delete
                    </div>
                  </div>
                )}
              </div>
            </div>
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
          {editMessage ? "Update" : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
