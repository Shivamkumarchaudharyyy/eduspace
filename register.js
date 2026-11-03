import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";


const form = document.getElementById("register-form");
const message = document.getElementById("register-message");
const button = document.getElementById("register-btn");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    button.disabled = true;
    message.textContent = "Creating account...";

    try {
        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;

        await updateProfile(user, {
            displayName: name
        });

        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            role: role,
            status: role === "teacher" ? "pending" : "approved",
            createdAt: new Date()
        });

        message.textContent =
            role === "teacher"
                ? "Registration successful! Wait for administrator approval."
                : "Account created successfully!";

        form.reset();

    } catch (error) {
        message.textContent = error.message;
    }

    button.disabled = false;
});
