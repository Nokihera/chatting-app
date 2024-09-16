import React, { useEffect, useState } from "react";
import { app, db } from "../config/firebase";
import { getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import Preloader from "../components/Preloader.jsx";

const Dashboard = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState([]);
  const [usersDataLoading, setUsersDataLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUsersWithLastMessage = async () => {
      try {
        const userRef = collection(db, "users");
        const userSnapShot = await getDocs(userRef);
        const usersWithLastMessage = await Promise.all(
          userSnapShot.docs.map(async (doc) => {
            const userId = doc.id;
            const chatId = [userId, currentUser?.uid].sort().join("_");

            // Query the last message in each chat
            const messageCollection = collection(
              db,
              `chats/${chatId}/messages`
            );
            const messageQuery = query(
              messageCollection,
              orderBy("timestamp", "desc"),
              limit(1)
            );
            const messageSnapShot = await getDocs(messageQuery);
            const lastMessage = messageSnapShot.docs.length
              ? messageSnapShot.docs[0].data().text
              : "No messages yet";

            return {
              id: userId,
              fullName: doc.data().fullName,
              lastMessage,
            };
          })
        );
        setUsersData(usersWithLastMessage);
      } catch (err) {
        console.error("Error fetching users:", err.message);
      } finally {
        setUsersDataLoading(false);
      }
    };

    fetchUsersWithLastMessage();
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/sign-in");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe(); // Clean up subscription on unmount
  }, [navigate]);

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="animate-pulse flex items-center p-4">
      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
      <div className="ml-4 flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 flex flex-col w-full mt-20 mb-10">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {loading ? (
          <Preloader />
        ) : (
          <div className="container mx-auto">
            {usersDataLoading ? (
              // Show multiple skeleton loaders while data is being fetched
              <div className="divide-y divide-gray-300">
                <SkeletonLoader />
                <SkeletonLoader />
                <SkeletonLoader />
                <SkeletonLoader />
              </div>
            ) : (
              <div className="divide-y divide-gray-300">
                {usersData.map((user) => (
                  <Link
                    to={`/chat/${user.id}`}
                    key={user.id}
                    className="flex items-center p-4 hover:bg-gray-200 cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-700">
                        {user.fullName[0]}
                      </span>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-lg font-semibold text-gray-800">
                        {user.fullName}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        {user.lastMessage || "No messages yet"}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
