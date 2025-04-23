// Import the Firebase SDK
import * as firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"
import "firebase/auth"

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "flixo-service-rental.firebaseapp.com",
  projectId: "flixo-service-rental",
  storageBucket: "flixo-service-rental.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Initialize Firestore
const db = firebase.firestore()

// Initialize Storage
const storage = firebase.storage()

// Initialize Auth
const auth = firebase.auth()

// Helper function to format currency
function formatCurrency(amount) {
  return Number.parseFloat(amount).toFixed(2)
}

// Helper function to format date
function formatDate(timestamp) {
  if (!timestamp) return ""

  const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
  return date.toLocaleString()
}

// Helper function to generate random credentials
function generateCredentials() {
  const username = `flixo_${Math.random().toString(36).substring(2, 8)}`
  const password = `secure${Math.random().toString(36).substring(2, 10)}!`

  return { username, password }
}

// Helper function to calculate expiry date
function calculateExpiryDate(duration) {
  const now = new Date()

  switch (duration) {
    case "hour":
      return new Date(now.getTime() + 60 * 60 * 1000)
    case "day":
      return new Date(now.getTime() + 24 * 60 * 60 * 1000)
    case "week":
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    default:
      return new Date(now.getTime() + 60 * 60 * 1000)
  }
}

// Helper function to calculate remaining time
function calculateRemainingTime(expiryDate) {
  const now = new Date()
  const expiry = new Date(expiryDate)

  if (now > expiry) {
    return "Expired"
  }

  const diffMs = expiry - now
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffDays > 0) {
    return `${diffDays} days, ${diffHours} hours left`
  } else if (diffHours > 0) {
    return `${diffHours} hours, ${diffMinutes} minutes left`
  } else {
    return `${diffMinutes} minutes left`
  }
}

// Helper function to calculate progress percentage
function calculateProgress(startDate, expiryDate) {
  const start = new Date(startDate)
  const expiry = new Date(expiryDate)
  const now = new Date()

  if (now > expiry) {
    return 100
  }

  const totalDuration = expiry - start
  const elapsed = now - start

  return Math.min(100, Math.round((elapsed / totalDuration) * 100))
}
