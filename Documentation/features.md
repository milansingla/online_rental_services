# FEATURES
This project is a web-based rental management system designed for administrators to manage rental listings effectively. The platform provides a user-friendly interface for adding, updating, and removing rental items, along with an intuitive dashboard for monitoring the overall system status. The application is built using HTML, CSS, and JavaScript, and features a responsive and interactive design.

 Login Page
A form-based login system is implemented to ensure secure access to the admin panel.

Includes input fields for username and password along with a login button.

Basic input validation is handled using JavaScript to prevent empty submissions.

Error messages are displayed for incorrect credentials.

(Optional) A “Remember Me” feature can be added using localStorage or cookies.

 Admin Dashboard
Upon successful login, the admin is redirected to the dashboard.

Displays a summary of rental listings, including:

Total number of items

Items in stock

Items out of stock

Includes quick links to:

Add new items

Manage existing items

View system reports

Features a search bar and filtering options for easy item navigation.

➕ Add Rental Items
Admin can add new items through a structured form with the following fields:

Item Name

Price

Category (select input)

Image Upload (with preview)

Availability (checkbox/toggle)

Real-time client-side validation ensures data integrity.

On successful submission, the item is dynamically listed and a confirmation message is shown.

 Update/Delete Items
A tabular view displays all current rental items with options to edit or delete.

Edit functionality opens a pre-filled form for easy updates.

Delete functionality includes a confirmation prompt to prevent accidental deletion.

JavaScript dynamically updates the DOM to reflect changes without page reload.

 Responsive Design
Designed with a mobile-first approach using media queries.

Utilizes Flexbox and CSS Grid for adaptive layouts.

Features a hamburger menu and large, tap-friendly buttons for mobile usability.

 JavaScript Interactivity
Implements interactive features using plain JavaScript:

Form validation

Dynamic content rendering

Modal dialogs for confirmation or alerts

Toast notifications for status updates

Form reset after successful submission