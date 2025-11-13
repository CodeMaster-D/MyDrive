# Contributing to My Drive - Cloud File Storage Application

Thank you for your interest in contributing to "My Drive"! We're excited to have you on board. This document provides guidelines and information to help you get started with contributing to this cloud file storage application.

## Code of Conduct

This project adheres to a Code of Conduct to ensure a welcoming and inclusive environment for all contributors. Please take a moment to [read the full text](./CODE_OF_CONDUCT.md) to understand the expectations for participation.

## Our Development Process

We use GitHub to manage our project, track issues, discuss feature requests, and review pull requests. Our process is designed to be transparent and collaborative, ensuring that every contribution is valuable and aligns with the project's goals.

## Getting Started: Setting Up Your Development Environment

Before you can start contributing, you need to set up the project on your local machine. Please follow the detailed setup instructions in the main [README.md](README.md) file. Here's a quick checklist:

1.  **Fork and Clone** the repository to your local machine.
2.  **Install Dependencies** by running `npm install`.
3.  **Set up the Database** by creating the MySQL database and tables as described in the README.
4.  **Configure Environment Variables** by creating a `.env` file with your database credentials.
5.  **Create the `uploads` Directory** to ensure file uploads work correctly.

Once you can run the application locally with `node server/app.js`, you're ready to start contributing!

## How to Contribute

We welcome contributions in various forms, including bug fixes, new features, documentation improvements, and UI/UX enhancements. Please follow the steps below for a smooth contribution process.

### 1. Fork the Repository and Create a Branch

-   Fork this repository to your GitHub account.
-   Create a new branch from the `main` branch for your work. Use a descriptive name for your branch, for example: `feature/add-file-sharing` or `fix/fix-download-bug`.

### 2. Make Your Changes

-   **Backend Logic**: Most backend logic is located in the `server/` directory.
    -   `controllers/`: Contains the core logic for handling requests (e.g., user authentication, file operations).
    -   `routes/`: Defines the API endpoints.
    -   `middleware/`: Contains custom middleware, such as authentication checks.
-   **Frontend Logic**: The client-side code is in the `public/` directory.
    -   `html/`: HTML templates.
    -   `css/`: Stylesheets.
    -   `js/`: Client-side JavaScript for interactivity.
-   **Code Style**: Please follow the existing coding style and conventions in the project. Keep your code clean, readable, and well-commented where necessary.

### 3. Test Your Changes Thoroughly

Before submitting a pull request, it's crucial to test your changes to ensure they work as expected and don't introduce new issues. Please verify the following:

-   **User Authentication**: Test the registration, login, and logout flows.
-   **File Operations**:
    -   Can you successfully upload various types of files?
    -   Can you download the uploaded files correctly?
    -   Do the rename and delete functions work as intended?
-   **Security Checks**:
    -   Ensure that unauthenticated users cannot access protected pages or API endpoints.
    -   Verify that a user can only view, manage, and access their own files and not those of another user.
-   **UI/UX**: Check for any visual inconsistencies or broken elements in the browser.

### 4. Submit a Pull Request (PR)

-   **Commit Your Changes**: Write clear and concise commit messages that describe your changes.
-   **Push to Your Fork**: Push your changes to the feature branch on your forked repository.
-   **Open a Pull Request**: Navigate to the original repository on GitHub and open a new pull request against the `main` branch.
-   **PR Description**: Provide a clear and detailed description of your changes in the PR. Explain the problem you're solving or the feature you're adding, and link to any relevant issues.

We will review your pull request and provide feedback as soon as possible. Thank you for your contribution!

## Reporting Issues

If you find a bug or have a suggestion for a new feature, please open an issue on GitHub. When reporting a bug, please provide:

-   A clear and descriptive title.
-   Detailed steps to reproduce the issue.
-   The expected behavior versus the actual behavior.
-   Information about your environment (e.g., OS, Node.js version, browser version).
-   Any relevant error messages or screenshots.

## Areas of Contribution

If you're looking for ideas, here are some areas where we would particularly appreciate contributions:

1.  **Feature Enhancements**:
    -   Implementing a **folder system** for better file organization.
    -   Adding a **search functionality** to find files by name.
    -   Creating a **file sharing** feature to allow users to share files with others.
    -   Implementing **drag-and-drop** file uploads.
2.  **UI/UX Improvements**:
    -   Modernizing the user interface with a more contemporary design.
    -   Adding loading indicators for file operations.
    -   Improving error messages and user feedback.
3.  **Security Enhancements**:
    -   Implementing CSRF (Cross-Site Request Forgery) protection.
    -   Adding more robust file type validation on the backend.
    -   Implementing rate limiting on authentication endpoints to prevent brute-force attacks.
4.  **Testing**:
    -   Setting up a testing framework (e.g., Jest, Mocha) and writing unit and integration tests for the backend logic.
5.  **Documentation**:
    -   Improving the API documentation.
    -   Adding more in-line comments to the code to explain complex logic.

## License

By contributing to this project, you agree that your contributions will be licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for the full terms.
