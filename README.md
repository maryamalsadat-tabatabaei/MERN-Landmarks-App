
# MERN Landmarks App

This is a MERN (MongoDB, Express.js, React, and Node.js) application that provides a platform for users to create and manage places. It includes user authentication, CRUD (Create, Read, Update, Delete) operations for places, and integration with external APIs.<br>


<img src="https://github.com/maryamalsadat-tabatabaei/mern-e-commerce-app/assets/87692864/6b4b01c0-2bf8-4b06-8fd1-b416a00ae168" alt="Signup Page" width="30%" height="200">
<img src="https://github.com/maryamalsadat-tabatabaei/mern-e-commerce-app/assets/87692864/156decb6-8f3a-47e7-a760-0a29195acb72" alt="Login Page with error message - Users can also Reset their password and Login with GoogleOauth" width="300" height="200">
<img src="https://github.com/maryamalsadat-tabatabaei/mern-e-commerce-app/assets/87692864/1c4d17f7-0742-4273-9a65-ccb93db47ed1" alt="Login Page - Users can also Reset their password and Login with GoogleOauth" width="300" height="200">
<img src="https://github.com/maryamalsadat-tabatabaei/mern-e-commerce-app/assets/87692864/25d7e94b-a21d-4b2f-babb-69bd64041073" alt="Users List Page" width="300" height=200">
<img src="https://github.com/maryamalsadat-tabatabaei/mern-e-commerce-app/assets/87692864/514328d4-34c8-4936-9d6e-ca4933191730" alt="Add Place Page" width="300" height="200">
<img src="https://github.com/maryamalsadat-tabatabaei/mern-e-commerce-app/assets/87692864/5ef6dd16-31ea-4937-b7f6-0f0e316e0c10" alt="Edit Place Page" width="300" height="200">
<img src="https://github.com/maryamalsadat-tabatabaei/mern-e-commerce-app/assets/87692864/ac8b2672-c6ec-4cf9-b75e-18cf5eb2aa6d" alt="User Places Page" width="300" height="200">
<img src="https://github.com/maryamalsadat-tabatabaei/mern-e-commerce-app/assets/87692864/fed551d8-3a94-40c0-9e51-bdead9f34b68" alt="User Places Page" width="300" height="200">

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Project Background](#project-background)


## Installation

1. Clone the repository: `git clone https://github.com/maryamalsadat-tabatabaei/mern-landmarks-app.git`
2. Navigate to the project directory: `cd mern-landmarks-app`
3. Install dependencies: `npm install`
4. Set up the required environment variables for configuration.
5. Start the development server: `npm start`
6. Access the application in your browser at http://localhost:3000


## Configuration

To configure the project, create .env file and add the following variables:

- GOOGLE_MAP_API_KEY
- MONGO_DB_PASSWORD
- MONGO_DB_USER
- MONGO_DB_COLLECTION
- MONGO_DB_PORT
- JWT_SECRET
- GOOGLE_OAUTH_CLIENT_ID
- GOOGLE_OAUTH_CLIENT_SECRET
- SESSION_COOKIE_KEY

To configure the client, open the client folder and .env file and add the following variables:

- REACT_APP_GOOGLE_MAP_API_KEY
- REACT_APP_GOOGLE_CLIENT_ID

## API Documentation
The following API endpoints are available in this application:

**Users** <br>
`GET /api/users`: Get all the users.<br>
`POST /api/users/resetPassword`: Set reset-token, reset-token-expiration, and mail the reset password link to the existing user.<br>
`GET /api/users/resetPassword/:token`: Check the existing user by its token.<br>
`POST /api/users/new-password`: Save a new password for the user and reset the reset-token and reset-token-expiration.<br>
**Authentication** <br>
`GET /auth/logout`: Logout the user.<br>
`POST /auth/login`: Login user by passport-local-auth.<br>
`POST /auth/signup`: Register user by name, email, password, and image.<br>
`POST /auth/google`: Signin user Google-passport-OAuth.<br>
**Places** <br>
`POST /api/places/`: Create a place by title, description, and address.<br>
`POST /api/places/:pid`: Get the place by its id. <br>
`PATCH /api/places/:pid`: Update the place by its id. <br>

For external API integrations, this application uses axios to interact with the Google Maps API for retrieving coordinates based on addresses.
## Features

- User authentication and authorization
- User registration and login
- Resetting passwords
- Uploading and managing user images
- Creating, updating, and deleting places
- Displaying places on a map
- Adding favorite landmarks to places

**Technologies**

- Express.js: Handles routing, requests, and responses for the server-side implementation.
- React: Provides the client-side UI and handles interactions with the server.
- MongoDB: Stores and retrieves data using a NoSQL database.
- Node.js: Executes JavaScript code on the server-side.
- Axios: Makes HTTP requests to external APIs, such as Google Maps API for location coordinates.
- bcryptjs: Hashes and verifies user passwords.
- body-parser: Parses the body of incoming requests.
- redis: Caches responses for improved performance.
- passport-local: Enables authentication with passwords and emails.
- passport-google-oauth2: Implements Google authentication for user sign-in.
- nodemailer-sendgrid-transport and nodemailer: Sends emails for password reset functionality.
- multer: Handles file uploads, such as user profile images.
- mongoose: Provides object data modeling (ODM) for MongoDB.
- jsonwebtoken: Authorizes and authenticates users using JSON web tokens.
- jest: Performs testing for the application.
  
## Project Background

This project is based on Maximilian Schwarzmüller's tutorial on Udemy React, NodeJS, Express & MongoDB - The MERN Fullstack Guide. I have made modifications and added new features to extend the functionality of the original project and I built upon that foundation to extend the project's functionality and address specific requirements. However, the core concept and initial implementation were inspired by the course and the work of the original author.

**New Features**

1. **Cache Functionality**: Implemented the ability to cache places by userId using Redis. This caching mechanism improves performance by reducing the need for repetitive database queries.

2. **Integration Test**: Added unit and integration tests to ensure the reliability and correctness of the application. 

These additional features enhance the capabilities of the original project and provide added value in terms of functionality, performance, or user experience. They were implemented based on the requirements and insights gained from the course, as well as personal experimentation and problem-solving.

I would like to express my gratitude to the Based on Maximilian Schwarzmüller's course instructors for their teachings and inspiration, which played a significant role in the development of this project. Please note that this project is not affiliated with or endorsed by Maximilian Schwarzmüller, and any issues or inquiries regarding this modified version should be directed to my GitHub repository.
