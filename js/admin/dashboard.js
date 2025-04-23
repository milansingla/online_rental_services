// Import necessary modules or declare variables
// Assuming db and formatCurrency are globally available or need to be imported
// Example (if using modules):
// import { db, formatCurrency } from './utils';

// Example (if globally available, but not declared):
// const db = firebase.firestore(); // Replace firebase with your actual Firebase instance
// const formatCurrency = (amount) => { /* your formatting logic */ };

document.addEventListener("DOMContentLoaded", () => {
  // Fetch dashboard data
  fetchDashboardData()
})

// Fetch dashboard data
async function fetchDashboardData() {
  try {
    // Fetch users count
    const usersSnapshot = await db.collection("users").get()
    const totalUsers = usersSnapshot.size
    document.getElementById("total-users").textContent = totalUsers

    // Fetch rentals data
    const rentalsSnapshot = await db.collection("rentals").get()
    const totalRentals = rentalsSnapshot.size
    document.getElementById("total-rentals").textContent = totalRentals

    // Calculate active rentals
    const now = new Date()
    let activeRentals = 0
    let totalRevenue = 0

    // Service popularity tracking
    const servicePopularity = {}

    rentalsSnapshot.forEach((doc) => {
      const rental = doc.data()

      // Add to total revenue
      totalRevenue += Number.parseFloat(rental.price || 0)

      // Check if rental is active
      const expiryDate = new Date(rental.expiryDate)
      if (expiryDate > now && rental.status === "active") {
        activeRentals++
      }

      // Track service popularity
      if (rental.serviceId) {
        servicePopularity[rental.serviceId] = (servicePopularity[rental.serviceId] || 0) + 1
      }
    })

    // Update stats
    document.getElementById("total-revenue").textContent = `$${formatCurrency(totalRevenue)}`
    document.getElementById("active-rentals").textContent = activeRentals

    // Calculate average rental value
    const avgRental = totalRentals > 0 ? totalRevenue / totalRentals : 0
    document.getElementById("avg-rental").textContent = `$${formatCurrency(avgRental)} per rental`

    // Find most popular service
    let mostPopularServiceId = null
    let maxCount = 0

    for (const [serviceId, count] of Object.entries(servicePopularity)) {
      if (count > maxCount) {
        mostPopularServiceId = serviceId
        maxCount = count
      }
    }

    if (mostPopularServiceId) {
      const serviceDoc = await db.collection("services").doc(mostPopularServiceId).get()
      if (serviceDoc.exists) {
        document.getElementById("popular-service").textContent = serviceDoc.data().name
      }
    } else {
      document.getElementById("popular-service").textContent = "No data available"
    }

    // Count new users in last 7 days
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    let newUsers = 0
    usersSnapshot.forEach((doc) => {
      const userData = doc.data()
      if (userData.createdAt) {
        const createdAt = userData.createdAt.toDate ? userData.createdAt.toDate() : new Date(userData.createdAt)
        if (createdAt > oneWeekAgo) {
          newUsers++
        }
      }
    })

    document.getElementById("new-users").textContent = `${newUsers} new registrations`

    // Fetch recent activity
    fetchRecentActivity()
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
  }
}

// Fetch recent activity
async function fetchRecentActivity() {
  try {
    const activityList = document.getElementById("recent-activity")

    // Clear loading skeletons
    activityList.innerHTML = ""

    // Fetch recent rentals
    const rentalsSnapshot = await db.collection("rentals").orderBy("createdAt", "desc").limit(5).get()

    if (rentalsSnapshot.empty) {
      activityList.innerHTML = '<li class="activity-item">No recent activity</li>'
      return
    }

    // Process each rental
    const activities = []

    for (const doc of rentalsSnapshot.docs) {
      const rental = doc.data()

      // Fetch user details
      const userDoc = await db.collection("users").doc(rental.userId).get()
      const userName = userDoc.exists ? userDoc.data().name : "Unknown User"

      // Fetch service details
      const serviceDoc = await db.collection("services").doc(rental.serviceId).get()
      const serviceName = serviceDoc.exists ? serviceDoc.data().name : "Unknown Service"

      activities.push({
        type: "rental",
        userName,
        serviceName,
        price: rental.price,
        time: rental.createdAt ? rental.createdAt.toDate() : new Date(),
      })
    }

    // Sort by time (newest first)
    activities.sort((a, b) => b.time - a.time)

    // Render activities
    activities.forEach((activity) => {
      const li = document.createElement("li")
      li.className = "activity-item"

      const timeAgo = formatTimeAgo(activity.time)

      li.innerHTML = `
        <div class="activity-icon rental">
          <i class="fas fa-film"></i>
        </div>
        <div class="activity-content">
          <p>${activity.userName} rented ${activity.serviceName}</p>
          <p class="activity-time">${timeAgo}</p>
        </div>
        <div class="activity-right">
          $${formatCurrency(activity.price)}
        </div>
      `

      activityList.appendChild(li)
    })
  } catch (error) {
    console.error("Error fetching recent activity:", error)
  }
}

// Format time ago
function formatTimeAgo(date) {
  const now = new Date()
  const diffMs = now - date
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  } else if (diffMins > 0) {
    return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
  } else {
    return "Just now"
  }
}
