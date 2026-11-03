
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

const teacherList = document.getElementById("teacher-list");
const userList = document.getElementById("user-list");
const message = document.getElementById("admin-message");

let currentAdmin = null;

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const { getDoc } = await import(
        "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js"
    );

    const adminDoc = await getDoc(doc(db, "users", user.uid));

    if (!adminDoc.exists() ||
        adminDoc.data().role !== "admin" ||
        adminDoc.data().status !== "active") {

        message.textContent = "Access denied.";
        await signOut(auth);
        window.location.href = "login.html";
        return;
    }

    currentAdmin = user;
    loadTeachers();
    loadUsers();
});

async function loadTeachers() {
    teacherList.textContent = "Loading...";

    const snapshot = await getDocs(collection(db, "users"));

    teacherList.innerHTML = "";

    snapshot.forEach((item) => {
        const teacher = item.data();

        if (teacher.role === "teacher" &&
            teacher.status === "pending") {

            const div = document.createElement("div");
            div.innerHTML = `
                <p>${teacher.name} - ${teacher.email}</p>
                <button data-id="${item.id}">Approve</button>
            `;

            div.querySelector("button").addEventListener(
                "click",
                () => approveTeacher(item.id)
            );

            teacherList.appendChild(div);
        }
    });

    if (!teacherList.children.length) {
        teacherList.textContent = "No pending teachers.";
    }
}

async function approveTeacher(uid) {
    if (!currentAdmin) return;

    try {
        await updateDoc(doc(db, "users", uid), {
            status: "approved"
        });

        message.textContent = "Teacher approved!";
        loadTeachers();
        loadUsers();

    } catch (error) {
        message.textContent = error.message;
    }
}

async function loadUsers() {
    const snapshot = await getDocs(collection(db, "users"));

    userList.innerHTML = "";

    snapshot.forEach((item) => {
        const user = item.data();

        const p = document.createElement("p");
        p.textContent =
            `${user.name} — ${user.role} — ${user.status}`;

        userList.appendChild(p);
    });
}

document.getElementById("logout-btn").addEventListener(
    "click",
    async () => {
        await signOut(auth);
        window.location.href = "login.html";
    }
);
