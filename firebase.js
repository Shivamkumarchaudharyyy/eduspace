
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-storage.js";
const firebaseConfig = {
    apiKey: "AIzaSyDrp_F2fTzwmy3z7A2OFE4ICliDNgyNaaQ",
    authDomain: "eduspace-platform-944f5.firebaseapp.com",
    projectId: "eduspace-platform-944f5",
    storageBucket: "eduspace-platform-944f5.firebasestorage.app",
    messagingSenderId: "611492923716",
    appId: "1:611492923716:web:9202989f6c54294e382f11",
    measurementId: "G-ZDE8891RH6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
const db = getFirestore(app);
const storage = getStorage(app);
export { app, auth, db, storage };
