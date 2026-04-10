# MyDrive - Cloud File Storage Application

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A secure and user-friendly cloud-based file storage application built with Node.js and Express. This application allows users to register, log in, and manage their personal files with features including upload, download, rename, and delete. It implements robust security measures with bcryptjs for password encryption and session-based authentication to ensure that user data and files are protected.

## Table of Contents

- [Key Features](#key-features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [Project Structure & Architecture](#project-structure--architecture)
- [Usage Guide](#usage-guide)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Security Features](#security-features)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Key Features

-   **User Authentication System**: Secure registration and login with encrypted passwords using bcryptjs. Session management ensures a protected user experience.
-   **Comprehensive File Management**: Users can easily upload files, view their file list, download, rename, and delete files directly from their dashboard.
-   **Security First**: Passwords are hashed, and session-based authentication prevents unauthorized access. Authorization checks ensure users can only manage their own files.
-   **Intuitive User Interface**: A clean and responsive frontend built with vanilla HTML, CSS, and JavaScript provides a seamless experience across login, registration, and file management dashboards.

---

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Make sure you have the following installed:
- **Node.js** (version 14 or higher)
- **MySQL Server** (version 5.7 or higher)
- **npm** (Node Package Manager)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/username/G-drive.git
    cd G-drive
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```
    This will install all necessary packages including `express`, `bcryptjs`, `mysql2`, `multer`, and `dotenv`.

### Database Setup

1.  Open your MySQL client and create the database:
    ```sql
    CREATE DATABASE file_storage_dbb;
    ```

2.  Use the newly created database and run the following SQL script to create the required tables:
    ```sql
    USE file_storage_dbb;

    CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE files (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    ```

3.  Configure your database connection by creating a `.env` file in the root directory:
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=file_storage_dbb
    ```

4.  Create the `uploads` directory in the root of the project to store uploaded files:
    ```bash
    mkdir uploads
    ```

### Running the Application

Start the server with the following command:

```bash
node server/app.js
```

The application will be running at `http://localhost:3000`.

---

## Project Structure & Architecture

The project follows a modular MVC-like pattern to separate concerns, making it scalable and maintainable.

```
G-drive/
├── .env                          # Environment variables
├── package.json                  # Project dependencies and scripts
├── public/                       # Frontend assets
│   ├── css/style.css            # Stylesheets
│   ├── html/                    # HTML pages
│   └── js/script.js             # Client-side scripts
├── server/
│   ├── app.js                   # Express server setup
│   ├── controllers/             # Business logic
│   ├── middleware/              # Custom middleware (e.g., auth)
│   └── routes/                  # API routes
└── uploads/                      # Storage for uploaded files
```

---

## Usage Guide

### Registering and Logging In
1.  Navigate to `http://localhost:3000`.
2.  Click "Register here" to create a new account.
3.  After registering, use your credentials to log in.

## login 
1.  username    : user
2.  password    : user123

### Managing Files
-   **Upload**: Use the upload form on the dashboard to add files.
-   **View**: All your uploaded files are listed on the dashboard.
-   **Download**: Click on a file name to download it.
-   **Rename**: Click the "Rename" button next to a file to change its name.
-   **Delete**: Click the "Delete" button to permanently remove a file.

---

## API Endpoints

### Authentication
- `POST /register` - Register a new user.
- `POST /login` - Authenticate a user and create a session.
- `POST /logout` - End the user's session.
- `GET /check-login` - Verify if a user is logged in.

### File Management
- `POST /upload` - Upload a file to the server.
- `GET /files` - Retrieve a list of files for the logged-in user.
- `PUT /files/:id` - Update the name of a specific file.
- `DELETE /files/:id` - Delete a specific file.

---

## Technologies Used

-   **Backend**: Node.js, Express.js
-   **Database**: MySQL
-   **Authentication**: bcryptjs, express-session
-   **File Handling**: Multer
-   **Frontend**: HTML, CSS, JavaScript (Vanilla)
-   **Environment Management**: dotenv

---

## Security Features

-   **Password Hashing**: User passwords are hashed using bcryptjs before storage.
-   **Session Management**: Secure session handling to maintain user login state.
-   **Authorization**: Server-side checks to ensure users can only access their own files.
-   **Input Validation**: Backend validation to prevent malicious input.

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## License

This project is licensed under the **Apache License 2.0**—see the **[LICENSE](LICENSE)** file for the full terms and the **[NOTICE](NOTICE)** file for copyright and attribution details.

---

