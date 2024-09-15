import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
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
    return () => unsubscribe();
  }, [chatId]);

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
      <div className="flex-grow-2 p-4 w-full mb-20">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.uid === currentUser.uid ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-white ${
                  message.uid === currentUser.uid ? "bg-blue-600" : "bg-gray-400"
                }`}
              >
                <p>{message.text}</p>
              </div>
            </div>
          ))
        )}
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
