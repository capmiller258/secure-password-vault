# Secure Vault - Password Manager

A secure, full-stack password manager built with Next.js and featuring client-side encryption to ensure user privacy. This project was built as a developer intern assignment.

**Live Demo URL:** 

---

## Key Features

-   **Strong Password Generator**: Create customizable, strong passwords with options for a length slider, including numbers, letters, and symbols, and excluding look-alike characters.
-   **Secure Personal Vault**: Save login credentials to a personal vault and view, edit, or delete the saved entries in a clean panel.
-   **Client-Side Encryption**: All sensitive vault items are encrypted in the browser before being sent to the server. The server never stores plaintext information, ensuring maximum privacy.
-   **Search & Filter**: Quickly find saved items with a basic real-time search that filters the vault list by title or username.

## Tech Stack

-   **Frontend**: Next.js (React), TypeScript, Tailwind CSS
-   **Backend**: Next.js API Routes, TypeScript
-   **Database**: MongoDB (with Mongoose)
-   **Authentication**: JSON Web Tokens (JWT)
-   **Encryption**: `crypto-js` (AES for encryption, PBKDF2 for key derivation)

## Getting Started (How to Run Locally)

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm
-   A free MongoDB Atlas account

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```
2.  **Install NPM packages:**
    ```sh
    npm install
    ```
3.  **Set up environment variables:**
    -   Create a file named `.env.local` in the root of the project.
    -   Add the following variables, replacing the placeholder values:
        ```
        MONGODB_URI=your_mongodb_connection_string
        JWT_SECRET=your_super_secret_key_for_json_web_tokens
        ```
4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Note on Cryptography

For client-side encryption, this project uses **`crypto-js
