// Import Firebase modules (if using modules)
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js"
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  FieldValue,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js"

// Initialize Firebase (replace with your actual Firebase config)
import { firebaseConfig } from "./firebaseConfig.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js"

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Helper function to format currency
function formatCurrency(amount) {
  return amount.toFixed(2)
}

// Helper function to generate credentials (replace with your actual logic)
function generateCredentials() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Helper function to calculate expiry date
function calculateExpiryDate(duration) {
  const now = new Date()
  if (duration === "hour") {
    now.setHours(now.getHours() + 1)
  } else if (duration === "day") {
    now.setDate(now.getDate() + 1)
  } else if (duration === "week") {
    now.setDate(now.getDate() + 7)
  }
  return now
}

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // Redirect to login page if not logged in
      window.location.href = "login.html"
      return
    }

    // Get rental details from session storage
    const rentService = JSON.parse(sessionStorage.getItem("rentService"))

    if (!rentService) {
      // Redirect to home page if no rental details
      window.location.href = "index.html"
      return
    }

    // Set back button link
    document.getElementById("back-to-rent").href = `rent.html?id=${rentService.serviceId}`

    // Update order summary
    updateOrderSummary(rentService)

    // Setup payment form
    setupPaymentForm(user, rentService)
  })
})

// Update order summary
function updateOrderSummary(rentService) {
  const durationText = rentService.duration === "hour" ? "1 Hour" : rentService.duration === "day" ? "1 Day" : "1 Week"

  document.getElementById("order-description").textContent = `${rentService.serviceName} (${durationText})`
  document.getElementById("order-price").textContent = `$${formatCurrency(rentService.price)}`
  document.getElementById("order-total").textContent = `$${formatCurrency(rentService.price)}`
  document.getElementById("pay-amount").textContent = `$${formatCurrency(rentService.price)}`
}

// Setup payment form
function setupPaymentForm(user, rentService) {
  const paymentForm = document.getElementById("payment-form")
  const payButton = document.getElementById("pay-button")

  paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Disable button and show loading state
    payButton.disabled = true
    payButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`

    try {
      // Generate credentials
      const credentials = generateCredentials()

      // Calculate expiry date
      const startDate = new Date()
      const expiryDate = calculateExpiryDate(rentService.duration)

      // Create payment record
      const paymentRef = await addDoc(collection(db, "payments"), {
        userId: user.uid,
        amount: rentService.price,
        currency: "USD",
        status: "completed",
        paymentMethod: "credit_card",
        createdAt: FieldValue.serverTimestamp(),
      })

      // Create rental record
      const rentalRef = await addDoc(collection(db, "rentals"), {
        userId: user.uid,
        serviceId: rentService.serviceId,
        startDate: startDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        duration: rentService.duration,
        price: rentService.price,
        credentials: credentials,
        status: "active",
        paymentId: paymentRef.id,
        createdAt: FieldValue.serverTimestamp(),
      })

      // Update payment with rental ID
      const paymentDocRef = doc(db, "payments", paymentRef.id)
      await updateDoc(paymentDocRef, {
        rentalId: rentalRef.id,
      })

      // Show success message
      document.getElementById("payment-form-container").style.display = "none"
      document.getElementById("payment-success").style.display = "block"

      // Clear session storage
      sessionStorage.removeItem("rentService")
    } catch (error) {
      console.error("Payment error:", error)

      // Reset button
      payButton.disabled = false
      payButton.innerHTML = `Pay $${formatCurrency(rentService.price)}`

      // Show error message
      alert("Payment failed. Please try again.")
    }
  })
}
