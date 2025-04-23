// Import Firebase modules (if using modules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"

// Firebase configuration (replace with your own)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Check authentication state
auth.onAuthStateChanged(async (user) => {
  const loginBtn = document.getElementById("login-btn")
  const logoutBtn = document.getElementById("logout-btn")
  const profileLink = document.getElementById("profile-link")

  if (user) {
    // User is signed in
    if (loginBtn) loginBtn.style.display = "none"
    if (logoutBtn) logoutBtn.style.display = "inline-block"

    // Check if user is admin
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists() && userDoc.data().role === "admin") {
        // Add admin link to navigation
        if (profileLink) {
          profileLink.insertAdjacentHTML(
            "afterend",
            `
            <a href="admin/dashboard.html" class="nav-link">
              Admin Panel
            </a>
          `,
          )
        }
      }
    } catch (error) {
      console.error("Error checking admin status:", error)
    }
  } else {
    // User is signed out
    if (loginBtn) loginBtn.style.display = "inline-block"
    if (logoutBtn) logoutBtn.style.display = "none"
  }
})

// Logout functionality
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn")

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()

      auth
        .signOut()
        .then(() => {
          // Sign-out successful
          window.location.href = "index.html"
        })
        .catch((error) => {
          // An error happened
          console.error("Logout error:", error)
        })
    })
  }
})
