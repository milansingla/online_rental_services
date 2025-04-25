// Import Firebase modules (if using modules)
// For example:
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore';

// Or, if using CDN, ensure Firebase is initialized in your HTML

// Initialize Firebase (if not already initialized in HTML)
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

// firebase.initializeApp(firebaseConfig);

// Get a reference to the database
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      // Redirect to login page if not logged in
      window.location.href = "login.html";
      return;
    }

    // Fetch user's rentals
    fetchUserRentals(user.uid);
  });

  // Setup modal functionality
  setupCredentialsModal();
});

// Fetch user's rentals from Firestore
async function fetchUserRentals(userId) {
  const rentalsContainer = document.getElementById("rentals-container");

  try {
    // Get current timestamp for comparing expiry dates
    const now = new Date();

    // Fetch user's rentals
    const rentalsSnapshot = await db
      .collection("rentals")
      .where("userId", "==", userId)
      .orderBy("startDate", "desc")
      .get();

    if (rentalsSnapshot.empty) {
      rentalsContainer.innerHTML = `
        <div class="empty-state">
          <p>You don't have any active rentals.</p>
          <a href="index.html" class="btn btn-primary">Browse Services</a>
        </div>
      `;
      return;
    }

    // Clear loading spinner
    rentalsContainer.innerHTML = "";

    // Process each rental
    const rentals = [];
    const servicePromises = [];

    rentalsSnapshot.forEach((doc) => {
      const rental = doc.data();
      rental.id = doc.id;

      // Check if rental is expired
      const expiryDate = new Date(rental.expiryDate);
      if (expiryDate < now && rental.status === "active") {
        // Update status to expired in Firestore
        db.collection("rentals").doc(doc.id).update({
          status: "expired",
        });
        rental.status = "expired";
      }

      // Fetch service details
      const servicePromise = db
        .collection("services")
        .doc(rental.serviceId)
        .get()
        .then((serviceDoc) => {
          if (serviceDoc.exists) {
            rental.service = serviceDoc.data();
            rental.service.id = serviceDoc.id;
          } else {
            rental.service = { name: "Unknown Service", image: "" };
          }
          return rental;
        });

      servicePromises.push(servicePromise);
      rentals.push(rental);
    });

    // Wait for all service details to be fetched
    Promise.all(servicePromises).then(() => {
      // Render rentals
      rentals.forEach((rental) => {
        const rentalElement = createRentalElement(rental);
        rentalsContainer.appendChild(rentalElement);
      });
    });
  } catch (error) {
    console.error("Error fetching rentals:", error);
    rentalsContainer.innerHTML =
      "<p>Error loading your rentals. Please try again later.</p>";
  }
}

// Create rental element
function createRentalElement(rental) {
  const rentalItem = document.createElement("div");
  rentalItem.className = "rental-item";

  // Calculate remaining time and progress
  const remainingTime = calculateRemainingTime(rental.expiryDate);
  const progress = calculateProgress(rental.startDate, rental.expiryDate);

  // Determine status class
  const statusClass =
    rental.status === "active" ? "status-active" : "status-expired";

  // Service image
  const serviceImage =
    rental.service.image ||
    `https://via.placeholder.com/60x30?text=${encodeURIComponent(rental.service.name)}`;

  rentalItem.innerHTML = `
    <div class="rental-header">
      <div class="rental-service">
        <img src="${serviceImage}" alt="${rental.service.name} logo">
        <h3>${rental.service.name}</h3>
      </div>
      <span class="rental-status ${statusClass}">${rental.status}</span>
    </div>
    
    <div class="rental-credentials">
      <h4>Login Credentials</h4>
      <div class="credential-row">
        <div>
          <p class="credential-label">Username</p>
          <p class="credential-value">••••••••••••</p>
        </div>
        <div>
          <p class="credential-label">Password</p>
          <p class="credential-value">••••••••••••</p>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm view-credentials" data-rental-id="${rental.id}">
        <i class="fas fa-eye"></i> View Credentials
      </button>
    </div>
    
    <div class="rental-footer">
      <div class="rental-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <p class="rental-time">${remainingTime}</p>
      </div>
      ${
        rental.status === "active"
          ? `
        <div class="rental-actions">
          <button class="reset-password" data-rental-id="${rental.id}">
            <i class="fas fa-sync-alt"></i> Reset Password
          </button>
        </div>
      `
          : ""
      }
    </div>
  `;

  return rentalItem;
}

// Setup credentials modal
function setupCredentialsModal() {
  const modal = document.getElementById("credentials-modal");
  const closeButtons = modal.querySelectorAll(".close-btn");

  // Close modal when clicking close button
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  });

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  // Setup copy buttons
  const copyButtons = modal.querySelectorAll(".copy-btn");
  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const textToCopy = document.getElementById(targetId).textContent;

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          // Show copied feedback
          const originalIcon = button.innerHTML;
          button.innerHTML = '<i class="fas fa-check"></i>';

          setTimeout(() => {
            button.innerHTML = originalIcon;
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    });
  });

  // Setup view credentials buttons
  document.addEventListener("click", async (e) => {
    if (e.target.closest(".view-credentials")) {
      const button = e.target.closest(".view-credentials");
      const rentalId = button.getAttribute("data-rental-id");

      try {
        // Fetch rental details
        const rentalDoc = await db.collection("rentals").doc(rentalId).get();

        if (rentalDoc.exists) {
          const rental = rentalDoc.data();

          // Fetch service details
          const serviceDoc = await db
            .collection("services")
            .doc(rental.serviceId)
            .get();
          const service = serviceDoc.exists
            ? serviceDoc.data()
            : { name: "Unknown Service" };

          // Update modal content
          document.getElementById("modal-service-name").textContent =
            service.name;
          document.getElementById("modal-service-image").src =
            service.image ||
            `https://via.placeholder.com/120x60?text=${encodeURIComponent(service.name)}`;
          document.getElementById("modal-username").textContent =
            rental.credentials.username;
          document.getElementById("modal-password").textContent =
            rental.credentials.password;
          document.getElementById("modal-expiry").textContent = formatDate(
            rental.expiryDate,
          );

          // Show modal
          modal.classList.add("active");
        }
      } catch (error) {
        console.error("Error fetching rental details:", error);
      }
    }
  });

  // Setup reset password buttons
  document.addEventListener("click", async (e) => {
    if (e.target.closest(".reset-password")) {
      const button = e.target.closest(".reset-password");
      const rentalId = button.getAttribute("data-rental-id");

      try {
        // Generate new credentials
        const newCredentials = generateCredentials();

        // Update rental in Firestore
        await db.collection("rentals").doc(rentalId).update({
          "credentials.password": newCredentials.password,
        });

        // Show success message
        alert("Password has been reset successfully!");

        // Refresh rentals
        const user = firebase.auth().currentUser;
        if (user) {
          fetchUserRentals(user.uid);
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        alert("Failed to reset password. Please try again.");
      }
    }
  });
}

// Helper functions (add these at the end of the file)

// Function to calculate remaining time
function calculateRemainingTime(expiryDate) {
  const expiry = new Date(expiryDate).getTime();
  const now = new Date().getTime();
  const diff = expiry - now;

  if (diff < 0) {
    return "Expired";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m`;
}

// Function to calculate progress
function calculateProgress(startDate, expiryDate) {
  const start = new Date(startDate).getTime();
  const expiry = new Date(expiryDate).getTime();
  const now = new Date().getTime();

  const total = expiry - start;
  const elapsed = now - start;

  const progress = (elapsed / total) * 100;
  return Math.max(0, Math.min(progress, 100)); // Ensure progress is within 0-100
}

// Function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

// Function to generate credentials
function generateCredentials() {
  const password = Math.random().toString(36).slice(-8);
  return {
    username: "user", // You might want to generate a username as well
    password: password,
  };
}
