import { firebaseConfig } from "../../config/firebase-config.js"
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in and is admin
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // Redirect to login page if not logged in
      window.location.href = "../login.html"
      return
    }

    try {
      // Check if user is admin
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists() || userDoc.data().role !== "admin") {
        // Redirect to home page if not admin
        alert("You do not have permission to access the admin panel.")
        window.location.href = "../index.html"
        return
      }

      // Update admin name if element exists
      const adminNameElement = document.getElementById("admin-name")
      if (adminNameElement) {
        adminNameElement.textContent = userDoc.data().name || user.email
      }
    } catch (error) {
      console.error("Error checking admin status:", error)
      window.location.href = "../login.html"
    }
  })

  // Setup logout button
  const logoutBtn = document.getElementById("admin-logout")

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()

      signOut(auth)
        .then(() => {
          // Sign-out successful
          window.location.href = "../login.html"
        })
        .catch((error) => {
          // An error happened
          console.error("Logout error:", error)
        })
    })
  }
})
