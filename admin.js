
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

const teacherList = document.getElementById("teacher-list");
const userList = document.getElementById("user-list");
const message = document.getElementById("admin-message");
const logoutBtn = document.getElementById("logout-btn");

let currentAdmin = null;

// Check administrator
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {
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

        await loadTeachers();
        await loadUsers();

    } catch (error) {
        message.textContent = error.message;
    }
});

// Load pending teachers
async function loadTeachers() {
    teacherList.textContent = "Loading...";

    try {
        const snapshot = await getDocs(collection(db, "users"));

        teacherList.innerHTML = "";

        snapshot.forEach((item) => {
            const teacher = item.data();

            if (
                teacher.role === "teacher" &&
                teacher.status === "pending"
            ) {
                const div = document.createElement("div");

                const name = document.createElement("p");
                name.textContent =
                    `${teacher.name} - ${teacher.email}`;

                const approveBtn = document.createElement("button");
                approveBtn.textContent = "Approve";

                approveBtn.addEventListener("click", () => {
                    approveTeacher(item.id);
                });

                const rejectBtn = document.createElement("button");
                rejectBtn.textContent = "Reject";

                rejectBtn.addEventListener("click", () => {
                    rejectTeacher(item.id);
                });

                div.append(name, approveBtn, rejectBtn);
                teacherList.appendChild(div);
            }
        });

        if (!teacherList.children.length) {
            teacherList.textContent = "No pending teachers.";
        }

    } catch (error) {
        teacherList.textContent = error.message;
    }
}

// Approve teacher
async function approveTeacher(uid) {
    if (!currentAdmin) return;

    try {
        await updateDoc(doc(db, "users", uid), {
            status: "approved"
        });

        message.textContent = "Teacher approved!";

        await loadTeachers();
        await loadUsers();

    } catch (error) {
        message.textContent = error.message;
    }
}

// Reject teacher
async function rejectTeacher(uid) {
    if (!currentAdmin) return;

    const confirmed = confirm("Reject this teacher application?");

    if (!confirmed) return;

    try {
        await updateDoc(doc(db, "users", uid), {
            status: "rejected"
        });

        message.textContent = "Teacher application rejected.";

        await loadTeachers();
        await loadUsers();

    } catch (error) {
        message.textContent = error.message;
    }
}

// Load users
async function loadUsers() {
    try {
        const snapshot = await getDocs(collection(db, "users"));

        userList.innerHTML = "";

        snapshot.forEach((item) => {
            const user = item.data();

            const p = document.createElement("p");

            p.textContent =
                `${user.name} — ${user.role} — ${user.status}`;

            userList.appendChild(p);
        });

    } catch (error) {
        userList.textContent = error.message;
    }
}

// Logout
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
});
