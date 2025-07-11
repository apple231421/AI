// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8xk4eaf9myICJZuu-kDjv96bJcSKAjns",
  authDomain: "apple-56170.firebaseapp.com",
  databaseURL: "https://apple-56170-default-rtdb.firebaseio.com", // ✅ 추가해야 함
  projectId: "apple-56170",
  storageBucket: "apple-56170.appspot.com",
  messagingSenderId: "7600115720",
  appId: "1:7600115720:web:51535981a48a068d87c1bd",
  measurementId: "G-QERMX3VJJ7"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export function saveApplication(data) {
  return push(ref(db, 'applications'), data);
}

export function subscribeApplications(callback) {
  return onValue(ref(db, 'applications'), callback);
}