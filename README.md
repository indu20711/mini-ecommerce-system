# Mini eCommerce System

A simple eCommerce system with user and admin login, built using Java (Spring Boot), HTML, CSS, JavaScript, and MySQL.

## Features
- User Authentication (Login & Signup)
- Product Management (Admin: Add, Delete)
- Basic eCommerce Flow (Users: View Products)

## Setup Instructions
1. **Backend Setup**
   - Clone the repository: `git clone https://github.com/indu20711/mini-ecommerce-system.git`
   - Navigate to `backend/`
   - Update `application.properties` with your MySQL credentials
   - Run `mvn spring-boot:run`

2. **Database Setup**
   - Create a MySQL database named `ecommerce_db`
   - Seed an admin user:
     ```sql
     INSERT INTO users (name, email, password, role) VALUES ('Admin', 'admin@gmail.com', 'admin123', 'admin');
