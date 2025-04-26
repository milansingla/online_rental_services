// Initialize Firebase (replace with your actual configuration)
// For example:
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
// const firebaseApp = initializeApp(firebaseConfig);
// const db = getFirestore(firebaseApp);
// const auth = getAuth(firebaseApp);

// Or, if using CDN, ensure Firebase is initialized before this script runs
const db = firebase.firestore(); // Access Firestore via CDN
const auth = firebase.auth(); // Access Auth via CDN

// Helper function to format currency
function formatCurrency(number) {
  return number.toFixed(2);
}

document.addEventListener("DOMContentLoaded", () => {
  // Get service ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = urlParams.get("id");

  if (!serviceId) {
    window.location.href = "index.html";
    return;
  }

  // Fetch service details
  fetchServiceDetails(serviceId);

  // Setup confirmation modal
  setupConfirmationModal();
});

// Fetch service details from Firestore
async function fetchServiceDetails(serviceId) {
  const rentContainer = document.getElementById("rent-container");

  try {
    const serviceDoc = await db.collection("services").doc(serviceId).get();

    if (!serviceDoc.exists) {
      rentContainer.innerHTML = `
        <div class="error-message">
          <p>Service not found. <a href="index.html">Return to homepage</a></p>
        </div>
      `;
      return;
    }

    const service = serviceDoc.data();
    service.id = serviceDoc.id;

    // Check if service is active
    if (!service.active) {
      rentContainer.innerHTML = `
        <div class="error-message">
          <p>This service is currently unavailable. <a href="index.html">Browse other services</a></p>
        </div>
      `;
      return;
    }

    // Render service details
    renderServiceDetails(service);
  } catch (error) {
    console.error("Error fetching service details:", error);
    rentContainer.innerHTML = `
      <div class="error-message">
        <p>Error loading service details. Please try again later.</p>
      </div>
    `;
  }
}

// Render service details
function renderServiceDetails(service) {
  const rentContainer = document.getElementById("rent-container");
  const imageUrl =
    service.image ||
    `https://via.placeholder.com/120x60?text=${encodeURIComponent(service.name)}`;

  rentContainer.innerHTML = `
    <div class="rent-container">
      <div class="rent-header">
        <img src="${imageUrl}" alt="${service.name} logo" class="rent-service-image">
        <div class="rent-service-info">
          <h2>${service.name}</h2>
          <p>${service.description}</p>
          <p class="rent-service-access">${service.accessInfo}</p>
        </div>
      </div>
      
      <h3>Select Rental Duration</h3>
      <div class="duration-options">
        <div class="duration-option" data-duration="hour" data-price="${service.hourlyPrice}">
          <h3>1 Hour</h3>
          <p>$${formatCurrency(service.hourlyPrice)}</p>
        </div>
        <div class="duration-option" data-duration="day" data-price="${service.dailyPrice}">
          <h3>1 Day</h3>
          <p>$${formatCurrency(service.dailyPrice)}</p>
        </div>
        <div class="duration-option" data-duration="week" data-price="${service.weeklyPrice}">
          <h3>1 Week</h3>
          <p>$${formatCurrency(service.weeklyPrice)}</p>
        </div>
      </div>
      
      <div class="rent-footer">
        <div class="rent-price">
          <p>Total Price:</p>
          <p id="selected-price">$0.00</p>
        </div>
        <button class="btn btn-primary" id="confirm-rent-btn" disabled>Confirm Rent</button>
      </div>
    </div>
  `;

  // Setup duration selection
  const durationOptions = document.querySelectorAll(".duration-option");
  const selectedPriceElement = document.getElementById("selected-price");
  const confirmRentBtn = document.getElementById("confirm-rent-btn");

  let selectedDuration = null;
  let selectedPrice = 0;

  durationOptions.forEach((option) => {
    option.addEventListener("click", () => {
      // Remove selected class from all options
      durationOptions.forEach((opt) => opt.classList.remove("selected"));

      // Add selected class to clicked option
      option.classList.add("selected");

      // Update selected duration and price
      selectedDuration = option.getAttribute("data-duration");
      selectedPrice = Number.parseFloat(option.getAttribute("data-price"));

      // Update price display
      selectedPriceElement.textContent = `$${formatCurrency(selectedPrice)}`;

      // Enable confirm button
      confirmRentBtn.disabled = false;
    });
  });

  // Setup confirm button
  confirmRentBtn.addEventListener("click", () => {
    // Check if user is logged in
    const user = auth.currentUser;

    if (!user) {
      // Redirect to login page if not logged in
      window.location.href = "login.html";
      return;
    }

    // Store selected service and duration in session storage
    sessionStorage.setItem(
      "rentService",
      JSON.stringify({
        serviceId: service.id,
        serviceName: service.name,
        serviceImage: imageUrl,
        duration: selectedDuration,
        price: selectedPrice,
      }),
    );

    // Redirect to payment page
    window.location.href = "payment.html";
  });
}

// Setup confirmation modal
function setupConfirmationModal() {
  const modal = document.getElementById("confirmation-modal");
  const closeButtons = modal.querySelectorAll(".close-btn");
  const showCredentialsBtn = document.getElementById("show-credentials-btn");
  const credentialsSection = document.getElementById("credentials-section");
  const copyAllBtn = document.getElementById("copy-all-btn");

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

  // Show credentials when clicking button
  if (showCredentialsBtn) {
    showCredentialsBtn.addEventListener("click", () => {
      credentialsSection.style.display = "block";
      showCredentialsBtn.style.display = "none";
    });
  }

  // Copy all credentials
  if (copyAllBtn) {
    copyAllBtn.addEventListener("click", () => {
      const username = document.getElementById("confirm-username").textContent;
      const password = document.getElementById("confirm-password").textContent;
      const textToCopy = `username: ${username}\npassword: ${password}`;

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          // Show copied feedback
          const originalText = copyAllBtn.innerHTML;
          copyAllBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';

          setTimeout(() => {
            copyAllBtn.innerHTML = originalText;
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    });
  }
}
