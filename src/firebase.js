import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCOVQQshLYFWKNlIgtcs8z33kQMDkfJ6Y",
  authDomain: "uzua-ad789.firebaseapp.com",
  projectId: "uzua-ad789",
  storageBucket: "uzua-ad789.appspot.com",
  messagingSenderId: "131191786195",
  appId: "1:131191786195:web:c262759017cef3308d6226",
  measurementId: "G-3HK3LPEYW1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
