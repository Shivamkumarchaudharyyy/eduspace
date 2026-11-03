
import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

const loginForm = document.getElementById("login-form");
const message = document.getElementById("login-message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    message.textContent = "Logging in...";

    try {
        const result = await signInWithEmailAndPassword(
            auth, email, password
        );

        const userDoc = await getDoc(
            doc(db, "users", result.user.uid)
        );

        if (!userDoc.exists()) {
            await auth.signOut();
            throw new Error("User profile not found.");
        }

        const userData = userDoc.data();

        if (userData.status !== "active" &&
            userData.status !== "approved") {
            await auth.signOut();
            throw new Error("Your account is not active or approved.");
        }

        if (userData.role === "admin") {
            window.location.href = "admin.html";
        } else if (userData.role === "teacher") {
            window.location.href = "teacher.html";
        } else {
            window.location.href = "student.html";
        }

    } catch (error) {
        message.textContent = error.message;
    }
});
