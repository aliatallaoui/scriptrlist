// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnQ5wyjeqC3q1HCpP3YzNeBJfJRYlQnZg",
  authDomain: "rlist-63d21.firebaseapp.com",
  databaseURL: "https://rlist-63d21-default-rtdb.firebaseio.com",
  projectId: "rlist-63d21",
  storageBucket: "rlist-63d21.appspot.com",
  messagingSenderId: "416208685684",
  appId: "1:416208685684:web:9c673e48473a89905b9f21",
  measurementId: "G-6364B76KFR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);