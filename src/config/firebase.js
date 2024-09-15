import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyC0NT75YHwe_PWItM0rlJcN8edzNHsxm3M",
  authDomain: "chatting-app-ee48a.firebaseapp.com",
  projectId: "chatting-app-ee48a",
  storageBucket: "chatting-app-ee48a.appspot.com",
  messagingSenderId: "576402865802",
  appId: "1:576402865802:web:1c6b90f7db9375f74e7773",
  measurementId: "G-9R2507J4R7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);