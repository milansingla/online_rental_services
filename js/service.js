import { db } from "./firebaseConfig.js";
import { formatCurrency } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const servicesContainer = document.getElementById("services-container");

  // Fetch active services from Firestore
  db.collection("services")
    .where("active", "==", true)
    .get()
    .then((querySnapshot) => {
      // Clear loading skeletons
      servicesContainer.innerHTML = "";

      if (querySnapshot.empty) {
        servicesContainer.innerHTML =
          '<p class="text-center">No services available at the moment.</p>';
        return;
      }

      // Render each service
      querySnapshot.forEach((doc) => {
        const service = doc.data();
        service.id = doc.id;

        const serviceCard = createServiceCard(service);
        servicesContainer.appendChild(serviceCard);
      });
    })
    .catch((error) => {
      console.error("Error fetching services:", error);
      servicesContainer.innerHTML =
        '<p class="text-center">Error loading services. Please try again later.</p>';
    });
});

// Create service card element
function createServiceCard(service) {
  const card = document.createElement("div");
  card.className = "service-card";

  const imageUrl =
    service.image ||
    `https://via.placeholder.com/150x80?text=${encodeURIComponent(service.name)}`;

  card.innerHTML = `
    <div class="service-image">
      <img src="${imageUrl}" alt="${service.name} logo">
    </div>
    <div class="service-content">
      <h3>${service.name}</h3>
      <p>${service.description}</p>
      <div class="service-pricing">
        <p>1 Hour: $${formatCurrency(service.hourlyPrice)}</p>
        <p>1 Day: $${formatCurrency(service.dailyPrice)}</p>
        <p>1 Week: $${formatCurrency(service.weeklyPrice)}</p>
      </div>
      <p class="service-access">${service.accessInfo}</p>
      <a href="rent.html?id=${service.id}" class="btn btn-primary btn-block">Rent Now</a>
    </div>
  `;

  return card;
}
