import React, { useEffect, useState } from "react";
import { app, db } from "../config/firebase";
import { getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState([]);
  const [usersDataLoading, setUsersDataLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userRef = collection(db, "users");
        const userSnapShot = await getDocs(userRef);
        const userData = userSnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsersData(userData);
      } catch (err) {
        console.error("Error fetching users:", err.message);
      } finally {
        setUsersDataLoading(false);
      }
    };
    fetchUsers();
  }, []);

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

  return (
    <div className=" bg-gray-100 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-700">
            <div className="text-lg font-semibold">Loading...</div>
          </div>
        ) : (
          <div className="container mx-auto p-6">
            {usersDataLoading ? (
              <div className="flex items-center justify-center h-full text-gray-700">
                <div className="text-lg font-semibold">Loading users...</div>
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
                      <div className="text-lg font-semibold text-gray-800">{user.fullName}</div>
                      <div className="text-gray-600 text-sm mt-1">Last message preview or status</div>
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
