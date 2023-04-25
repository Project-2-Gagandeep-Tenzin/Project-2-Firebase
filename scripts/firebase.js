// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAG9F2ZCCm2KlOGOfod7jWn6gsaGT7VZ2w",

  authDomain: "project-2-9dfc4.firebaseapp.com",

  databaseURL: "https://project-2-9dfc4-default-rtdb.firebaseio.com",

  projectId: "project-2-9dfc4",

  storageBucket: "project-2-9dfc4.appspot.com",

  messagingSenderId: "114295916411",

  appId: "1:114295916411:web:18a95bc2447629a84b1fde",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export default app;
