#  🍬 SWEET SHOP MANAGEMENT SYSTEM  🍬
 A full-stack Sweet Shop Management System built using modern web technologies.
This project demonstrates backend API development, authentication, database integration, testing using TDD, and manual API verification.
## 🎯 Project Overview
The Sweet Shop Management System is a REST-based application designed to manage sweets in a shop.
It allows users to:

Register and log in securely
View and manage sweets (backend-ready)
Use JWT-based authentication
Access protected routes
Perform manual and automated testing
The project follows clean architecture, Test Driven Development (TDD) principles, and proper Git version control practices.
## 🛠 Tech Stack
Backend
Node.js
Express.js
MongoDB (MongoDB Atlas)
Mongoose
JWT (JSON Web Token)
bcryptjs
Testing
Jest
Supertest
Tools
VS Code
Git & GitHub
PowerShell (manual API testing)
## 📂 Project Structure

## ⚙️ Setup & Run Instructions (Backend)
Backend
- Framework: Spring Boot 3.2.0
- Security: Spring Security + JWT
- Database: MySQL (Aiven Cloud)
- ORM: Spring Data JPA / Hibernate
- Testing: JUnit 5, Mockito, Spring Boot Test
- Build Tool: Maven

frontend

- React/Vue/Angular
- Axios for API calls
- JWT token management
- Responsive UI design

## 🤖 AI Usage Transparency
This project was developed with the assistance of AI tools, following best practices for responsible AI usage:

Tools Used
- GitHub Copilot: Code generation, test scaffolding, and boilerplate reduction
- AI-Assisted Development: Pattern recognition, code suggestions, and documentation
Approach
 - Test-First Development: Tests were designed manually, then AI helped with implementation
- Code Review: All AI-generated code was reviewed and validated
- x] Frontend Application (React)
 User Interface (Login, Register, Shop, Admin Panel)
 API Integration with Axios
 Cloud Database (Aiven MySQL)e logic written manually, AI used for repetitive tasks
-  Transparency: All commits with AI assistance include co-authorship attribution
## 🎨 Application Features
## User Features
- 🔐 User registration and login
- 🍬 Browse sweet catalog
- 🔍 Search and filter by category
- 🛒Backend Port Already in Use
- Change port in application.properties: server.port=8081
- Update frontend proxy in vite.config.js accordingly
## Frontend Not Connecting to Backend
- Ensure backend is running on http://localhost:8080
- Check proxy configuration in frontend/vite.config.js
- Clear browser cache and localStorage
- Check browser console for CORS errors
## Tests Failing
- Ensure H2 database is in dependencies
- Check application-test.properties configuration
## Frontend Build Issues
- Delete node_modules and run npm install again
- Ensure Node.js version is 16 or higher
## Clear npm cache: npm cache clean --forcecription)
- 🗑️ Delete sweets from catalog
- 📦 Restock inventory
- 📊 View all inventory in admin panel

Other
This project follows TDD (Test-Driven Development):

 - RED: Write a failing test
- GREEN: Write minimal code to pass the test
 - REFACTOR: Improve code quality


