import { getAuth } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { app, db } from "../config/firebase";
import { collection, onSnapshot, orderBy, query, addDoc, serverTimestamp } from "firebase/firestore";

const ChattingPage = () => {
  const auth = getAuth(app);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = auth.currentUser;
  const [messages, setMessages] = useState([]);
  const { id } = useParams();
  const chatId = [id, currentUser?.uid].sort().join("_");

  // Create a ref for the message container
  const messagesEndRef = useRef(null);

  // Auto-scroll function to scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const messageCollection = collection(db, `chats/${chatId}/messages`);
    const q = query(messageCollection, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    // Scroll to the latest message after loading messages
    scrollToBottom();

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    // Scroll to the latest message whenever new messages arrive
    scrollToBottom();
  }, [messages]);

  const sendMessageBtn = async () => {
    if (newMessage.trim() === "") return;
    try {
      const messageCollection = collection(db, `chats/${chatId}/messages`);
      await addDoc(messageCollection, {
        text: newMessage,
        timestamp: serverTimestamp(),
        uid: currentUser.uid,
      });
      setNewMessage("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      {/* Messages Container */}
      <div className="flex-grow-2 p-4 w-full my-16 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${message.uid === currentUser.uid ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[200px] text-white ${
                  message.uid === currentUser.uid ? "bg-blue-600" : "bg-gray-400"
                }`}
              >
                <p className="text-wrap">{message.text}</p>
              </div>
            </div>
          ))
        )}
        {/* Empty div to ensure auto-scroll to the bottom */}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Container */}
      <div className="flex items-center p-4 bg-white border-t border-gray-300 fixed bottom-0 w-full">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 mr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          onClick={sendMessageBtn}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </>
  );
};

export default ChattingPage;
