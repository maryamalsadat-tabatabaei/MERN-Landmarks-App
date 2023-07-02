
# mern-landmarks-app

This is a MERN app using Express.js, React, MongoDB, and Node.js.<br>
Based on tutorial on Udemy React, NodeJS, Express & MongoDB - The MERN Fullstack Guide.

<img src="https://github.com/maryamalsadat-tabatabaei/mern-e-commerce-app/assets/87692864/6b4b01c0-2bf8-4b06-8fd1-b416a00ae168" alt="Signup Page" width="300" height="200">
<img src="https://github.com/maryamalsadat-tabatabaei/mern-e-commerce-app/assets/87692864/156decb6-8f3a-47e7-a760-0a29195acb72" alt="Login Page with error message - Users can also Reset their password and Login with GoogleOauth" width="300" height="200">
<img src="https://github.com/maryamalsadat-tabatabaei/mern-e-commerce-app/assets/87692864/1c4d17f7-0742-4273-9a65-ccb93db47ed1" alt="Login Page - Users can also Reset their password and Login with GoogleOauth" width="300" height="200">
<img src="https://github.com/maryamalsadat-tabatabaei/mern-e-commerce-app/assets/87692864/25d7e94b-a21d-4b2f-babb-69bd64041073" alt="Users List Page" width="300" height=200">
<img src="https://github.com/maryamalsadat-tabatabaei/mern-e-commerce-app/assets/87692864/514328d4-34c8-4936-9d6e-ca4933191730" alt="Add Place Page" width="300" height="200">
<img src="https://github.com/maryamalsadat-tabatabaei/mern-e-commerce-app/assets/87692864/5ef6dd16-31ea-4937-b7f6-0f0e316e0c10" alt="Edit Place Page" width="300" height="200">
<img src="https://github.com/maryamalsadat-tabatabaei/mern-e-commerce-app/assets/87692864/ac8b2672-c6ec-4cf9-b75e-18cf5eb2aa6d" alt="User Places Page" width="300" height="200">
<img src="https://github.com/maryamalsadat-tabatabaei/mern-e-commerce-app/assets/87692864/fed551d8-3a94-40c0-9e51-bdead9f34b68" alt="User Places Page" width="300" height="200">

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Project Background](#project-background)
- [New Features](#new-features)

## Installation

1. Clone the repository: `git clone https://github.com/maryamalsadat-tabatabaei/mern-landmarks-app.git`
2. Navigate to the project directory: `cd mern-landmarks-app`
3. Install dependencies: `npm install`

## Usage

To run the project, use the following command:

<pre><code>npm start</code></pre>

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

`GET /api/users`: Get all the users.<br>
`POST /api/users/resetPassword`: Set reset-token, reset-token-expiration, and mail the reset password link to the existing user.<br>
`GET /api/users/resetPassword/:token`: Check the existing user by its token.<br>
`POST /api/users/new-password`: Save a new password for the user and reset the reset-token and reset-token-expiration.<br>
`GET /auth/logout`: Logout the user.<br>
`POST /auth/login`: Login user by passport-local-auth.<br>
`POST /auth/signup`: Register user by name, email, password, and image.<br>
`POST /auth/google`: Signin user Google-passport-OAuth.<br>
`POST /api/places/`: Create a place by title, description, and address.<br>
`POST /api/places/:pid`: Get the place by its id. <br>
`PATCH /api/places/:pid`: Update the place by its id. <br>

## Project Background

This project is based on Maximilian Schwarzmüller's tutorial on Udemy React, NodeJS, Express & MongoDB - The MERN Fullstack Guide. I have made modifications and added new features to extend the functionality of the original project and I built upon that foundation to extend the project's functionality and address specific requirements. However, the core concept and initial implementation were inspired by the course and the work of the original author.

## New Features

1. **Cache Functionality**: Implemented the ability to cache places by userId using Redis. This caching mechanism improves performance by reducing the need for repetitive database queries.

2. **Integration Test**: Added unit and integration tests to ensure the reliability and correctness of the application. 

These additional features enhance the capabilities of the original project and provide added value in terms of functionality, performance, or user experience. They were implemented based on the requirements and insights gained from the course, as well as personal experimentation and problem-solving.

I would like to express my gratitude to the Based on Maximilian Schwarzmüller's course instructors for their teachings and inspiration, which played a significant role in the development of this project. Please note that this project is not affiliated with or endorsed by Maximilian Schwarzmüller, and any issues or inquiries regarding this modified version should be directed to my GitHub repository.
