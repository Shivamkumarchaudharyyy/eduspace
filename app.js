
import { auth, db } from "./firebase.js";

const courses = [
    {
        title: "Mathematics",
        teacher: "School Teacher",
        price: "Free",
        type: "Free",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600"
    },
    {
        title: "Web Development",
        teacher: "Expert Teacher",
        price: "Free",
        type: "Free",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600"
    },
    {
        title: "Python Programming",
        teacher: "Expert Teacher",
        price: "Rs. 999",
        type: "Paid",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600"
    },
    {
        title: "Computer Fundamentals",
        teacher: "Expert Teacher",
        price: "Free",
        type: "Free",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
    }
];

const courseList = document.getElementById("course-list");

if (courseList) {
    courseList.innerHTML = courses.map(course => `
        <article class="course-card">
            <img src="${course.image}" alt="${course.title}">
            <div class="course-info">
                <span class="course-type ${course.type.toLowerCase()}">
                    ${course.type}
                </span>
                <h3>${course.title}</h3>
                <p>${course.teacher}</p>
                <div class="course-bottom">
                    <strong>${course.price}</strong>
                    <button type="button"
                        onclick="alert('Enrollment coming soon!')">
                        Enroll Now
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

console.log("EduSpace connected!");
